package com.pms.pms.entity;

import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

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
@Table(name = "task")
public class Task extends Audit<String> {

	@Id
	@SequenceGenerator(name = "task_id", sequenceName = "task_id", initialValue = 1, allocationSize = 1)
	@GeneratedValue(generator = "task_id", strategy = GenerationType.SEQUENCE)
	@Column(name = "task_id")
	private long taskId;

	@NonNull
	@Column(name = "task_title")
	private String taskTitle;

	@NonNull
	@Column(name = "end_date")
	private LocalDateTime endDate;

	@NonNull
	@Column(name = "description")
	private String description;

	@NonNull
	@OneToOne
	@JoinColumn(name = "assigned_to", referencedColumnName = "user_id")
	private User assignedTo;

	@NonNull
	@Enumerated(EnumType.STRING)
	@Column(name = "status")
	private Status status;

	@NonNull
	@OneToOne
	@JoinColumn(name = "project_id", referencedColumnName = "project_id")
	private Project project;
}
