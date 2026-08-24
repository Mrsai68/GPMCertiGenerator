package com.gpm.repository;

import com.gpm.entity.ResetOtpPassword;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ResetPasswordRepo extends JpaRepository<ResetOtpPassword, Long> {

    List<ResetOtpPassword> findByEmail(String email);
    Optional<ResetOtpPassword> findTopByEmailAndIsUsedFalseOrderByCreatedAtDesc(String email);
}
