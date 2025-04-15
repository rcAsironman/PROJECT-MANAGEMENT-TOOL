package com.pms.pms.model;

import java.time.LocalDateTime;

import com.pms.pms.entity.Status;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskModel {

	private long taskId;

	private String taskTitle;

	private LocalDateTime endDate;

	private String description;

	private long assignedTo;

	private Status status;

	private long project;
}
