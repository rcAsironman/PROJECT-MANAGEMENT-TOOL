package com.pms.pms.service;

import com.pms.pms.entity.PageEntity;
import com.pms.pms.model.ProjectModel;
import com.pms.pms.model.response.ProjectResponse;

public interface ProjectService {

	ProjectResponse saveOrUpdateProject(ProjectModel projectModel);

	PageEntity<?> findAllProjects(int page, int size);

	ProjectResponse findProjectById(long projectId);

	String deleteProjectById(long projectId);
}
