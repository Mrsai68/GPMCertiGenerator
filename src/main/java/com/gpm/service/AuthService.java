package com.gpm.service;

import com.gpm.dto.UserDto;
import com.gpm.dto.UserDto.*;
import com.gpm.entity.*;
import com.gpm.exception.ResoureceNotFound;
import com.gpm.repository.ResetPasswordRepo;
import com.gpm.repository.RoleRepo;
import com.gpm.repository.StudentProfileRepo;
import com.gpm.repository.UserRepo;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;

@Service
@AllArgsConstructor
public class AuthService {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private RoleRepo roleRepo;

    @Autowired
    private StudentProfileRepo studentProfileRepo;

    @Autowired
    private ResetPasswordRepo resetPasswordRepo;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private EmailService emailService;

    @Autowired
    private JwtService jwtService;

    private final ModelMapper modelMapper;

    private final PasswordEncoder passwordEncoder;

    @Transactional
    public MessageResponse registerUser(RegisterUser req){
        if (userRepo.existsByUsername(req.getUsername())) {
            return new MessageResponse("Error: Username " + req.getUsername() + " has already taken!", false);
        }

        Set<Role> role = roleRepo.findByName(RoleName.ROLE_ADMIN);
        String pass = passwordEncoder.encode(req.getPassword());
        User user = new User(req.getUsername(), "sairaj0608@gmail.coms", pass, role, req.getDepartment());
        User savedUser = userRepo.save(user);

        return new MessageResponse("User created Successfully",true);
    }

    @Transactional
    public MessageResponse registerStudent(RegisterRequest req) {

        if (userRepo.existsByUsername(req.getUsername())) {
            return new MessageResponse("Error: Username " + req.getUsername() + " has already taken!", false);
        }

        if (userRepo.existsByEmail(req.getEmail())) {
            return new MessageResponse("Error: Email " + req.getEmail() + " already registered", false);
        }

        if (studentProfileRepo.existsByEnrollmentNo(req.getEnrollmentNo())) {
            return new MessageResponse("Error: Enrollment No " + req.getEnrollmentNo() + " already exists", false);
        }

        Set<Role> role = roleRepo.findByName(RoleName.ROLE_STUDENT);
        String pass = passwordEncoder.encode(req.getPassword());
        User user = new User(req.getUsername(), req.getEmail(), pass, role, req.getDepartment());
        User savedUser = userRepo.save(user);

        StudentProfile profile = new StudentProfile();
        profile.setUser(savedUser);
        profile.setEnrollmentNo(req.getEnrollmentNo());
        profile.setFullName(req.getName());
        profile.setYearOfStudy(req.getYearOfStudy());
        profile.setAcademicYear(req.getAcademicYear());
        profile.setDepartment(req.getDepartment());
        profile.setGender(req.getGender());
        profile.setContactNo(req.getContactNo());

        studentProfileRepo.save(profile);

        return new MessageResponse("Student Registered Successfully! Welcome Email sent to " + req.getEmail(), true);
    }

    public LoginResponse login(String username, String pasword) {

        User user = userRepo.findByUsername(username).get();
        CustomUserDetails customUserDetails = new CustomUserDetails(user);
        Authentication authenticationReq =
                UsernamePasswordAuthenticationToken.unauthenticated(
                        username,
                        pasword
                );
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(customUserDetails, null , customUserDetails.getAuthorities());

        Authentication authentication =
                authenticationManager.authenticate(authenticationReq);

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtService.generateToken(authentication);

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        String role = userDetails.getAuthorities().iterator().next().getAuthority();

        String token = jwtService.generateToken(authentication);

        StudentProfile std = new StudentProfile();

        if (Objects.equals(role, "ROLE_STUDENT"))
        { std = studentProfileRepo.findByUser(user).get();}

        return new LoginResponse(token, username, role, std.getDepartment(), std.getEnrollmentNo(), std.getFullName());
    }

    public getUserResponse getUserByEmail(String emailid) {

        User user = userRepo.findByEmail(emailid).orElseThrow(()-> new IllegalArgumentException("User Not Found!"));

        if (!user.isActive()){
            return new getUserResponse(user.getUsername(), user.getEmail(), user.getRole().toString(),false);
        }

        return new getUserResponse(user.getUsername(), user.getEmail(), user.getRole().toString(), true);

    }

    public MessageResponse forgetPassword(forgetPasswordRequest req){

        User user = userRepo.findByEmail(req.getEmail()).orElse(null);
        if(user == null){
            return new MessageResponse("Email Not Registered !", false);
        }

        SecureRandom random = new SecureRandom();
        String otp = String.format("%06d", random.nextInt(1000000));
        ZonedDateTime expiry = ZonedDateTime.now().plusMinutes(15);

        List<ResetOtpPassword> previousOtp = resetPasswordRepo.findByEmail(req.getEmail());

        for(ResetOtpPassword oldOtp : previousOtp){
            oldOtp.setIsUsed(true);
        }
        resetPasswordRepo.saveAll(previousOtp);

        ResetOtpPassword resetOtp = new ResetOtpPassword(req.getEmail(), otp, expiry);
        resetPasswordRepo.save(resetOtp);

        ResetOtpPassword resetOtpPassword = new ResetOtpPassword(req.getEmail(), otp, expiry);

        emailService.sendPasswordResetOtpEmail(req.getEmail(), otp);

        return new MessageResponse("6 digit Otp sent to "+ req.getEmail(), true);
    }

    public MessageResponse resetPassword(ResetPasswordRequest req) {
        User user = userRepo.findByEmail(req.getEmail()).orElse(null);
        if (user == null) {
            return new MessageResponse("No account found registered with email: " + req.getEmail(), false);
        }

        ResetOtpPassword otpRecord = resetPasswordRepo.findTopByEmailAndIsUsedFalseOrderByCreatedAtDesc(req.getEmail()).orElse(null);
        if (otpRecord == null) {
            return new MessageResponse("No active OTP request found for this email. Please click 'Send OTP' again.", false);
        }

        if (ZonedDateTime.now().isAfter(otpRecord.getExpiryTime())) {
            return new MessageResponse("OTP code has expired. Please request a new OTP.", false);
        }

        if (!otpRecord.getOtpCode().equals(req.getOtpCode().trim())) {
            return new MessageResponse("Invalid 6-digit OTP code. Please check and try again.", false);
        }

        // Update password & invalidate OTP
        user.setPassword(passwordEncoder.encode(req.getNewPassword()));
        userRepo.save(user);

        otpRecord.setIsUsed(true);
        resetPasswordRepo.save(otpRecord);

        return new MessageResponse("Password updated successfully! You may now sign in with your new password.", true);
    }
}
