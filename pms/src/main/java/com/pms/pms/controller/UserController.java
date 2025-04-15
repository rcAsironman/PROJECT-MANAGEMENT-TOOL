package com.pms.pms.controller;

import static com.pms.pms.constants.UrlConstants.USER_DELETE;
import static com.pms.pms.constants.UrlConstants.USER_FIND_ALL;
import static com.pms.pms.constants.UrlConstants.USER_FIND_BY_ID;
import static com.pms.pms.constants.UrlConstants.USER_FIND_BY_NAME;
import static com.pms.pms.constants.UrlConstants.USER_LOGIN;
import static com.pms.pms.constants.UrlConstants.USER_SAVE;
import static com.pms.pms.constants.UrlConstants.USER_SAVE_ADMIN;
import static com.pms.pms.util.ResponseUtils.buildResponse;
import static com.pms.pms.util.StringUtils.isNullOrEmpty;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.pms.pms.entity.PageEntity;
import com.pms.pms.exceptions.BadRequestException;
import com.pms.pms.exceptions.DataNotFoundException;
import com.pms.pms.exceptions.RecordNotSavedException;
import com.pms.pms.model.UserModel;
import com.pms.pms.model.response.LoginResponse;
import com.pms.pms.model.response.ResponseModel;
import com.pms.pms.model.response.UserResponse;
import com.pms.pms.service.UserService;
import com.pms.pms.util.JwtUtil;

import io.swagger.v3.oas.annotations.Parameter;
import lombok.extern.slf4j.Slf4j;

@RestController
@Slf4j
public class UserController {

	@Autowired
	private UserService userService;

	@Autowired
	private JwtUtil util;

	@Autowired
	private AuthenticationManager authenticationManager;

	@PostMapping(USER_SAVE)
	public ResponseEntity<ResponseModel> saveOrUpdateUser(@Valid @RequestBody UserModel userModel) {
		log.info("UserController - saveOrUpdateUser method");

		if (isNullOrEmpty(userModel)) {
			log.info("Given inputs are null or empty.");
			throw new BadRequestException("Given inputs are null or empty.");
		}

		UserResponse userResponse = userService.saveOrUpdateUser(userModel);
		if (isNullOrEmpty(userResponse)) {
			log.info("User data save unsuccessful.");
			throw new RecordNotSavedException("User details save unsuccessful.");
		}

		log.info("Data saved successfully.");
		return ResponseEntity.ok(buildResponse(200, "Data saved successfully.", userResponse));
	}

	@PostMapping(USER_SAVE_ADMIN)
	public ResponseEntity<ResponseModel> saveAdminUser(@Valid @RequestBody UserModel userModel) {
		log.info("UserController - saveAdminUser method");

		if (isNullOrEmpty(userModel)) {
			log.info("Given inputs are null or empty.");
			throw new BadRequestException("Given inputs are null or empty.");
		}

		UserResponse userResponse = userService.saveAdminUser(userModel);
		if (isNullOrEmpty(userResponse)) {
			log.info("Admin data save unsuccessful.");
			throw new RecordNotSavedException("Admin details save unsuccessful.");
		}

		log.info("Admin saved successfully.");
		return ResponseEntity.ok(buildResponse(200, "Admin saved successfully.", userResponse));
	}

	@PostMapping(USER_LOGIN)
	public ResponseEntity<ResponseModel> login(@Valid @RequestParam String email,
			@Valid @RequestParam String password) {
		log.info("UserController - login method");

		if (isNullOrEmpty(email) || isNullOrEmpty(password)) {
			log.info("Given inputs are null or empty.");
			throw new BadRequestException("Given inputs are null or empty.");
		}

		LoginResponse loginResponse = userService.login(email, password);
		
		//validate username and password and generate token.
		authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginResponse.getUserResponse().getEmail(), password));
		String token = util.generateToken(loginResponse.getUserResponse().getEmail());

		loginResponse.setToken(token);
		
		if (isNullOrEmpty(loginResponse)) {
			log.info("Login unsuccessful");
			throw new RecordNotSavedException("Login unsuccessful.");
		}

		log.info("Login successful.");
		return ResponseEntity.ok(buildResponse(200, "Login successful.", loginResponse));
	}

	@GetMapping(USER_FIND_BY_ID)
	public ResponseEntity<ResponseModel> findUserById(long userId) {
		log.info("UserController - findUserById method");

		if (userId == 0) {
			log.info("Given inputs are null or empty");
			throw new BadRequestException("Given inputs are null or empty");
		}
		UserResponse userResponse = userService.findUserById(userId);

		if (isNullOrEmpty(userResponse)) {
			log.info("No User found");
			throw new BadRequestException("User not found with the given Id : " + userId);
		}
		log.info("User retrieved successfully");
		return ResponseEntity.ok(buildResponse(200, "Data retrieval successfully", userResponse));
	}

	@GetMapping(USER_FIND_ALL)
	public ResponseEntity<ResponseModel> findAllUsers(@RequestParam int page, @RequestParam int size) {
		log.info("UserController - findAllUsers method");

		if (isNullOrEmpty(page) || isNullOrEmpty(size)) {
			log.info("Given inputs are null or empty.");
			throw new BadRequestException("Given inputs are null or empty.");
		}
		PageEntity<?> users = userService.findAllUsers(page, size);

		if (isNullOrEmpty(users)) {
			log.info("No users found");
			throw new DataNotFoundException("No users found");
		}

		log.info("Users retrieved successfully");
		return ResponseEntity.ok(buildResponse(200, "Data retrieval successfully", users));
	}

	@GetMapping(USER_FIND_BY_NAME)
	public ResponseEntity<ResponseModel> findUserByName(@Parameter(name = "userName") @RequestParam String userName) {
		log.info("UserController - findUserByName method");

		if (isNullOrEmpty(userName)) {
			log.info("Given inputs are null or empty");
			throw new BadRequestException("Given inputs are null or empty");
		}
		UserResponse userResponse = userService.findUserByName(userName);

		if (isNullOrEmpty(userResponse)) {
			log.info("No User found");
			throw new BadRequestException("User not found with the given name : " + userName);
		}

		log.info("User retrieved successfully");
		return ResponseEntity.ok(buildResponse(200, "Data retrieval successfully.", userResponse));
	}

	@DeleteMapping(USER_DELETE)
	public ResponseEntity<ResponseModel> deleteUserById(long userId) {
		log.info("UserController - deleteUserById");

		if (userId == 0) {
			log.info("Given inputs are null or empty");
			throw new BadRequestException("Given inputs are null or empty");
		}
		String msg = userService.deleteUserById(userId);

		if (isNullOrEmpty(msg)) {
			log.info("No User found");
			throw new BadRequestException("User not found with the given id : " + userId);
		}
		log.info("User deleted successfully");
		return ResponseEntity.ok(buildResponse(200, "Data deleted successfully.", msg));
	}

}
