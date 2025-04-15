package com.pms.pms.model;

import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProjectModel {

	private long projectId;

	private String projectTitle;

	private LocalDateTime startDate;

	private LocalDateTime endDate;

	private long creatorId;

	private List<Long> projectMembers;
}
