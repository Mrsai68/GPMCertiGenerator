package com.gpm.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.ZonedDateTime;

@Entity
@Setter
@Getter
@Table(name = "issued_certificates")
public class IssuedCertificate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "certificate_id")
    private Long certificateId;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "request_id", nullable = false, unique = true)
    private CertificateRequest request;

    @Column(name = "certificate_number", nullable = false, unique = true, length = 50)
    private String certificateNumber;

    @Column(name = "verification_token", nullable = false, unique = true, length = 64)
    private String verificationToken;

    @Column(name = "issue_date")
    private ZonedDateTime issueDate = ZonedDateTime.now();

    @Column(name = "is_valid")
    private Boolean isValid = true;

    public IssuedCertificate() {}

    public IssuedCertificate(CertificateRequest request, String certificateNumber, String verificationToken) {
        this.request = request;
        this.certificateNumber = certificateNumber;
        this.verificationToken = verificationToken;
        this.issueDate = ZonedDateTime.now();
        this.isValid = true;
    }
}
