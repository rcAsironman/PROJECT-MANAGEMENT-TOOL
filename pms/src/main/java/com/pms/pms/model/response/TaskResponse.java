package com.pms.pms.model.response;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.pms.pms.entity.Project;
import com.pms.pms.entity.Status;
import com.pms.pms.entity.User;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskResponse {

	private long taskId;

	private String taskTitle;

	@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
	private LocalDateTime endDate;

	private String description;

	private User assignedTo;

	private Status status;

	private Project project;
}
