package com.pms.pms.exceptions;

public class DataNotFoundException  extends RuntimeException{
	private static final long serialVersionUID = 1L;
	private final String message;

	public DataNotFoundException(String message) {
		super(message);
		this.message = message;
	}

	@Override
	public String toString() {
		return "DataNotFoundException [message=" + message + "]";
	}

}
