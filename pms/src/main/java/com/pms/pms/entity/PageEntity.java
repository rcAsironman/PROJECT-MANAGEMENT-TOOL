package com.pms.pms.entity;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PageEntity<T> {

	public static final String FIRST_PAGE_NUM = "0";

	List<?> content;

	long noOfElements;

	int pageNumber;

	int pageSize;

	long totalElements;

	long totalPages;

	@JsonProperty
	public boolean first() {
		return pageNumber == Integer.parseInt(FIRST_PAGE_NUM);
	}

	@JsonProperty
	public boolean last() {
		return (pageNumber + 1) * pageSize >= totalElements;
	}
}
