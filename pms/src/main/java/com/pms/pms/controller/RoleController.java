package com.pms.pms.controller;

import static com.pms.pms.constants.UrlConstants.ROLE_DELETE;
import static com.pms.pms.constants.UrlConstants.ROLE_FIND_ALL;
import static com.pms.pms.constants.UrlConstants.ROLE_FIND_BY_ID;
import static com.pms.pms.constants.UrlConstants.ROLE_FIND_BY_NAME;
import static com.pms.pms.constants.UrlConstants.ROLE_SAVE;
import static com.pms.pms.util.ResponseUtils.buildResponse;
import static com.pms.pms.util.StringUtils.isNullOrEmpty;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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
import com.pms.pms.model.RoleModel;
import com.pms.pms.model.response.ResponseModel;
import com.pms.pms.service.RoleService;

import io.swagger.v3.oas.annotations.Parameter;
import lombok.extern.slf4j.Slf4j;

@RestController
@Slf4j
public class RoleController {

	@Autowired
	RoleService roleService;

	@PostMapping(ROLE_SAVE)
	public ResponseEntity<ResponseModel> saveOrUpdateRole(@Valid @RequestBody RoleModel roleModel) {
		log.info("RoleController - saveOrUpdateRole method");

		if (isNullOrEmpty(roleModel)) {
			log.info("Given inputs are null or empty.");
			throw new BadRequestException("Given inputs are null or empty.");
		}

		RoleModel roleResponse = roleService.saveOrUpdateRole(roleModel);
		if (isNullOrEmpty(roleResponse)) {
			log.info("Role data save unsuccessful.");
			throw new RecordNotSavedException("Role details save unsuccessful.");
		}

		log.info("Role saved successfully.");
		return ResponseEntity.ok(buildResponse(200, "Role saved successfully.", roleResponse));
	}

	@GetMapping(ROLE_FIND_BY_ID)
	public ResponseEntity<ResponseModel> findRoleById(long roleId) {
		log.info("RoleController - findRoleById method");

		if (roleId == 0) {
			log.info("Given inputs are null or empty");
			throw new BadRequestException("Given inputs are null or empty");
		}
		RoleModel roleResponse = roleService.findRoleById(roleId);

		if (isNullOrEmpty(roleResponse)) {
			log.info("No Role found");
			throw new BadRequestException("Role not found with the given Id : " + roleId);
		}
		log.info("Role retrieved successfully");
		return ResponseEntity.ok(buildResponse(200, "Data retrieval successfully", roleResponse));
	}

	@GetMapping(ROLE_FIND_ALL)
	public ResponseEntity<ResponseModel> findAllRoles(@RequestParam int page, @RequestParam int size) {
		log.info("RoleController - findAllRoles method");

		if (isNullOrEmpty(page) || isNullOrEmpty(size)) {
			log.info("Given inputs are null or empty.");
			throw new BadRequestException("Given inputs are null or empty.");
		}
		PageEntity<?> roles = roleService.findAllRoles(page, size);

		if (isNullOrEmpty(roles)) {
			log.info("No Roles found");
			throw new DataNotFoundException("No Roles found");
		}

		log.info("Roles retrieved successfully");
		return ResponseEntity.ok(buildResponse(200, "Data retrieval successfully", roles));
	}

	@GetMapping(ROLE_FIND_BY_NAME)
	public ResponseEntity<ResponseModel> findRoleByName(@Parameter(name = "roleName") @RequestParam String roleName) {
		log.info("RoleController - findRoleByName method");

		if (isNullOrEmpty(roleName)) {
			log.info("Given inputs are null or empty");
			throw new BadRequestException("Given inputs are null or empty");
		}
		RoleModel roleModel = roleService.findRoleByName(roleName);

		if (isNullOrEmpty(roleModel)) {
			log.info("No Role found");
			throw new BadRequestException("Role not found with the given name : " + roleName);
		}

		log.info("Role retrieved successfully");
		return ResponseEntity.ok(buildResponse(200, "Data retrieval successfully.", roleModel));
	}

	@DeleteMapping(ROLE_DELETE)
	public ResponseEntity<ResponseModel> deleteRoleById(long roleId) {
		log.info("RoleController - deleteRoleById");

		if (roleId == 0) {
			log.info("Given inputs are null or empty");
			throw new BadRequestException("Given inputs are null or empty");
		}
		String msg = roleService.deleteRoleById(roleId);

		if (isNullOrEmpty(msg)) {
			log.info("No Role found");
			throw new BadRequestException("Role not found with the given id : " + roleId);
		}
		log.info("Role deleted successfully");
		return ResponseEntity.ok(buildResponse(200, "Data deleted successfully.", msg));
	}

}
