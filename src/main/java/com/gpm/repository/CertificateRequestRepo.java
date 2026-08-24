package com.gpm.repository;

import com.gpm.entity.CertificateRequest;
import com.gpm.entity.RequestStatus;
import com.gpm.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CertificateRequestRepo extends JpaRepository<CertificateRequest, Long> {
    List<CertificateRequest> findByUserOrderByAppliedDateDesc(User user);
    List<CertificateRequest> findAllByOrderByAppliedDateDesc();
    Boolean existsByUserAndPurposeAndStatus(@Param("user") User user, String purpose, RequestStatus status);
}

