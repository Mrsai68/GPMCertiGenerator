package com.gpm.repository;

import com.gpm.entity.Role;
import com.gpm.entity.RoleName;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Set;

public interface RoleRepo extends JpaRepository<Role, Long> {

    Set<Role> findByName(RoleName name);
}
