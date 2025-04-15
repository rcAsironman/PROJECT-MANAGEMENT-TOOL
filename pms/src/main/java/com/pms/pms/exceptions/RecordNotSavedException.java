package com.pms.pms.exceptions;

public class RecordNotSavedException extends RuntimeException {
	
	private static final long serialVersionUID = 1L;
	
	private final String message;

	public RecordNotSavedException(String message) {
		super(message);
		this.message = message;
	}

	@Override
	public String toString() {
		return "RecordNotSavedException [message=" + message + "]";
	}
}
