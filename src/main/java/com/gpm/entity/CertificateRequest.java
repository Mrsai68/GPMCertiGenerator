package com.gpm.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.ZonedDateTime;

@Setter
@Getter
@Entity
@Table(name = "certificate_requests")
public class CertificateRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "request_id")
    private Long requestId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 255)
    private String purpose;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private RequestStatus status = RequestStatus.PENDING;

    @Column(name = "applied_date")
    private ZonedDateTime appliedDate = ZonedDateTime.now();

    @Column(name = "approved_date")
    private ZonedDateTime approvedDate;

    @Column(length = 255)
    private String remarks;

    public CertificateRequest() {}

    public CertificateRequest(User user, String purpose) {
        this.user = user;
        this.purpose = purpose;
        this.status = RequestStatus.PENDING;
        this.appliedDate = ZonedDateTime.now();
    }
}
