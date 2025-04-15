package com.pms.pms.entity;

import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.EntityListeners;
import javax.persistence.MappedSuperclass;
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;
import javax.servlet.http.HttpServletRequest;

import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.Data;

@Data
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
@JsonIgnoreProperties(value = { "createdDate", "modifiedDate", "createdBy", "modifiedBy", "createdIp", "modifiedIp",
		"isDeleted" }, allowGetters = true)
public abstract class Audit<U> {

	@CreatedBy
	@Column(name = "created_by", nullable = false, columnDefinition = "varchar")
	@JsonIgnore
	private U createdBy;

	@LastModifiedBy
	@Column(name = "modified_by", columnDefinition = "varchar")
	@JsonIgnore
	private U modifiedBy;

	@CreatedDate
	@Column(name = "created_date", updatable = false, nullable = false)
	@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
	@JsonIgnore
	private Timestamp createdDate;

	@LastModifiedDate
	@Column(name = "modified_date")
	@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
	@JsonIgnore
	private Timestamp modifiedDate;

	@Column(name = "created_ip", length = 20)
	@JsonIgnore
	private String createdIp;

	@Column(name = "modified_ip", length = 20)
	@JsonIgnore
	private String modifiedIp;

	@Column(name = "is_deleted")
	@JsonIgnore
	private boolean isDeleted = false;

	@PrePersist
	public void setCreatedIp() {
		ServletRequestAttributes requestAttributes = (ServletRequestAttributes) RequestContextHolder
				.getRequestAttributes();
		if (requestAttributes != null) {
			HttpServletRequest request = requestAttributes.getRequest();

			this.createdIp = request.getRemoteAddr();
			this.modifiedIp = request.getRemoteAddr();

		}
	}

	@PreUpdate
	public void setModifiedIp() {
		ServletRequestAttributes requestAttributes = (ServletRequestAttributes) RequestContextHolder
				.getRequestAttributes();
		if (requestAttributes != null) {
			HttpServletRequest request = requestAttributes.getRequest();

			this.modifiedIp = request.getRemoteAddr();

		}
	}

}
