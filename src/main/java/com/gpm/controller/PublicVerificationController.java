package com.gpm.controller;

import com.gpm.dto.CertificateRequestDto;
import com.gpm.service.RequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/v1/public")
public class PublicVerificationController {

    @Autowired
    private RequestService requestService;

    @GetMapping("/verify/{token}")
    public ResponseEntity<?> verifyCertificateToken(@PathVariable String token) {
        CertificateRequestDto.PublicVerificationResponse response = requestService.verifyToken(token);
        return ResponseEntity.ok(response);
    }
}
