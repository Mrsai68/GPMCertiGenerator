package com.gpm.dto;

import lombok.*;
import jakarta.validation.constraints.*;

import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
public class UserDto {

    private Long userId;
    private String username;
    private String email;
    private String password;
    private Set<RoleDto> role;
    private String department;
    private boolean isActive = true;
    private ZonedDateTime createdAt;
    private List<String> Response;

    public UserDto() {

    }

    @Setter
    @Getter
    public static class RegisterUser{

        @NotBlank
        @Size(min = 4, max = 20)
        private String username;

        @NotBlank
        @Size(min = 8, max = 16)
        private String password;

        @NotBlank
        private String Department;
    }

    @Setter
    @Getter
    public static class LoginRequest{

        @NotBlank
        private String username;
        @NotBlank
        private String password;

    }

    @Setter
    @Getter
    public static class RegisterRequest{

        @NotBlank
        @Size(min = 4, max = 20)
        private String username;

        @NotBlank(message = "Email is Required")
        @Email
        private String email;

        @NotBlank
        @Size(min = 8, max = 16)
        private String password;

        @NotBlank
        private String enrollmentNo;

        @NotBlank
        private String Name;

        @NotBlank
        private String YearOfStudy;

        @NotBlank
        private String Department;

        private String academicYear = "2026-2027";

        private String gender;

        private String contactNo;

    }

    @Setter
    @Getter
    public static class JwtResponse{

        private String token;
        private String type = "Bearer";
        private Long userId;
        private String username;
        private String email;
        private String role;
        private String fullName;
        private String enrollmentNo;
        private String department;

        public JwtResponse(String token, Long userId, String username, String email, String role, String fullName, String enrollmentNo, String department) {
            this.token = token;
            this.userId = userId;
            this.username = username;
            this.email = email;
            this.role = role;
            this.fullName = fullName;
            this.enrollmentNo = enrollmentNo;
            this.department = department;
        }
    }

    @Getter
    @Setter
    public static class MessageResponse{

        private String message;
        private boolean success;

        public MessageResponse(String message, boolean success){
            this.message = message;
            this.success = success;
        }

    }

    @Getter
    @Setter
    @AllArgsConstructor
    public static class LoginResponse{
        private String accessToken;
        private String username;
        private String role;
        private String department;
        private String enrollment;
        private String fullName;
    }

    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StudentResponseDTO {
        private Long id;
        private String username;
        private String fullName;
        private String enrollmentNo;
        private String email;
        private String department;
        private String yearOfStudy;
    }

    @Setter
    @Getter
    public static class getUserResponse{

        String username;
        String email;
        String role;
        boolean success;

        public getUserResponse(String username, String email, String role, boolean success) {
            this.username = username;
            this.email = email;
            this.role = role;
            this.success = success;
        }

    }

    @Setter
    @Getter
    public static class forgetPasswordRequest{

        @NotBlank
        @Email
        private String email;

    }

    @Setter
    @Getter
    public static class ResetPasswordRequest{

        @NotBlank
        @Email
        private String email;
        @NotBlank
        @Size(max = 6)
        private String otpCode;
        @NotBlank
        @Size(min = 6)
        private String newPassword;

    }
}
