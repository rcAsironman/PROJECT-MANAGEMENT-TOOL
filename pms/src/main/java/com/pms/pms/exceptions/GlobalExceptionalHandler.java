package com.pms.pms.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import com.pms.pms.model.response.ResponseModel;

import lombok.extern.slf4j.Slf4j;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionalHandler extends ResponseEntityExceptionHandler {

	@ExceptionHandler(BadRequestException.class)
	public ResponseEntity<ResponseModel> handleBadRequestException(BadRequestException ex) {
		log.error("BadRequestException :- " + ex.getMessage());
		ResponseModel response = new ResponseModel(400, "Bad Request", ex.getMessage());
		return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
	}

	@ExceptionHandler(DataNotFoundException.class)
	public ResponseEntity<ResponseModel> handleDataNotFoundException(DataNotFoundException ex) {
		log.error("DataNotFoundException :- " + ex.getMessage());
		ResponseModel response = new ResponseModel(404, "Data not found", ex.getMessage());
		return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
	}

	@ExceptionHandler(RecordNotSavedException.class)
	public ResponseEntity<ResponseModel> handleRecordNotSavedException(RecordNotSavedException ex) {
		log.error("RecordNotSavedException :- " + ex.getMessage());
		ResponseModel response = new ResponseModel(400, "Record not saved successfully", ex.getMessage());
		return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
	}
}
