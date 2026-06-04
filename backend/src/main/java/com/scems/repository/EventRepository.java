package com.scems.repository;

import com.scems.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    Optional<Event> findByEventId(String eventId);
    List<Event> findByCategoryId(String categoryId);
    List<Event> findByDepartment(String department);
    List<Event> findByIsTrendingTrue();

    @Query("SELECT e FROM Event e WHERE " +
           "LOWER(e.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(e.description) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(e.tags) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Event> searchEvents(@Param("query") String query);
}
