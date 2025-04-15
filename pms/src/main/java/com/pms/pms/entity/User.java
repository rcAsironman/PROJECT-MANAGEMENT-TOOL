package com.pms.pms.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.NonNull;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users")
public class User extends Audit<String> {

	@Id
	@SequenceGenerator(name = "user_id", sequenceName = "user_id", initialValue = 1, allocationSize = 1)
	@GeneratedValue(generator = "user_id", strategy = GenerationType.SEQUENCE)
	@Column(name = "user_id")
	private long userId;

	@NonNull
	@Column(name = "user_name", unique = true)
	private String userName;

	@NonNull
	@Column(name = "email", unique = true)
	private String email;

	@NonNull
	@Column(name = "mbl_num", unique = true)
	private Long mblNum;

	@NonNull
	@Column(name = "password")
	@JsonIgnore
	private String password;
	
	@NonNull
	@Column(name = "designation")
	private String designation;

	@NonNull
	@OneToOne
	@JoinColumn(name = "role_id", referencedColumnName = "role_id")
	private Roles role;

}
