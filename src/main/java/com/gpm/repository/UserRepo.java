package com.gpm.repository;

import com.gpm.dto.UserDto;
import com.gpm.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepo extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    @Query("SELECT u FROM User u WHERE u.username = :username")
    Optional<User> findByUsername(@Param("username") String username);
    List<User> findByRole(String role);
    boolean existsByEmail(String email);
    boolean existsByUsername(String username);
}
