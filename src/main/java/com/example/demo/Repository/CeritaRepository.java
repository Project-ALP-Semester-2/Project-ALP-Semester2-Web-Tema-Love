package com.example.demo.Repository;

import com.example.demo.Model.Cerita;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List; // Wajib di-import agar List terbaca

@Repository
public interface CeritaRepository extends JpaRepository<Cerita, Long> {
    
    @Query("SELECT c FROM Cerita c ORDER BY c.tanggalDibuat DESC")
    Page<Cerita> findAllCeritaTerbaru(Pageable pageable);
    List<Cerita> findAllByOrderByTanggalDibuatDesc();

}