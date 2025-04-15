package com.pms.pms.service.impl;

import static com.pms.pms.util.StringUtils.getPageEntity;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.pms.pms.entity.PageEntity;
import com.pms.pms.entity.Project;
import com.pms.pms.entity.User;
import com.pms.pms.exceptions.DataNotFoundException;
import com.pms.pms.model.ProjectModel;
import com.pms.pms.model.response.ProjectResponse;
import com.pms.pms.repository.ProjectRepository;
import com.pms.pms.repository.UserRepository;
import com.pms.pms.service.ProjectService;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class ProjectServiceImpl implements ProjectService {

	@Autowired
	ProjectRepository projectRepository;

	@Autowired
	UserRepository userRepository;

	private ProjectResponse setProjectResponse(Project project) {
		ProjectResponse projectResponse = new ProjectResponse();
		projectResponse.setCreatorId(project.getCreatorId());
		projectResponse.setEndDate(project.getEndDate());
		projectResponse.setProjectId(project.getProjectId());
		projectResponse.setProjectMembers(project.getProjectMembers());
		projectResponse.setProjectTitle(project.getProjectTitle());
		projectResponse.setStartDate(project.getStartDate());

		return projectResponse;
	}

	@Override
	public ProjectResponse saveOrUpdateProject(ProjectModel projectModel) {
		log.info("ProjectServiceImpl - saveOrUpdateProject method");

		Project project;

		if (projectModel.getProjectId() != 0) {
			project = projectRepository.findById(projectModel.getProjectId())
					.orElseThrow(() -> new DataNotFoundException("No data found with the given projectID."));
		} else {
			project = new Project();
		}

		List<User> usersList = projectModel.getProjectMembers().stream().map(member -> userRepository.findById(member)
				.orElseThrow(() -> new DataNotFoundException("User not found"))).collect(Collectors.toList());

		project.setProjectTitle(projectModel.getProjectTitle());
		project.setEndDate(projectModel.getEndDate());
		project.setCreatorId(userRepository.findById(projectModel.getCreatorId())
				.orElseThrow(() -> new DataNotFoundException("User not found")));
		project.setStartDate(projectModel.getStartDate());
		project.setProjectMembers(usersList);

		projectRepository.save(project);

		return setProjectResponse(project);
	}

	@Override
	public PageEntity<?> findAllProjects(int page, int size) {
		log.info("ProjectServiceImpl- findAllProjects method");

		Page<Project> projectPage = projectRepository.findAllProjects(PageRequest.of(page, size));

		if (projectPage.isEmpty()) {
			log.info("Projects not found");
			throw new DataNotFoundException("Projects not found");
		}

		List<ProjectResponse> projectResponses = projectPage.getContent().stream().map(p -> {
			ProjectResponse user = setProjectResponse(p);
			return user;
		}).collect(Collectors.toList());

		PageRequest pageRequest = PageRequest.of(page, size);

		Page<?> result = new PageImpl<>(projectResponses, pageRequest, projectResponses.size());

		return getPageEntity(result);
	}

	@Override
	public ProjectResponse findProjectById(long projectId) {
		log.info("ProjectServiceImpl - findProjectById method");

		ProjectResponse projectResponse;
		Project project = projectRepository.findById(projectId)
				.orElseThrow(() -> new DataNotFoundException("Project not found"));

		projectResponse = setProjectResponse(project);

		return projectResponse;
	}

	@Override
	public String deleteProjectById(long projectId) {
		log.info("ProjectServiceImpl - deleteProjectById method");

		Project project = projectRepository.findById(projectId)
				.orElseThrow(() -> new DataNotFoundException("Project not found"));

		project.setDeleted(true);
		projectRepository.save(project);

		log.info("Project deleted successfully");
		return "Project deleted successfully";
	}
}
