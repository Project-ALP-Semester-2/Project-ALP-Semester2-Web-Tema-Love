package com.example.demo.Model;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.Transient; 

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
    
    @Column(name = "kategori_tag")
    private String tag; 

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(mappedBy = "cerita", cascade = CascadeType.ALL)
    private List<Komentar> daftarKomentar;

    @OneToMany(mappedBy = "cerita", cascade = CascadeType.ALL)
    private List<Rating> daftarRating;

    @OneToMany(mappedBy = "cerita", cascade = CascadeType.ALL)
    private List<LikeCerita> daftarLike;

    @Transient
    private int pctHealthy;

    @Transient
    private int pctToxic;

    @Transient
    private long totalVote;

    @Transient
    private String pilihanUserAktif;

    
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

    public String getTag() { return tag; }
    public void setTag(String tag) { this.tag = tag; }

    public int getPctHealthy() { return pctHealthy; }
    public void setPctHealthy(int pctHealthy) { this.pctHealthy = pctHealthy; }

    public int getPctToxic() { return pctToxic; }
    public void setPctToxic(int pctToxic) { this.pctToxic = pctToxic; }

    public long getTotalVote() { return totalVote; }
    public void setTotalVote(long totalVote) { this.totalVote = totalVote; }

    public String getPilihanUserAktif() { return pilihanUserAktif; }
    public void setPilihanUserAktif(String pilihanUserAktif) { this.pilihanUserAktif = pilihanUserAktif; }

    // Getter & Setter Tambahan Baru
    public List<LikeCerita> getDaftarLike() { return daftarLike; }
    public void setDaftarLike(List<LikeCerita> daftarLike) { this.daftarLike = daftarLike; }
}