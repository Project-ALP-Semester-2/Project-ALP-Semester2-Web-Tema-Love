package com.example.demo.Repository;

import com.example.demo.Model.Cerita;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List; // Wajib di-import agar List terbaca

@Repository
public interface CeritaRepository extends JpaRepository<Cerita, Long> {
    
    // Deklarasikan method ini di sini agar error "undefined" hilang
    List<Cerita> findAllByOrderByTanggalDibuatDesc();

}