package com.pms.pms.configuration;

import java.util.Optional;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import lombok.extern.slf4j.Slf4j;

@Configuration
@Slf4j
public class AuditingConfig {

	@Bean
	@Transactional(propagation = Propagation.NOT_SUPPORTED)
	AuditorAware<String> auditorProvider() {
		return () -> {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            if (authentication == null || !authentication.isAuthenticated() ||
                "anonymousUser".equals(authentication.getPrincipal())) {
                log.warn("No authenticated user found, returning 'SYSTEM' as auditor.");
                return Optional.of("SYSTEM"); // Default value for system-level operations
            }

            Object principal = authentication.getPrincipal();
            log.info("Authentication Principal: {}", principal);

            if (principal instanceof UserDetails) {
                return Optional.of(((UserDetails) principal).getUsername());
            } else {
                return Optional.of(principal.toString());
            }
        };
	}

}