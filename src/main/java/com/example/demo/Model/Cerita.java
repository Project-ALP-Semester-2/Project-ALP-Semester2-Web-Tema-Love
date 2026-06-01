package com.example.demo.Model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "cerita")
public class Cerita {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String isiCerita;

    private int countSehat = 0;
    private int countTidakSehat = 0;

    private String namaAnonim;
    private LocalDateTime tanggalDibuat;

    // HUBUNGAN: Banyak cerita dimiliki oleh satu User
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // HUBUNGAN: Satu cerita bisa punya banyak komentar
    @OneToMany(mappedBy = "cerita", cascade = CascadeType.ALL)
    private List<Komentar> daftarKomentar;

    
    // GETTER DAN SETTER
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getIsiCerita() { return isiCerita; }
    public void setIsiCerita(String isiCerita) { this.isiCerita = isiCerita; }

    public int getCountSehat() { return countSehat; }
    public void setCountSehat(int countSehat) { this.countSehat = countSehat; }

    public int getCountTidakSehat() { return countTidakSehat; }
    public void setCountTidakSehat(int countTidakSehat) { this.countTidakSehat = countTidakSehat; }

    public String getNamaAnonim() { return namaAnonim; }
    public void setNamaAnonim(String namaAnonim) { this.namaAnonim = namaAnonim; }

    public LocalDateTime getTanggalDibuat() { return tanggalDibuat; }
    public void setTanggalDibuat(LocalDateTime tanggalDibuat) { this.tanggalDibuat = tanggalDibuat; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public List<Komentar> getDaftarKomentar() { return daftarKomentar; }
    public void setDaftarKomentar(List<Komentar> daftarKomentar) { this.daftarKomentar = daftarKomentar; }
}