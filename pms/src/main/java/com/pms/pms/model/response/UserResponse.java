package com.pms.pms.model.response;

import com.pms.pms.entity.Roles;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserResponse {

	private long userId;

	private String userName;

	private String email;

	private Long mblNum;

	private String password;

	private Roles role;

	private String designation;

}
