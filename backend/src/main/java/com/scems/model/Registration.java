package com.scems.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "registrations")
public class Registration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String registrationId;

    @NotNull @Column(nullable = false)
    private String eventId;

    @NotNull @Column(nullable = false)
    private String studentId;

    @NotNull @Column(nullable = false)
    private String status;

    @Column(name = "registered_on")
    private String registeredOn;

    @Column(name = "payment_id")
    private String paymentId;

    @Column(name = "amount_paid")
    private Double amountPaid;

    private Integer feedbackRating;

    @Column(length = 500)
    private String feedbackComment;

    public Registration() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getRegistrationId() { return registrationId; }
    public void setRegistrationId(String registrationId) { this.registrationId = registrationId; }
    public String getEventId() { return eventId; }
    public void setEventId(String eventId) { this.eventId = eventId; }
    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getRegisteredOn() { return registeredOn; }
    public void setRegisteredOn(String registeredOn) { this.registeredOn = registeredOn; }
    public String getPaymentId() { return paymentId; }
    public void setPaymentId(String paymentId) { this.paymentId = paymentId; }
    public Double getAmountPaid() { return amountPaid; }
    public void setAmountPaid(Double amountPaid) { this.amountPaid = amountPaid; }
    public Integer getFeedbackRating() { return feedbackRating; }
    public void setFeedbackRating(Integer feedbackRating) { this.feedbackRating = feedbackRating; }
    public String getFeedbackComment() { return feedbackComment; }
    public void setFeedbackComment(String feedbackComment) { this.feedbackComment = feedbackComment; }
}
