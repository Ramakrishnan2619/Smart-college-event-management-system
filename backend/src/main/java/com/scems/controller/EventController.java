package com.scems.controller;

import com.scems.model.Event;
import com.scems.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:3000"})
public class EventController {

    @Autowired
    private EventRepository eventRepository;

    @GetMapping
    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Event> getEventById(@PathVariable String id) {
        return eventRepository.findByEventId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/category/{categoryId}")
    public List<Event> getEventsByCategory(@PathVariable String categoryId) {
        return eventRepository.findByCategoryId(categoryId);
    }

    @GetMapping("/trending")
    public List<Event> getTrendingEvents() {
        return eventRepository.findByIsTrendingTrue();
    }

    @GetMapping("/search")
    public List<Event> searchEvents(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String department,
            @RequestParam(required = false) String categoryId,
            @RequestParam(required = false, defaultValue = "date") String sort) {

        List<Event> results;

        if (query != null && !query.isEmpty()) {
            results = eventRepository.searchEvents(query);
        } else {
            results = eventRepository.findAll();
        }

        // Filter by department
        if (department != null && !department.isEmpty()) {
            results = results.stream()
                    .filter(e -> e.getDepartment().equals(department))
                    .collect(Collectors.toList());
        }

        // Filter by category
        if (categoryId != null && !categoryId.isEmpty()) {
            results = results.stream()
                    .filter(e -> e.getCategoryId().equals(categoryId))
                    .collect(Collectors.toList());
        }

        // Sort
        switch (sort) {
            case "popular":
                results.sort((a, b) -> b.getRegisteredCount() - a.getRegisteredCount());
                break;
            case "seats":
                results.sort((a, b) ->
                    (b.getMaxSeats() - b.getRegisteredCount()) - (a.getMaxSeats() - a.getRegisteredCount()));
                break;
            default: // date
                results.sort(Comparator.comparing(Event::getDate));
                break;
        }

        return results;
    }

    @PostMapping
    public Event createEvent(@Valid @RequestBody Event event) {
        event.setEventId("evt-new-" + System.currentTimeMillis());
        if (event.getRegisteredCount() == null) event.setRegisteredCount(0);
        if (event.getIsTrending() == null) event.setIsTrending(false);
        return eventRepository.save(event);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Event> updateEvent(@PathVariable String id, @Valid @RequestBody Event eventDetails) {
        return eventRepository.findByEventId(id)
                .map(event -> {
                    event.setTitle(eventDetails.getTitle());
                    event.setCategoryId(eventDetails.getCategoryId());
                    event.setDepartment(eventDetails.getDepartment());
                    event.setDate(eventDetails.getDate());
                    event.setTime(eventDetails.getTime());
                    event.setVenue(eventDetails.getVenue());
                    event.setDuration(eventDetails.getDuration());
                    event.setMaxSeats(eventDetails.getMaxSeats());
                    event.setDescription(eventDetails.getDescription());
                    event.setOrganizer(eventDetails.getOrganizer());
                    event.setBannerColor(eventDetails.getBannerColor());
                    event.setTags(eventDetails.getTags());
                    event.setIsTrending(eventDetails.getIsTrending());
                    if (eventDetails.getSchedule() != null) event.setSchedule(eventDetails.getSchedule());
                    if (eventDetails.getFaqs() != null) event.setFaqs(eventDetails.getFaqs());
                    return ResponseEntity.ok(eventRepository.save(event));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable String id) {
        return eventRepository.findByEventId(id)
                .map(event -> {
                    eventRepository.delete(event);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
