package com.pms.pms.entity;

import java.time.LocalDateTime;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.OneToOne;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonFormat;

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
@Table(name = "project")
public class Project extends Audit<String> {

	@Id
	@SequenceGenerator(name = "project_id", sequenceName = "project_id", initialValue = 1, allocationSize = 1)
	@GeneratedValue(generator = "project_id", strategy = GenerationType.SEQUENCE)
	@Column(name = "project_id")
	private long projectId;
	
	@NonNull
	@Column(name = "project_title")
	private String projectTitle;
	
	@NonNull
	@Column(name = "start_date")
	@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
	private LocalDateTime startDate;
	
	@NonNull
	@Column(name = "end_date")
	@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
	private LocalDateTime endDate;
	
	@NonNull
	@OneToOne
	@JoinColumn(name = "creator_id", referencedColumnName = "user_id")
	private User creatorId;
	
	@ManyToMany(fetch = FetchType.LAZY, cascade = { CascadeType.PERSIST, CascadeType.MERGE })
	@JoinTable(
		name = "project_members", 
		joinColumns = @JoinColumn(name = "project_id"),
		inverseJoinColumns = @JoinColumn(name = "user_id")
	)
	private List<User> projectMembers;
}
