package com.example.demo.Repository;

import com.example.demo.Model.Notifikasi;
import com.example.demo.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotifikasiRepository extends JpaRepository<Notifikasi, Long> {

    List<Notifikasi> findByPenerimaOrderByWaktuDesc(User penerima);
}