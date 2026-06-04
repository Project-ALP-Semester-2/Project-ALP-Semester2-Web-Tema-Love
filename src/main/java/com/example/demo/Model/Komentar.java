package com.example.demo.Model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "komentar")
public class Komentar {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_komentar;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String isiKomentar;

    private LocalDateTime tanggalKomentar;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "cerita_id")
    private Cerita cerita;

    // Getter & Setter
    public Long getId_komentar() { return id_komentar; }
    public void setId_komentar(Long id_komentar) { this.id_komentar = id_komentar; }

    public String getIsiKomentar() { return isiKomentar; }
    public void setIsiKomentar(String isiKomentar) { this.isiKomentar = isiKomentar; }

    public LocalDateTime getTanggalKomentar() { return tanggalKomentar; }
    public void setTanggalKomentar(LocalDateTime tanggalKomentar) { this.tanggalKomentar = tanggalKomentar; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Cerita getCerita() { return cerita; }
    public void setCerita(Cerita cerita) { this.cerita = cerita; }
}