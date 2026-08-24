package com.gpm.repository;

import com.gpm.entity.CertificateRequest;
import com.gpm.entity.IssuedCertificate;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface IssuedCetificateRepo extends JpaRepository<IssuedCertificate, Long> {

    Optional<IssuedCertificate> findByRequest(CertificateRequest request);
    Optional<IssuedCertificate> findByVerificationToken(String verificationToken);
    Optional<IssuedCertificate> findByCertificateNumber(String certificateNumber);

}
