package com.pms.pms.runners;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.pms.pms.entity.Roles;
import com.pms.pms.repository.RolesRepository;


@Component
public class RolesRunner implements CommandLineRunner {

    @Autowired
    RolesRepository rolesRepo;

    @Override
    public void run(String... args) throws Exception {

        // save roles
        if (rolesRepo.count() == 0) {
            rolesRepo.saveAllAndFlush(Arrays.asList(
                    new Roles("ADMIN"),
                    new Roles("CUSTOMER")
            ));
        }

    }
}