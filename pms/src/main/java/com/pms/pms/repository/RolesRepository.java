package com.pms.pms.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.pms.pms.entity.Roles;

public interface RolesRepository extends JpaRepository<Roles, Long> {

	@Query(value = "select * from roles where role_name ILIKE ?1", nativeQuery = true)
	Optional<Roles> findByRoleName(String roleName);
}
