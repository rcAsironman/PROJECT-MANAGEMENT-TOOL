package com.pms.pms.service;

import com.pms.pms.entity.PageEntity;
import com.pms.pms.model.RoleModel;

public interface RoleService {

	RoleModel saveOrUpdateRole(RoleModel roleModel);

	RoleModel findRoleByName(String roleName);

	PageEntity<?> findAllRoles(int page, int size);

	RoleModel findRoleById(long roleId);

	String deleteRoleById(long roleId);
}
