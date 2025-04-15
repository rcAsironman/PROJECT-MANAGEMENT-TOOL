package com.pms.pms.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.pms.pms.entity.User;

public interface UserRepository extends JpaRepository<User, Long>{

	@Query(value = "select * from users where email = ?1 and is_deleted = false", nativeQuery = true)
	Optional<User> findByEmail(String emailId);
	
	@Query(value = "select * from users where mbl_num = ?1 and is_deleted = false", nativeQuery = true)
	Optional<User> findByMlbNum(long mblNum);
	
	@Query(value = "select * from users where user_name ILIKE ?1 and is_deleted = false", nativeQuery = true)
	Optional<User> findByUserName(String userName);
}
