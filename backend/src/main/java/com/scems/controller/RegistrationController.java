package com.scems.controller;

import com.scems.model.Registration;
import com.scems.model.Event;
import com.scems.repository.RegistrationRepository;
import com.scems.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/registrations")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:3000"})
public class RegistrationController {

    @Autowired
    private RegistrationRepository registrationRepository;

    @Autowired
    private EventRepository eventRepository;

    @GetMapping
    public List<Map<String, Object>> getAllRegistrations() {
        return registrationRepository.findAll().stream()
                .map(this::enrichRegistration)
                .collect(Collectors.toList());
    }

    @GetMapping("/student/{studentId}")
    public List<Map<String, Object>> getMyRegistrations(@PathVariable String studentId) {
        return registrationRepository.findByStudentId(studentId).stream()
                .map(this::enrichRegistration)
                .collect(Collectors.toList());
    }

    @GetMapping("/event/{eventId}")
    public List<Registration> getEventRegistrations(@PathVariable String eventId) {
        return registrationRepository.findByEventId(eventId);
    }

    @GetMapping("/check")
    public ResponseEntity<Map<String, Boolean>> checkRegistration(
            @RequestParam String eventId,
            @RequestParam String studentId) {
        boolean isRegistered = registrationRepository
                .findByEventIdAndStudentIdAndStatusNot(eventId, studentId, "cancelled")
                .isPresent();
        return ResponseEntity.ok(Map.of("registered", isRegistered));
    }

    @PostMapping
    public ResponseEntity<?> registerForEvent(@RequestBody Map<String, Object> body) {
        String eventId = (String) body.get("eventId");
        String studentId = (String) body.get("studentId");

        if (eventId == null || studentId == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "eventId and studentId are required"));
        }

        // Find the event
        return eventRepository.findByEventId(eventId)
            .map(event -> {
                // Check if seats available
                if (event.getRegisteredCount() >= event.getMaxSeats()) {
                    return ResponseEntity.badRequest().body((Object) Map.of("error", "Event is full"));
                }

                // Check if already registered
                if (registrationRepository.findByEventIdAndStudentIdAndStatusNot(eventId, studentId, "cancelled").isPresent()) {
                    return ResponseEntity.badRequest().body((Object) Map.of("error", "Already registered"));
                }

                // Create registration
                Registration reg = new Registration();
                reg.setRegistrationId("reg-" + System.currentTimeMillis());
                reg.setEventId(eventId);
                reg.setStudentId(studentId);
                reg.setStatus("upcoming");
                reg.setRegisteredOn(LocalDate.now().toString());

                if (body.containsKey("paymentId")) {
                    reg.setPaymentId((String) body.get("paymentId"));
                }
                if (body.containsKey("amountPaid")) {
                    reg.setAmountPaid(Double.parseDouble(body.get("amountPaid").toString()));
                }

                // Update event registered count
                event.setRegisteredCount(event.getRegisteredCount() + 1);
                eventRepository.save(event);

                // Save registration
                Registration saved = registrationRepository.save(reg);
                return ResponseEntity.ok((Object) enrichRegistration(saved));
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{regId}/feedback")
    public ResponseEntity<?> submitFeedback(@PathVariable String regId, @RequestBody Map<String, Object> feedback) {
        return registrationRepository.findByRegistrationId(regId)
                .map(reg -> {
                    if (feedback.containsKey("rating")) {
                        reg.setFeedbackRating(Integer.parseInt(feedback.get("rating").toString()));
                    }
                    if (feedback.containsKey("comment")) {
                        reg.setFeedbackComment(feedback.get("comment").toString());
                    }
                    Registration saved = registrationRepository.save(reg);
                    return ResponseEntity.ok((Object) enrichRegistration(saved));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Enrich registration with event data for frontend consumption
    private Map<String, Object> enrichRegistration(Registration reg) {
        Map<String, Object> result = new HashMap<>();
        result.put("id", reg.getRegistrationId());
        result.put("eventId", reg.getEventId());
        result.put("studentId", reg.getStudentId());
        result.put("status", reg.getStatus());
        result.put("registeredOn", reg.getRegisteredOn());
        result.put("paymentId", reg.getPaymentId());
        result.put("amountPaid", reg.getAmountPaid());

        // Build feedback object
        if (reg.getFeedbackRating() != null) {
            Map<String, Object> feedback = new HashMap<>();
            feedback.put("rating", reg.getFeedbackRating());
            feedback.put("comment", reg.getFeedbackComment());
            result.put("feedback", feedback);
        } else {
            result.put("feedback", null);
        }

        // Attach event details
        eventRepository.findByEventId(reg.getEventId()).ifPresent(event -> {
            Map<String, Object> eventMap = new HashMap<>();
            eventMap.put("id", event.getEventId());
            eventMap.put("title", event.getTitle());
            eventMap.put("categoryId", event.getCategoryId());
            eventMap.put("department", event.getDepartment());
            eventMap.put("date", event.getDate());
            eventMap.put("time", event.getTime());
            eventMap.put("venue", event.getVenue());
            eventMap.put("duration", event.getDuration());
            eventMap.put("maxSeats", event.getMaxSeats());
            eventMap.put("registeredCount", event.getRegisteredCount());
            eventMap.put("description", event.getDescription());
            eventMap.put("organizer", event.getOrganizer());
            eventMap.put("bannerColor", event.getBannerColor());
            eventMap.put("isTrending", event.getIsTrending());
            eventMap.put("tags", event.getTags());
            result.put("event", eventMap);
        });

        return result;
    }
}
