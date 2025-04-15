package com.pms.pms.service;

import com.pms.pms.entity.PageEntity;
import com.pms.pms.entity.Status;
import com.pms.pms.model.TaskModel;
import com.pms.pms.model.response.TaskResponse;

public interface TaskService {

	TaskResponse saveOrUpdateTask(TaskModel taskModel);

	PageEntity<?> findAllTasks(int page, int size);

	PageEntity<?> findAllTasksByStatus(int page, int size, Status status);

	PageEntity<?> findAllTasksByProject(int page, int size, long projectId);

	TaskResponse findTaskById(long taskId);

	String deleteTaskById(long taskId);
}
