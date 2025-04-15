package com.pms.pms.controller;

import static com.pms.pms.constants.UrlConstants.TASK_DELETE;
import static com.pms.pms.constants.UrlConstants.TASK_FIND_ALL;
import static com.pms.pms.constants.UrlConstants.TASK_FIND_BY_ID;
import static com.pms.pms.constants.UrlConstants.TASK_SAVE;
import static com.pms.pms.constants.UrlConstants.TASK_FIND_BY_STATUS;
import static com.pms.pms.constants.UrlConstants.TASK_FIND_BY_PROJECT_ID;
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
import com.pms.pms.entity.Status;
import com.pms.pms.exceptions.BadRequestException;
import com.pms.pms.exceptions.DataNotFoundException;
import com.pms.pms.exceptions.RecordNotSavedException;
import com.pms.pms.model.TaskModel;
import com.pms.pms.model.response.ResponseModel;
import com.pms.pms.model.response.TaskResponse;
import com.pms.pms.service.TaskService;

import lombok.extern.slf4j.Slf4j;

@RestController
@Slf4j
public class TaskController {

	@Autowired
	TaskService taskService;
	
	@PostMapping(TASK_SAVE)
	public ResponseEntity<ResponseModel> saveOrUpdatTask(@Valid @RequestBody TaskModel taskModel) {
		log.info("TaskController - saveOrUpdateTask method");

		if (isNullOrEmpty(taskModel)) {
			log.info("Given inputs are null or empty.");
			throw new BadRequestException("Given inputs are null or empty.");
		}

		TaskResponse taskResponse = taskService.saveOrUpdateTask(taskModel);
		if (isNullOrEmpty(taskResponse)) {
			log.info("Task data save unsuccessful.");
			throw new RecordNotSavedException("Task details save unsuccessful.");
		}

		log.info("Data saved successfully.");
		return ResponseEntity.ok(buildResponse(200, "Data saved successfully.", taskResponse));
	}

	@GetMapping(TASK_FIND_BY_ID)
	public ResponseEntity<ResponseModel> findTaskById(long taskId) {
		log.info("TaskController - findTaskById method");

		if (taskId == 0) {
			log.info("Given inputs are null or empty");
			throw new BadRequestException("Given inputs are null or empty");
		}
		TaskResponse taskResponse = taskService.findTaskById(taskId);

		if (isNullOrEmpty(taskResponse)) {
			log.info("No Task found");
			throw new BadRequestException("Task not found with the given Id : " + taskId);
		}
		log.info("Task retrieved successfully");
		return ResponseEntity.ok(buildResponse(200, "Data retrieval successfully", taskResponse));
	}

	@GetMapping(TASK_FIND_ALL)
	public ResponseEntity<ResponseModel> findAllTasks(@RequestParam int page, @RequestParam int size) {
		log.info("TaskController - findAllTasks method");

		if (isNullOrEmpty(page) || isNullOrEmpty(size)) {
			log.info("Given inputs are null or empty.");
			throw new BadRequestException("Given inputs are null or empty.");
		}
		PageEntity<?> tasks = taskService.findAllTasks(page, size);

		if (isNullOrEmpty(tasks)) {
			log.info("No Tasks found");
			throw new DataNotFoundException("No Tasks found");
		}

		log.info("Tasks retrieved successfully");
		return ResponseEntity.ok(buildResponse(200, "Data retrieval successfully", tasks));
	}
	
	@GetMapping(TASK_FIND_BY_STATUS)
	public ResponseEntity<ResponseModel> findAllTasksByStatus(@RequestParam int page, @RequestParam int size,
	                                                          @RequestParam Status status) {
	    log.info("TaskController - findAllTasksByStatus method");

	    if (isNullOrEmpty(page) || isNullOrEmpty(size) || isNullOrEmpty(status)) {
	        log.info("Given inputs are null or empty.");
	        throw new BadRequestException("Given inputs are null or empty.");
	    }

	    PageEntity<?> tasks = taskService.findAllTasksByStatus(page, size, status);

	    if (isNullOrEmpty(tasks)) {
	        log.info("No Tasks found for the given status");
	        throw new DataNotFoundException("No Tasks found for the given status");
	    }

	    log.info("Tasks by status retrieved successfully");
	    return ResponseEntity.ok(buildResponse(200, "Tasks by status retrieved successfully", tasks));
	}

	@GetMapping(TASK_FIND_BY_PROJECT_ID)
	public ResponseEntity<ResponseModel> findAllTasksByProject(@RequestParam int page, @RequestParam int size,
	                                                           @RequestParam long projectId) {
	    log.info("TaskController - findAllTasksByProject method");

	    if (isNullOrEmpty(page) || isNullOrEmpty(size) || isNullOrEmpty(projectId)) {
	        log.info("Given inputs are null or empty.");
	        throw new BadRequestException("Given inputs are null or empty.");
	    }

	    PageEntity<?> tasks = taskService.findAllTasksByProject(page, size, projectId);

	    if (isNullOrEmpty(tasks)) {
	        log.info("No Tasks found for the given project");
	        throw new DataNotFoundException("No Tasks found for the given project");
	    }

	    log.info("Tasks by project retrieved successfully");
	    return ResponseEntity.ok(buildResponse(200, "Tasks by project retrieved successfully", tasks));
	}

	@DeleteMapping(TASK_DELETE)
	public ResponseEntity<ResponseModel> deleteTaskById(long taskId) {
		log.info("TaskController - deleteTaskById");

		if (taskId == 0) {
			log.info("Given inputs are null or empty");
			throw new BadRequestException("Given inputs are null or empty");
		}
		String msg = taskService.deleteTaskById(taskId);

		if (isNullOrEmpty(msg)) {
			log.info("No Task found");
			throw new BadRequestException("Task not found with the given id : " + taskId);
		}
		log.info("Task deleted successfully");
		return ResponseEntity.ok(buildResponse(200, "Data deleted successfully.", msg));
	}
}
