package com.example.demo.Model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "cerita")
public class Cerita {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_cerita;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String isiCerita;

    private String namaAnonim;
    private LocalDateTime tanggalDibuat;

    // HUBUNGAN: Banyak cerita dimiliki oleh satu User
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // HUBUNGAN: Satu cerita bisa punya banyak komentar
    @OneToMany(mappedBy = "cerita", cascade = CascadeType.ALL)
    private List<Komentar> daftarKomentar;

    // HUBUNGAN: Satu cerita bisa punya banyak rating
    @OneToMany(mappedBy = "cerita", cascade = CascadeType.ALL)
    private List<Rating> daftarRating;

    
    // GETTER DAN SETTER
    public Long getId() { return id_cerita; }
    public void setId(Long id_cerita) { this.id_cerita = id_cerita; }

    public String getIsiCerita() { return isiCerita; }
    public void setIsiCerita(String isiCerita) { this.isiCerita = isiCerita; }

    public List<Rating> getDaftarRating() { return daftarRating; }
    public void setDaftarRating(List<Rating> daftarRating) { this.daftarRating = daftarRating; }

    public String getNamaAnonim() { return namaAnonim; }
    public void setNamaAnonim(String namaAnonim) { this.namaAnonim = namaAnonim; }

    public LocalDateTime getTanggalDibuat() { return tanggalDibuat; }
    public void setTanggalDibuat(LocalDateTime tanggalDibuat) { this.tanggalDibuat = tanggalDibuat; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public List<Komentar> getDaftarKomentar() { return daftarKomentar; }
    public void setDaftarKomentar(List<Komentar> daftarKomentar) { this.daftarKomentar = daftarKomentar; }
}