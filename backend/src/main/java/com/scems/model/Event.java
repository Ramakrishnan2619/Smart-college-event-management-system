package com.scems.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "events")
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String eventId;

    @NotNull @Size(min = 3)
    @Column(nullable = false)
    private String title;

    @NotNull @Column(nullable = false)
    private String categoryId;

    @NotNull @Column(nullable = false)
    private String department;

    @NotNull @Column(nullable = false)
    private String date;

    @NotNull @Column(nullable = false)
    private String time;

    @NotNull @Column(nullable = false)
    private String venue;

    private String duration;
    @Column(name = "max_seats") private Integer maxSeats;
    @Column(name = "registered_count") private Integer registeredCount = 0;
    @Column(length = 2000) private String description;
    private String organizer;
    private String organizerAvatar;
    private String bannerColor;
    private Boolean isTrending;
    private String tags;
    @Column(length = 5000) private String schedule;
    @Column(length = 5000) private String faqs;

    public Event() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getEventId() { return eventId; }
    public void setEventId(String eventId) { this.eventId = eventId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getCategoryId() { return categoryId; }
    public void setCategoryId(String categoryId) { this.categoryId = categoryId; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }
    public String getTime() { return time; }
    public void setTime(String time) { this.time = time; }
    public String getVenue() { return venue; }
    public void setVenue(String venue) { this.venue = venue; }
    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }
    public Integer getMaxSeats() { return maxSeats; }
    public void setMaxSeats(Integer maxSeats) { this.maxSeats = maxSeats; }
    public Integer getRegisteredCount() { return registeredCount; }
    public void setRegisteredCount(Integer registeredCount) { this.registeredCount = registeredCount; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getOrganizer() { return organizer; }
    public void setOrganizer(String organizer) { this.organizer = organizer; }
    public String getOrganizerAvatar() { return organizerAvatar; }
    public void setOrganizerAvatar(String organizerAvatar) { this.organizerAvatar = organizerAvatar; }
    public String getBannerColor() { return bannerColor; }
    public void setBannerColor(String bannerColor) { this.bannerColor = bannerColor; }
    public Boolean getIsTrending() { return isTrending; }
    public void setIsTrending(Boolean isTrending) { this.isTrending = isTrending; }
    public String getTags() { return tags; }
    public void setTags(String tags) { this.tags = tags; }
    public String getSchedule() { return schedule; }
    public void setSchedule(String schedule) { this.schedule = schedule; }
    public String getFaqs() { return faqs; }
    public void setFaqs(String faqs) { this.faqs = faqs; }
}
