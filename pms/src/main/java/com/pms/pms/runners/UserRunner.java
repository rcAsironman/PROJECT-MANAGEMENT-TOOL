package com.pms.pms.runners;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import com.pms.pms.entity.Roles;
import com.pms.pms.entity.User;
import com.pms.pms.exceptions.DataNotFoundException;
import com.pms.pms.repository.RolesRepository;
import com.pms.pms.repository.UserRepository;

@Component
public class UserRunner implements CommandLineRunner {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private RolesRepository rolesRepo;
    
    @Autowired
	private BCryptPasswordEncoder passwordEncoder;	

    @Override
    public void run(String... args) throws Exception {
        // Insert users only if table is empty
        if (userRepo.count() == 0) {

            // Fetch roles by name (assuming they are already inserted by RolesRunner)
            Roles adminRole = rolesRepo.findByRoleName("ADMIN").orElseThrow(() -> new DataNotFoundException("Role Not found"));

            // Add default users
            userRepo.saveAllAndFlush(Arrays.asList(
                new User(1, "adminuser", "admin@example.com", 9876543210L, passwordEncoder.encode("admin@123"),"admin", adminRole)
            ));
        }
    }
}
