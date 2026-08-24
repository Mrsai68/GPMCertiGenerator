package com.gpm.controller;

import com.gpm.dto.UserDto;
import com.gpm.service.RequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/v1/certificates")
public class CertificateDownloadController {

    @Autowired
    private RequestService requestService;

    @GetMapping("/download/{requestId}")
    public ResponseEntity<?> downloadCertificatePdf(@PathVariable Long requestId) {
        try {
            byte[] pdfBytes = requestService.getCertificatePdfByRequestId(requestId);
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_PDF)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"Bonafide_Certificate_" + requestId + ".pdf\"")
                    .body(pdfBytes);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new UserDto.MessageResponse(e.getMessage(), false));
        }
    }

}
