package com.scems.repository;

import com.scems.model.Registration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RegistrationRepository extends JpaRepository<Registration, Long> {
    Optional<Registration> findByRegistrationId(String registrationId);
    List<Registration> findByEventId(String eventId);
    List<Registration> findByStudentId(String studentId);
    Optional<Registration> findByEventIdAndStudentIdAndStatusNot(String eventId, String studentId, String status);
}
