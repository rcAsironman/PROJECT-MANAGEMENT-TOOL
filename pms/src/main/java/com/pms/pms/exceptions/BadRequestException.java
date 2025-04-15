package com.pms.pms.exceptions;

public class BadRequestException extends RuntimeException{
	private static final long serialVersionUID = 1L;
	private final String message;

	public BadRequestException(String message) {
		super(message);
		this.message = message;
	}

	@Override
	public String toString() {
		return "BadRequestException [message=" + message + "]";
	}

}
