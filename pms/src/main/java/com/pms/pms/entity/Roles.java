package com.pms.pms.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@RequiredArgsConstructor
@Entity
@Table(name = "Roles")
public class Roles {

    @Id
    @SequenceGenerator(name = "role_id", sequenceName = "role_id", initialValue = 1, allocationSize = 1)
    @GeneratedValue(generator = "role_id", strategy = GenerationType.SEQUENCE)
    @Column(name = "role_id")
    private long id;

    @NonNull
    @Column(name = "role_name")
    private String roleName;

}

