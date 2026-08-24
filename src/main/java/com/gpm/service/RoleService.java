package com.gpm.service;

import com.gpm.entity.Role;
import com.gpm.repository.RoleRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RoleService {

    @Autowired
    private RoleRepo roleRepo;

    public void addRole(Role role){
       roleRepo.save(role);
    }
}
