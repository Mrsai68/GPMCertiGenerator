package com.gpm.controller;

import com.gpm.dto.CertificateRequestDto;
import com.gpm.dto.UserDto;
import com.gpm.entity.StudentProfile;
import com.gpm.entity.User;
import com.gpm.repository.StudentProfileRepo;
import com.gpm.repository.UserRepo;
import com.gpm.service.RequestService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/v1/admin")
@PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_HOD')")
public class HodAdmin {

    @Autowired
    private RequestService requestService;

    @Autowired
    private UserRepo userRepository;

    @Autowired
    private StudentProfileRepo studentProfileRepo;

    @Autowired
    private ModelMapper modelMapper;

    @GetMapping("/students")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> getAllRegisteredStudents() {
        List<StudentProfile> response = studentProfileRepo.findAll();
               return ResponseEntity.ok(response);
    }

    @GetMapping("/requests")
    public ResponseEntity<?> getAllRequests(@AuthenticationPrincipal Jwt jwt) {
        try {
            User currentUser = userRepository.findByUsername(jwt.getSubject()).orElseThrow();
            List<CertificateRequestDto.CertificateRequestResponse> requests = requestService.getRequestsForAdminOrHod(currentUser);
            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new UserDto.MessageResponse(e.getMessage(), false));
        }
    }

    @PutMapping("/requests/{requestId}/approve")
    public ResponseEntity<?> approveRequest(@PathVariable Long requestId,
                                            @RequestBody(required = false) CertificateRequestDto.ApproveRejectRequest body) {
        try {
            CertificateRequestDto.CertificateRequestResponse response = requestService.approveRequest(requestId, body);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new UserDto.MessageResponse(e.getMessage(), false));
        }
    }

    @PutMapping("/requests/{requestId}/reject")
    public ResponseEntity<?> rejectRequest(@PathVariable Long requestId,
                                           @RequestBody(required = false) CertificateRequestDto.ApproveRejectRequest body) {
        try {
            CertificateRequestDto.CertificateRequestResponse response = requestService.rejectRequest(requestId, body);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new UserDto.MessageResponse(e.getMessage(), false));
        }
    }

}
