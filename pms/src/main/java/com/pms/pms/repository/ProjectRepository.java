package com.pms.pms.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.pms.pms.entity.Project;

public interface ProjectRepository extends JpaRepository<Project, Long> {

	@Query(value = "select * from project order by created_date desc", nativeQuery = true)
	Page<Project> findAllProjects(Pageable pageable);
}
