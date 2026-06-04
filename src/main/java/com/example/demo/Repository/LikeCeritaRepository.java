package com.example.demo.Repository;

import com.example.demo.Model.Cerita;
import com.example.demo.Model.LikeCerita;
import com.example.demo.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LikeCeritaRepository extends JpaRepository<LikeCerita, Long> {

    boolean existsByUserAndCerita(User user, Cerita cerita);

    LikeCerita findByUserAndCerita(User user, Cerita cerita);

    List<LikeCerita> findByUserOrderByIdDesc(User user);
}