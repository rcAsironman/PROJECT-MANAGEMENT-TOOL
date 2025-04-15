package com.pms.pms.service;

import com.pms.pms.entity.PageEntity;
import com.pms.pms.model.UserModel;
import com.pms.pms.model.response.LoginResponse;
import com.pms.pms.model.response.UserResponse;

public interface UserService {

	UserResponse saveOrUpdateUser(UserModel userModel);
	
	UserResponse saveAdminUser(UserModel userModel);

	UserResponse findUserByName(String userName);

	PageEntity<?> findAllUsers(int page, int size);

	UserResponse findUserById(long id);
	
	LoginResponse login(String email, String password);

	String deleteUserById(long id);
}
