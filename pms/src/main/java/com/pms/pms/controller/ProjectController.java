package com.pms.pms.controller;

import static com.pms.pms.constants.UrlConstants.PROJECT_DELETE;
import static com.pms.pms.constants.UrlConstants.PROJECT_FIND_ALL;
import static com.pms.pms.constants.UrlConstants.PROJECT_FIND_BY_ID;
import static com.pms.pms.constants.UrlConstants.PROJECT_SAVE;
import static com.pms.pms.util.ResponseUtils.buildResponse;
import static com.pms.pms.util.StringUtils.isNullOrEmpty;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.pms.pms.entity.PageEntity;
import com.pms.pms.exceptions.BadRequestException;
import com.pms.pms.exceptions.DataNotFoundException;
import com.pms.pms.exceptions.RecordNotSavedException;
import com.pms.pms.model.ProjectModel;
import com.pms.pms.model.response.ProjectResponse;
import com.pms.pms.model.response.ResponseModel;
import com.pms.pms.service.ProjectService;

import lombok.extern.slf4j.Slf4j;

@RestController
@Slf4j
public class ProjectController {

	@Autowired
	ProjectService projectService;

	@PostMapping(PROJECT_SAVE)
	public ResponseEntity<ResponseModel> saveOrUpdateProject(@Valid @RequestBody ProjectModel projectModel) {
		log.info("ProjectController - saveOrUpdateProject method");

		if (isNullOrEmpty(projectModel)) {
			log.info("Given inputs are null or empty.");
			throw new BadRequestException("Given inputs are null or empty.");
		}

		ProjectResponse projectResponse = projectService.saveOrUpdateProject(projectModel);
		if (isNullOrEmpty(projectResponse)) {
			log.info("Project data save unsuccessful.");
			throw new RecordNotSavedException("Project details save unsuccessful.");
		}

		log.info("Data saved successfully.");
		return ResponseEntity.ok(buildResponse(200, "Data saved successfully.", projectResponse));
	}

	@GetMapping(PROJECT_FIND_BY_ID)
	public ResponseEntity<ResponseModel> findProjectById(long projectId) {
		log.info("ProjectController - findProjectById method");

		if (projectId == 0) {
			log.info("Given inputs are null or empty");
			throw new BadRequestException("Given inputs are null or empty");
		}
		ProjectResponse projectResponse = projectService.findProjectById(projectId);

		if (isNullOrEmpty(projectResponse)) {
			log.info("No Project found");
			throw new BadRequestException("Project not found with the given Id : " + projectId);
		}
		log.info("Project retrieved successfully");
		return ResponseEntity.ok(buildResponse(200, "Data retrieval successfully", projectResponse));
	}

	@GetMapping(PROJECT_FIND_ALL)
	public ResponseEntity<ResponseModel> findAllProjects(@RequestParam int page, @RequestParam int size) {
		log.info("ProjectController - findAllProjects method");

		if (isNullOrEmpty(page) || isNullOrEmpty(size)) {
			log.info("Given inputs are null or empty.");
			throw new BadRequestException("Given inputs are null or empty.");
		}
		PageEntity<?> projects = projectService.findAllProjects(page, size);

		if (isNullOrEmpty(projects)) {
			log.info("No Projects found");
			throw new DataNotFoundException("No Projects found");
		}

		log.info("Projects retrieved successfully");
		return ResponseEntity.ok(buildResponse(200, "Data retrieval successfully", projects));
	}

	@DeleteMapping(PROJECT_DELETE)
	public ResponseEntity<ResponseModel> deleteProjectById(long projectId) {
		log.info("ProjectController - deleteProjectById");

		if (projectId == 0) {
			log.info("Given inputs are null or empty");
			throw new BadRequestException("Given inputs are null or empty");
		}
		String msg = projectService.deleteProjectById(projectId);

		if (isNullOrEmpty(msg)) {
			log.info("No Project found");
			throw new BadRequestException("Project not found with the given id : " + projectId);
		}
		log.info("Project deleted successfully");
		return ResponseEntity.ok(buildResponse(200, "Data deleted successfully.", msg));
	}
}
