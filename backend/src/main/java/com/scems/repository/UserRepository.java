package com.scems.repository;

import com.scems.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String username);
    User findByRollNo(String rollNo);
    
    @org.springframework.data.jpa.repository.Query("SELECT u FROM User u WHERE u.id = ?1")
    java.util.Optional<User> findByStringId(String stringId);
}
