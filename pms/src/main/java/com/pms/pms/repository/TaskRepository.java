package com.pms.pms.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.pms.pms.entity.Status;
import com.pms.pms.entity.Task;

public interface TaskRepository extends JpaRepository<Task, Long> {

	@Query(value = "select * from task order by modified_date desc", nativeQuery = true)
	Page<Task> findAllTasks(Pageable pageable);

	@Query(value = "SELECT * FROM task WHERE status = ?1order by modified_date desc", nativeQuery = true)
	Page<Task> findByStatus(@Param("status") Status status, Pageable pageable);

	@Query(value = "SELECT * FROM task WHERE project_id = ?1 order by modified_date desc", nativeQuery = true)
	Page<Task> findByProjectId(@Param("projectId") long projectId, Pageable pageable);

}
