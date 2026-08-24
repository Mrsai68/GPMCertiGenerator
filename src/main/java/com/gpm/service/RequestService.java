package com.gpm.service;


import com.gpm.dto.CertificateRequestDto.*;
import com.gpm.entity.*;
import com.gpm.repository.CertificateRequestRepo;
import com.gpm.repository.IssuedCetificateRepo;
import com.gpm.repository.StudentProfileRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class RequestService {

    @Autowired
    private CertificateRequestRepo requestRepo;

    @Autowired
    private StudentProfileRepo studentProfileRepo;

    @Autowired
    private IssuedCetificateRepo issuedCetificateRepo;

    @Autowired
    private PdfQrGenerateService pdfQrGenerateService;

    @Autowired
    private EmailService emailService;

    private CertificateRequestResponse mapToDTO(CertificateRequest req) {
        CertificateRequestResponse dto = new CertificateRequestResponse();
        dto.setRequestId(req.getRequestId());
        dto.setUserId(req.getUser().getUserId());
        dto.setUsername(req.getUser().getUsername());
        dto.setPurpose(req.getPurpose());
        dto.setStatus(req.getStatus().name());
        dto.setAppliedDate(req.getAppliedDate());
        dto.setApprovedDate(req.getApprovedDate());
        dto.setRemarks(req.getRemarks());

        StudentProfile profile = studentProfileRepo.findByUser((req.getUser())).orElse(null);
        if (profile != null) {
            dto.setFullName(profile.getFullName());
            dto.setEnrollmentNo(profile.getEnrollmentNo());
            dto.setDepartment(profile.getDepartment());
            dto.setYearOfStudy(profile.getYearOfStudy());
            dto.setAcademicYear(profile.getAcademicYear());
        }

        if (req.getStatus() == RequestStatus.APPROVED) {
            IssuedCertificate cert = issuedCetificateRepo.findByRequest(req).orElse(null);
            if (cert != null) {
                dto.setCertificateNumber(cert.getCertificateNumber());
                dto.setVerificationToken(cert.getVerificationToken());
            }
        }
        return dto;
    }

    public CertificateRequestResponse applyRequest(User user, ApplyRequest applyRequest){
        if(requestRepo.existsByUserAndPurposeAndStatus(user, applyRequest.getPurpose(), RequestStatus.PENDING)){
            throw  new RuntimeException("You already have an active PENDING request for "+ applyRequest.getPurpose()+". Duplicate requests are not allowed.");
        }

        CertificateRequest req = new CertificateRequest(user, applyRequest.getPurpose());
        CertificateRequest saved = (CertificateRequest) requestRepo.save(req);

        return mapToDTO(saved);
    }

    public List<CertificateRequestResponse> getMyRequests(User user) {
        return requestRepo.findByUserOrderByAppliedDateDesc(user)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<CertificateRequestResponse> getAllRequests() {
        return requestRepo.findAllByOrderByAppliedDateDesc()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<CertificateRequestResponse> getRequestsForAdminOrHod(User currentUser) {
        List<CertificateRequest> allRequests = requestRepo.findAllByOrderByAppliedDateDesc();

        if (currentUser.getRole().stream().anyMatch(role -> role.getName()==RoleName.ROLE_ADMIN) || "ALL".equalsIgnoreCase(currentUser.getDepartment())) {
            return allRequests.stream().map(this::mapToDTO).collect(Collectors.toList());
        }

        // For HOD: filter requests where the student's department matches HOD's assigned department
        String hodDept = currentUser.getDepartment();
        return allRequests.stream()
                .filter(req -> {
                    StudentProfile profile = studentProfileRepo.findByUser(req.getUser()).orElse(null);
                    return profile != null && profile.getDepartment() != null && profile.getDepartment().equalsIgnoreCase(hodDept);
                })
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public CertificateRequestResponse approveRequest(Long requestId, ApproveRejectRequest reqBody) {
        CertificateRequest req = requestRepo.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found with id: " + requestId));

        if (req.getStatus() != RequestStatus.PENDING) {
            throw new RuntimeException("Request has already been processed with status: " + req.getStatus());
        }

        req.setStatus(RequestStatus.APPROVED);
        req.setApprovedDate(ZonedDateTime.now());
        if (reqBody != null && reqBody.getRemarks() != null && !reqBody.getRemarks().isBlank()) {
            req.setRemarks(reqBody.getRemarks());
        } else {
            req.setRemarks("Approved by HOD");
        }

        CertificateRequest updatedReq = requestRepo.save(req);

        // Generate unique cert number & verification token
        String certNo = "CERT-" + System.currentTimeMillis() % 1000000;
        String verificationToken = UUID.randomUUID().toString();

        IssuedCertificate cert = new IssuedCertificate(updatedReq, certNo, verificationToken);
        IssuedCertificate savedCert = issuedCetificateRepo.save(cert);

        // Fetch Student Profile
        StudentProfile profile = studentProfileRepo.findByUser((req.getUser())).orElse(null);

        // Generate PDF & Dispatch Email
        if (profile != null) {
            try {
                byte[] pdfBytes = pdfQrGenerateService.generateCertificatePdf(savedCert, profile);
                emailService.sendCertificateApprovalEmail(
                        req.getUser().getEmail(),
                        profile.getFullName(),
                        req.getPurpose(),
                        certNo,
                        pdfBytes
                );
            } catch (Exception e) {
                System.err.println("Error generating PDF / sending email: " + e.getMessage());
            }
        }

        return mapToDTO(updatedReq);
    }

    public CertificateRequestResponse rejectRequest(Long requestId, ApproveRejectRequest reqBody) {
        CertificateRequest req = requestRepo.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found with id: " + requestId));

        if (req.getStatus() != RequestStatus.PENDING) {
            throw new RuntimeException("Request has already been processed with status: " + req.getStatus());
        }

        String remarks = (reqBody != null && reqBody.getRemarks() != null && !reqBody.getRemarks().isBlank())
                ? reqBody.getRemarks() : "Rejected by HOD due to incomplete documentation.";

        req.setStatus(RequestStatus.REJECTED);
        req.setRemarks(remarks);

        CertificateRequest updatedReq = requestRepo.save(req);

        StudentProfile profile = studentProfileRepo.findByUser((req.getUser())).orElse(null);
        String studentName = profile != null ? profile.getFullName() : req.getUser().getUsername();

        // Email Notification
        emailService.sendCertificateRejectionEmail(req.getUser().getEmail(), studentName, req.getPurpose(), remarks);

        return mapToDTO(updatedReq);
    }

    public byte[] getCertificatePdfByRequestId(Long requestId) throws Exception {
        CertificateRequest req = requestRepo.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (req.getStatus() != RequestStatus.APPROVED) {
            throw new RuntimeException("Certificate has not been approved yet.");
        }

        IssuedCertificate cert = issuedCetificateRepo.findByRequest(req)
                .orElseThrow(() -> new RuntimeException("Issued certificate record not found"));

        StudentProfile profile = studentProfileRepo.findByUser((req.getUser()))
                .orElseThrow(() -> new RuntimeException("Student profile not found"));

        return pdfQrGenerateService.generateCertificatePdf(cert, profile);
    }

    public PublicVerificationResponse verifyToken(String token) {
        IssuedCertificate cert = issuedCetificateRepo.findByVerificationToken(token).orElse(null);

        if (cert == null || !cert.getIsValid()) {
            return new PublicVerificationResponse(false, "Document Tampered or Invalid Certificate Token.");
        }

        CertificateRequest req = cert.getRequest();
        StudentProfile profile = studentProfileRepo.findByUser((req.getUser())).orElse(null);

        PublicVerificationResponse resp = new PublicVerificationResponse(true, "Authentic Bonafide Certificate Verified!");
        resp.setCertificateNumber(cert.getCertificateNumber());
        resp.setIssueDate(cert.getIssueDate());
        resp.setPurpose(req.getPurpose());

        if (profile != null) {
            resp.setFullName(profile.getFullName());
            resp.setEnrollmentNo(profile.getEnrollmentNo());
            resp.setDepartment(profile.getDepartment());
            resp.setYearOfStudy(profile.getYearOfStudy());
            resp.setAcademicYear(profile.getAcademicYear());
        } else {
            resp.setFullName(req.getUser().getUsername());
        }

        return resp;
    }

}