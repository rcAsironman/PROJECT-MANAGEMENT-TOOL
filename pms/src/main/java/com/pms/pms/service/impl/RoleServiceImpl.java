package com.pms.pms.service.impl;

import static com.pms.pms.util.StringUtils.getPageEntity;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.pms.pms.entity.PageEntity;
import com.pms.pms.entity.Roles;
import com.pms.pms.exceptions.DataNotFoundException;
import com.pms.pms.model.RoleModel;
import com.pms.pms.repository.RolesRepository;
import com.pms.pms.service.RoleService;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class RoleServiceImpl implements RoleService {

	@Autowired
	RolesRepository rolesRepository;

	private RoleModel setRoleModel(Roles roles) {
		RoleModel roleModel = new RoleModel();
		roleModel.setRoleName(roles.getRoleName());
		roleModel.setRoleId(roles.getId());
		return roleModel;
	}

	@Override
	public RoleModel saveOrUpdateRole(RoleModel roleModel) {
		log.info("RoleServiceImpl - saveOrUpdateRole method");
		Roles role;

		if (roleModel.getRoleId() != 0) {
			role = rolesRepository.findById(roleModel.getRoleId())
					.orElseThrow(() -> new DataNotFoundException("No data found with the given roleId."));
		} else {
			role = new Roles();
		}

		role.setRoleName(roleModel.getRoleName());
		rolesRepository.save(role);

		return setRoleModel(role);
	}

	@Override
	public RoleModel findRoleByName(String roleName) {
		log.info("RoleServiceImpl - findRoleByName method");

		RoleModel roleModel;
		Roles roles = rolesRepository.findByRoleName(roleName)
				.orElseThrow(() -> new DataNotFoundException("Role not found with given name"));

		roleModel = setRoleModel(roles);

		return roleModel;
	}

	@Override
	public PageEntity<?> findAllRoles(int page, int size) {
		log.info("RoleServiceImpl- findAllRoles method");

		Page<Roles> roles = rolesRepository.findAll(PageRequest.of(page, size));

		if (roles.isEmpty()) {
			log.info("Roles not found");
			throw new DataNotFoundException("Roles not found");
		}

		List<RoleModel> roleModels = roles.getContent().stream().map(p -> {
			RoleModel user = setRoleModel(p);
			return user;
		}).collect(Collectors.toList());

		PageRequest pageRequest = PageRequest.of(page, size);
		Page<?> result = new PageImpl<>(roleModels, pageRequest, roleModels.size());

		return getPageEntity(result);

	}

	@Override
	public RoleModel findRoleById(long roleId) {
		log.info("RoleServiceImpl - findRoleById method");

		RoleModel roleModel;
		Roles roles = rolesRepository.findById(roleId).orElseThrow(() -> new DataNotFoundException("Role not found"));

		roleModel = setRoleModel(roles);
		return roleModel;

	}

	@Override
	public String deleteRoleById(long roleId) {
		log.info("RoleServiceImpl - deleteRoleById method");

		Roles roles = rolesRepository.findById(roleId).orElseThrow(() -> new DataNotFoundException("Role not found"));

		rolesRepository.delete(roles);

		log.info("Role deleted successfully");
		return "Role deleted successfully";
	}
}
