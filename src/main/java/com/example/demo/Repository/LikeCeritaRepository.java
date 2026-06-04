package com.example.demo.Repository;

import com.example.demo.Model.Cerita;
import com.example.demo.Model.LikeCerita;
import com.example.demo.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LikeCeritaRepository extends JpaRepository<LikeCerita, Long> {
    // Mengecek apakah user sudah like cerita ini
    boolean existsByUserAndCerita(User user, Cerita cerita);
    
    // Mencari data like spesifik untuk di-unlike
    LikeCerita findByUserAndCerita(User user, Cerita cerita);
    
    // Menarik semua cerita yang disukai user (untuk tab Disukai)
    List<LikeCerita> findByUserOrderByIdDesc(User user);
}