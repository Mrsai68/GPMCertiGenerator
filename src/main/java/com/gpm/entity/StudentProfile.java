package com.gpm.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
@Table(name = "student_profile")
public class StudentProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "profile_id")
    private Long profileId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "enrollment_no", nullable = false, unique = true, length = 20)
    private String enrollmentNo;

    @Column(name = "full_name", nullable = false, length = 100)
    private String fullName;

    @Column(nullable = false, length = 50)
    private String department;

    @Column(name = "year_of_study", nullable = false, length = 100)
    private String yearOfStudy; // FY, SY, TY, Final Year

    @Column(name = "academic_year", nullable = false, length = 15)
    private String academicYear; // e.g., 2025-2026
    @Column(length = 10)
    private String gender;

    @Column(name = "contact_no", length = 15)
    private String contactNo;

    public StudentProfile(){}
}
