package com.pms.pms.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserModel {

	private long userId;

	private String userName;

	private String email;

	private Long mblNum;

	private String password;
		
	private String reEnterPassword;
	
	private String designation;
}
