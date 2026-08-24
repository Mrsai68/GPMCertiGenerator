package com.gpm.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.ZonedDateTime;

@Getter
@Setter
@AllArgsConstructor
public class CertificateRequestDto {

    @Setter
    @Getter
    public static class ApplyRequest {
        @NotBlank
        private String purpose;
    }

    @Setter
    @Getter
    public static class ApproveRejectRequest {
        private String remarks;
    }

    @Setter
    @Getter
    public static class CertificateRequestResponse {
        private Long requestId;
        private Long userId;
        private String username;
        private String fullName;
        private String enrollmentNo;
        private String department;
        private String yearOfStudy;
        private String academicYear;
        private String purpose;
        private String status;
        private ZonedDateTime appliedDate;
        private ZonedDateTime approvedDate;
        private String remarks;
        private String certificateNumber;
        private String verificationToken;
    }

    @Setter
    @Getter
    public static class PublicVerificationResponse {
        private boolean valid;
        private String message;
        private String certificateNumber;
        private String fullName;
        private String enrollmentNo;
        private String department;
        private String yearOfStudy;
        private String academicYear;
        private String purpose;
        private ZonedDateTime issueDate;

        public PublicVerificationResponse(boolean valid, String message) {
            this.valid = valid;
            this.message = message;
        }
    }
}

