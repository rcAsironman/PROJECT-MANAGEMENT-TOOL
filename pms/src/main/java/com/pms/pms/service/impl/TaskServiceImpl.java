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
import com.pms.pms.entity.Status;
import com.pms.pms.entity.Task;
import com.pms.pms.exceptions.DataNotFoundException;
import com.pms.pms.model.TaskModel;
import com.pms.pms.model.response.TaskResponse;
import com.pms.pms.repository.ProjectRepository;
import com.pms.pms.repository.TaskRepository;
import com.pms.pms.repository.UserRepository;
import com.pms.pms.service.TaskService;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class TaskServiceImpl implements TaskService {

	@Autowired
	TaskRepository taskRepository;

	@Autowired
	ProjectRepository projectRepository;

	@Autowired
	UserRepository userRepository;

	private TaskResponse setTaskResponse(Task task) {
		TaskResponse taskResponse = new TaskResponse();
		taskResponse.setAssignedTo(task.getAssignedTo());
		taskResponse.setDescription(task.getDescription());
		taskResponse.setEndDate(task.getEndDate());
		taskResponse.setProject(task.getProject());
		taskResponse.setTaskId(task.getTaskId());
		taskResponse.setTaskTitle(task.getTaskTitle());

		return taskResponse;
	}

	@Override
	public TaskResponse saveOrUpdateTask(TaskModel taskModel) {
		log.info("TaskServiceImpl - saveOrUpdateTask method");

		Task task;

		if (taskModel.getTaskId() != 0) {
			task = taskRepository.findById(taskModel.getTaskId())
					.orElseThrow(() -> new DataNotFoundException("No data found with the given taskID."));
		} else {
			task = new Task();
		}

		task.setDescription(taskModel.getDescription());
		task.setEndDate(taskModel.getEndDate());
		task.setAssignedTo(userRepository.findById(taskModel.getAssignedTo())
				.orElseThrow(() -> new DataNotFoundException("User not found")));
		task.setProject(projectRepository.findById(taskModel.getProject())
				.orElseThrow(() -> new DataNotFoundException("Project not found")));
		task.setStatus(taskModel.getStatus());
		task.setTaskTitle(taskModel.getTaskTitle());

		taskRepository.save(task);

		return setTaskResponse(task);
	}

	@Override
	public PageEntity<?> findAllTasks(int page, int size) {
		log.info("TaskServiceImpl- findAllTasks method");

		Page<Task> taskPage = taskRepository.findAllTasks(PageRequest.of(page, size));

		if (taskPage.isEmpty()) {
			log.info("Tasks not found");
			throw new DataNotFoundException("Tasks not found");
		}

		List<TaskResponse> taskResponses = taskPage.getContent().stream().map(p -> {
			TaskResponse user = setTaskResponse(p);
			return user;
		}).collect(Collectors.toList());

		PageRequest pageRequest = PageRequest.of(page, size);

		Page<?> result = new PageImpl<>(taskResponses, pageRequest, taskResponses.size());

		return getPageEntity(result);
	}

	@Override
	public TaskResponse findTaskById(long taskId) {
		log.info("TaskServiceImpl - findTaskById method");

		TaskResponse taskResponse;
		Task task = taskRepository.findById(taskId).orElseThrow(() -> new DataNotFoundException("Task not found"));

		taskResponse = setTaskResponse(task);

		return taskResponse;
	}

	@Override
	public PageEntity<?> findAllTasksByStatus(int page, int size, Status status) {
		log.info("TaskServiceImpl - findAllTasksByStatus");

		Page<Task> taskPage = taskRepository.findByStatus(status, PageRequest.of(page, size));

		if (taskPage.isEmpty()) {
			log.info("No tasks found with status: {}", status);
			throw new DataNotFoundException("No tasks found with status: " + status);
		}

		List<TaskResponse> taskResponses = taskPage.getContent().stream()
				.map(this::setTaskResponse)
				.collect(Collectors.toList());

		PageRequest pageRequest = PageRequest.of(page, size);
		Page<?> result = new PageImpl<>(taskResponses, pageRequest, taskPage.getTotalElements());

		return getPageEntity(result);
	}


	@Override
	public PageEntity<?> findAllTasksByProject(int page, int size, long projectId) {
		log.info("TaskServiceImpl - findAllTasksByProject");

		Page<Task> taskPage = taskRepository.findByProjectId(projectId, PageRequest.of(page, size));

		if (taskPage.isEmpty()) {
			log.info("No tasks found for projectId: {}", projectId);
			throw new DataNotFoundException("No tasks found for projectId: " + projectId);
		}

		List<TaskResponse> taskResponses = taskPage.getContent().stream()
				.map(this::setTaskResponse)
				.collect(Collectors.toList());

		PageRequest pageRequest = PageRequest.of(page, size);
		Page<?> result = new PageImpl<>(taskResponses, pageRequest, taskPage.getTotalElements());

		return getPageEntity(result);
	}


	@Override
	public String deleteTaskById(long taskId) {
		log.info("TaskServiceImpl - deleteTaskById method");

		Task task = taskRepository.findById(taskId).orElseThrow(() -> new DataNotFoundException("Task not found"));

		task.setDeleted(true);
		taskRepository.save(task);

		log.info("Task deleted successfully");
		return "Task deleted successfully";
	}
}
