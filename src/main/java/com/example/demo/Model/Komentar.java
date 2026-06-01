package com.example.demo.Model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "komentar")
public class Komentar {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String isiKomentar;

    private String namaAnonimKomentar;
    private LocalDateTime tanggalDibuat;

    // HUBUNGAN: Banyak komentar ditulis oleh satu User
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // HUBUNGAN: Banyak komentar menempel pada satu Cerita
    @ManyToOne
    @JoinColumn(name = "cerita_id", nullable = false)
    private Cerita cerita;


    // GETTER DAN SETTER
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getIsiKomentar() { return isiKomentar; }
    public void setIsiKomentar(String isiKomentar) { this.isiKomentar = isiKomentar; }
  
    public String getNamaAnonimKomentar() { return namaAnonimKomentar; }
    public void setNamaAnonimKomentar(String namaAnonimKomentar) { this.namaAnonimKomentar = namaAnonimKomentar; }
  
    public LocalDateTime getTanggalDibuat() { return tanggalDibuat; }
    public void setTanggalDibuat(LocalDateTime tanggalDibuat) { this.tanggalDibuat = tanggalDibuat; }
  
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
  
    public Cerita getCerita() { return cerita; }
    public void setCerita(Cerita cerita) { this.cerita = cerita; }
}