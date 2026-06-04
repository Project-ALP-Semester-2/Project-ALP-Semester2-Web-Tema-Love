package com.example.demo.Repository;

import com.example.demo.Model.Bookmark;
import com.example.demo.Model.Cerita;
import com.example.demo.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional; // Tambahkan import ini
import java.util.List;

@Repository
public interface BookmarkRepository extends JpaRepository<Bookmark, Long> {

    List<Bookmark> findByUser(User user);
    
    // Cek apakah sudah di-bookmark
    boolean existsByUserAndCerita(User user, Cerita cerita);
    
    @Transactional
    void deleteByUserAndCerita(User user, Cerita cerita);
}