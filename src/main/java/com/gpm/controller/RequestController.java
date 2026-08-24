package com.gpm.controller;

import com.gpm.dto.CertificateRequestDto;
import com.gpm.dto.UserDto;
import com.gpm.entity.*;
import com.gpm.repository.UserRepo;
import com.gpm.service.CustomUserDetailsService;
import com.gpm.service.RequestService;
import jakarta.validation.Valid;
import org.modelmapper.internal.bytebuddy.asm.Advice;
import org.modelmapper.internal.bytebuddy.implementation.bind.annotation.Origin;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping("/api/v1/requests")
public class RequestController {

    @Autowired
    private RequestService requestService;

    @Autowired
    private UserRepo userRepository;

    @PostMapping("/apply")
    public ResponseEntity<?> applyForCertificate(@AuthenticationPrincipal Jwt jwt,
                                                 @Valid @RequestBody CertificateRequestDto.ApplyRequest applyRequest) {
        try {
            User user = userRepository.findByUsername(jwt.getSubject()).orElseThrow();
            CertificateRequestDto.CertificateRequestResponse response = requestService.applyRequest(user, applyRequest);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new UserDto.MessageResponse(e.getMessage()+jwt.getSubject(), false));
        }
    }

    @GetMapping("/my-requests")
    public ResponseEntity<?> getMyRequests(@AuthenticationPrincipal Jwt jwt) {
        try {
            User user = userRepository.findByUsername(jwt.getSubject()).orElseThrow();
            List<CertificateRequestDto.CertificateRequestResponse> requests = requestService.getMyRequests(user);
            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new UserDto.MessageResponse(e.getMessage(), false));
        }
    }

}
