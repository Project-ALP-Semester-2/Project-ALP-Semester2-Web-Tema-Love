package com.example.demo.Repository;

import com.example.demo.Model.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface RatingRepository extends JpaRepository<Rating, Long> {
    
    Optional<Rating> findByUserUsernameAndCeritaId(String username, Long ceritaId);
    long countByCeritaIdAndStatusRating(Long ceritaId, String statusRating);
    long countByCeritaId(Long ceritaId);
}