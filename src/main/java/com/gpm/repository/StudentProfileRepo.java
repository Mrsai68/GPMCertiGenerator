package com.gpm.repository;

import com.gpm.entity.StudentProfile;
import com.gpm.entity.User;
import org.jspecify.annotations.NullMarked;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface StudentProfileRepo extends JpaRepository<StudentProfile, Long> {

    Optional<StudentProfile> findByEnrollmentNo(String enrollmentNo);
    boolean existsByEnrollmentNo(String enrollmentNo);
    Optional<StudentProfile> findByUser(User user);
    @NullMarked
    List<StudentProfile> findAll();

}
