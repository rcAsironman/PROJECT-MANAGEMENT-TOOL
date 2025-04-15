package com.pms.pms.constants;

public class UrlConstants {
	
	public static final String ADMIN = "/admin";

	/**
	 * 
	 * User Urls
	 * 
	 */

	public static final String USER = "/user";

	public static final String USER_SAVE = USER + "/save-or-update";

	public static final String USER_SAVE_ADMIN = ADMIN +USER + "/save";

	public static final String USER_FIND_ALL = USER + "/find-all";

	public static final String USER_FIND_BY_ID = USER + "/find-by-id";

	public static final String USER_FIND_BY_NAME = USER + "/find-by-name";

	public static final String USER_DELETE = USER + "/delete";
		
	public static final String USER_LOGIN = USER + "/login";


	/**
	 * 
	 * Role Urls
	 * 
	 */

	public static final String ROLE = "/role";

	public static final String ROLE_SAVE = ROLE + "/save-or-update";

	public static final String ROLE_FIND_BY_ID = ROLE + "/find-by-id";

	public static final String ROLE_FIND_ALL = ROLE + "/find-all";

	public static final String ROLE_FIND_BY_NAME = ROLE + "/find-by-name";

	public static final String ROLE_DELETE = ROLE + "/delete";
	
	/**
	 * 
	 * Project Urls
	 * 
	 */

	public static final String PROJECT = "/project";

	public static final String PROJECT_SAVE = PROJECT + "/save-or-update";

	public static final String PROJECT_FIND_BY_ID = PROJECT + "/find-by-id";

	public static final String PROJECT_FIND_ALL = PROJECT + "/find-all";

	public static final String PROJECT_DELETE = PROJECT + "/delete";
	
	/**
	 * 
	 * Task Urls
	 * 
	 */

	public static final String TASK = "/task";

	public static final String TASK_SAVE = TASK + "/save-or-update";

	public static final String TASK_FIND_BY_ID = TASK + "/find-by-id";
	
	public static final String TASK_FIND_BY_STATUS = TASK + "/find-by-status";
	
	public static final String TASK_FIND_BY_PROJECT_ID = TASK + "/find-by-project-id";

	public static final String TASK_FIND_ALL = TASK + "/find-all";

	public static final String TASK_DELETE = TASK + "/delete";
}
