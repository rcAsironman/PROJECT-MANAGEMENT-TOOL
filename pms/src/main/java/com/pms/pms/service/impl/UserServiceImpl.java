package com.pms.pms.service.impl;

import static com.pms.pms.util.StringUtils.getPageEntity;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.pms.pms.entity.PageEntity;
import com.pms.pms.entity.Roles;
import com.pms.pms.entity.User;
import com.pms.pms.exceptions.BadRequestException;
import com.pms.pms.exceptions.DataNotFoundException;
import com.pms.pms.model.UserModel;
import com.pms.pms.model.response.LoginResponse;
import com.pms.pms.model.response.UserResponse;
import com.pms.pms.repository.RolesRepository;
import com.pms.pms.repository.UserRepository;
import com.pms.pms.service.UserService;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class UserServiceImpl implements UserService, UserDetailsService {

	@Autowired
	UserRepository userRepository;

	@Autowired
	RolesRepository rolesRepository;

	@Autowired
	private BCryptPasswordEncoder passwordEncoder;

	private UserResponse setUserResponse(User user) {
		UserResponse userResponse = new UserResponse();
		userResponse.setEmail(user.getEmail());
		userResponse.setMblNum(user.getMblNum());
		userResponse.setUserId(user.getUserId());
		userResponse.setRole(user.getRole());
		userResponse.setUserName(user.getUserName());
		userResponse.setDesignation(user.getDesignation());
		return userResponse;
	}

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		Optional<User> user = userRepository.findByEmail(username);
		if (user.isEmpty()) {
			throw new UsernameNotFoundException("User does not exist");
		}
		User user1 = user.get();
		System.out.println("ROLE NAME: " + user1.getRole().getRoleName());
		return new org.springframework.security.core.userdetails.User(username, user1.getPassword(),
				Arrays.asList(new SimpleGrantedAuthority(user1.getRole().getRoleName())));
	}

	@Override
	public UserResponse saveOrUpdateUser(UserModel userModel) {
		log.info("UserServiceImpl - saveOrUpdateUser method");
		User user;

		// check whether the email exists
		if (userRepository.findByEmail(userModel.getEmail()).isPresent()) {
			log.info("User already exists with this email id. Please login");
			throw new BadRequestException("User already exists with this email id. Please login");
		}

		// check whether the mblNum exists
		if (userRepository.findByMlbNum(userModel.getMblNum()).isPresent()) {
			log.info("User already exists with this mbl num. Please login");
			throw new BadRequestException("User already exists with this mobile number. Please login");
		}

		if (userModel.getUserId() != 0) {
			user = userRepository.findById(userModel.getUserId())
					.orElseThrow(() -> new DataNotFoundException("No data found with the given userID."));
		} else {
			user = new User();
		}

		Optional<Roles> roles = rolesRepository.findByRoleName("CUSTOMER");
		if (roles.isPresent()) {
			if (userModel.getPassword().equals(userModel.getReEnterPassword())) {
				user.setUserName(userModel.getUserName());
				user.setEmail(userModel.getEmail());
				user.setMblNum(userModel.getMblNum());
				user.setPassword(passwordEncoder.encode(userModel.getPassword()));
				user.setRole(roles.get());
				user.setDesignation(userModel.getDesignation());
				
				userRepository.save(user);
			} else {
				throw new BadRequestException("password doesn't match with re-enter password");
			}
		} else {
			log.info("Given role is null or empty");
			throw new BadRequestException("Given role is null or empty");
		}

		return setUserResponse(user);
	}

	@Override
	public UserResponse saveAdminUser(UserModel userModel) {
		log.info("UserServiceImpl - saveAdminUser method");
		User user;

		// check whether the email exists
		if (userRepository.findByEmail(userModel.getEmail()).isPresent()) {
			log.info("User already exists with this email id. Please login");
			throw new BadRequestException("User already exists with this email id. Please login");
		}

		// check whether the mblNum exists
		if (userRepository.findByMlbNum(userModel.getMblNum()).isPresent()) {
			log.info("User already exists with this mbl num. Please login");
			throw new BadRequestException("User already exists with this mobile number. Please login");
		}

		if (userModel.getUserId() != 0) {
			user = userRepository.findById(userModel.getUserId())
					.orElseThrow(() -> new DataNotFoundException("No data found with the given userID."));
		} else {
			user = new User();
		}

		Optional<Roles> roles = rolesRepository.findByRoleName("ADMIN");
		if (roles.isPresent()) {
			if (userModel.getPassword().equals(userModel.getReEnterPassword())) {
				user.setUserName(userModel.getUserName());
				user.setEmail(userModel.getEmail());
				user.setMblNum(userModel.getMblNum());
				user.setPassword(userModel.getPassword());
				user.setRole(roles.get());
				user.setDesignation(userModel.getDesignation());

				userRepository.save(user);
			} else {
				throw new BadRequestException("password doesn't match with re-enter password");
			}
		} else {
			log.info("Given role is null or empty");
			throw new BadRequestException("Given role is null or empty");
		}

		return setUserResponse(user);
	}

	@Override
	public UserResponse findUserByName(String userName) {
		log.info("UserServiceImpl - findUserByName method");
		UserResponse userResponse;

		// Finding for a user with the given user Id in the repository
		User user = userRepository.findByUserName(userName)
				.orElseThrow(() -> new DataNotFoundException("User not found."));

		// Mapping the UserMst object to a UserModel object
		userResponse = setUserResponse(user);

		return userResponse;
	}

	@Override
	public PageEntity<?> findAllUsers(int page, int size) {
		log.info("UserServiceImpl- findAllUsers method started");

		Page<User> usersPage = userRepository.findAll(PageRequest.of(page, size));

		if (usersPage.isEmpty()) {
			log.info("Users not found");
			throw new DataNotFoundException("Users not found");
		}

		List<UserResponse> users = usersPage.getContent().stream().map(p -> {
			UserResponse user = setUserResponse(p);
			return user;
		}).collect(Collectors.toList());

		PageRequest pageRequest = PageRequest.of(page, size);

		Page<?> result = new PageImpl<>(users, pageRequest, users.size());

		return getPageEntity(result);
	}

	@Override
	public UserResponse findUserById(long userId) {
		log.info("UserServiceImpl - findUserById method");

		UserResponse userResponse;
		// Finding for a user with the given User Id in the repository
		User user = userRepository.findById(userId).orElseThrow(() -> new DataNotFoundException("User not found"));

		// Mapping the UserMst object to a UserModel object
		userResponse = setUserResponse(user);

		return userResponse;

	}

	@Override
	public LoginResponse login(String email, String password) {
		log.info("UserServiceImpl - login method");
		LoginResponse loginResponse = new LoginResponse();

		// Finding for a user with the given user Id in the repository
		User user = userRepository.findByEmail(email).orElseThrow(() -> new DataNotFoundException("User not found."));
		loginResponse.setUserResponse(setUserResponse(user));

		return loginResponse;
	}

	@Override
	public String deleteUserById(long userId) {
		log.info("UserServiceImpl - deleteUserById method");

		// Finding for a user with the given User Id in the repository
		User user = userRepository.findById(userId).orElseThrow(() -> new DataNotFoundException("User not found"));

		user.setDeleted(true);
		userRepository.save(user);

		log.info("User deleted successfully");
		return "User deleted successfully";
	}
}
