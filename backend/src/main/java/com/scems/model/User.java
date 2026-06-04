package com.scems.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "app_users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long dbId;

    @Column(nullable = false, unique = true)
    private String id; // e.g., "S001", "A001"

    @NotNull @Column(nullable = false)
    private String name;

    @NotNull @Column(name = "user_role", nullable = false)
    private String role; // "student" or "admin"

    @Column(unique = true)
    private String username; // For admin

    private String password;

    private String rollNo;
    private String department;
    @Column(name = "academic_year")
    private Integer year;
    private String email;

    public User() {}

    public Long getDbId() { return dbId; }
    public void setDbId(Long dbId) { this.dbId = dbId; }
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getRollNo() { return rollNo; }
    public void setRollNo(String rollNo) { this.rollNo = rollNo; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    public Integer getYear() { return year; }
    public void setYear(Integer year) { this.year = year; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}
