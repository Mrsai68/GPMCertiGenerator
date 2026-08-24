package com.gpm.entity;


import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jdk.jfr.Enabled;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.ZonedDateTime;

@Entity
@Table(name = "otp_log")
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ResetOtpPassword {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "otp_id")
    private Long otpId;

    @Column(nullable = false, length = 100)
    private String email;

    @Column(name = "otp_code", nullable = false, length = 6)
    private String otpCode;

    @Column(name = "expiry_time", nullable = false)
    private ZonedDateTime expiryTime;

    @Column(name = "is_used")
    private Boolean isUsed = false;

    @Column(name = "created_at", insertable = false, updatable = false)
    private ZonedDateTime createdAt;

    public ResetOtpPassword(@NotBlank @Email String email, String otp, ZonedDateTime expiry) {

        this.email = email;
        this.otpCode = otp;
        this.expiryTime = expiry;

    }
}
