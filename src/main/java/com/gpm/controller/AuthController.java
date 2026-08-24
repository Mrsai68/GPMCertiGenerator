package com.gpm.controller;

import com.gpm.dto.UserDto;
import com.gpm.dto.UserDto.*;
import com.gpm.entity.User;
import com.gpm.exception.ResoureceNotFound;
import com.gpm.repository.StudentProfileRepo;
import com.gpm.repository.UserRepo;
import com.gpm.service.AuthService;
import com.gpm.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepo userRepo;

    @PostMapping("/register")
    public ResponseEntity<MessageResponse> createUser(@RequestBody RegisterRequest userDto){
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.registerStudent(userDto));
    }

    @PostMapping("/userreg")
    public ResponseEntity<MessageResponse> createUserHod(@RequestBody RegisterUser user){
        return ResponseEntity.ok(authService.registerUser(user));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest) {
        return ResponseEntity.ok(authService.login(loginRequest.getUsername(), loginRequest.getPassword()));

    }

    @GetMapping("/email/{emailId}")
    public ResponseEntity<UserDto.getUserResponse> getUserByEmail(@PathVariable String emailId){
        return ResponseEntity.ok(authService.getUserByEmail(emailId));
    }

    @PostMapping("/forget-password")
    public ResponseEntity<MessageResponse> forgetPassword(@RequestBody forgetPasswordRequest forgetPasswordRequest){
        return ResponseEntity.ok(authService.forgetPassword(forgetPasswordRequest));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<MessageResponse> ResetPassword(@RequestBody ResetPasswordRequest resetPasswordRequest){
        return ResponseEntity.ok(authService.resetPassword(resetPasswordRequest));
    }
}
