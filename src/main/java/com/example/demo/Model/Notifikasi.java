package com.example.demo.Model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifikasi")
public class Notifikasi {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "penerima_id", nullable = false)
    private User penerima;

    @ManyToOne
    @JoinColumn(name = "pengirim_id")
    private User pengirim;

    private String jenis; 

    @ManyToOne
    @JoinColumn(name = "cerita_id")
    private Cerita cerita;

    private String pesan;

    private LocalDateTime waktu;

    private boolean sudahDibaca = false;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getPenerima() { return penerima; }
    public void setPenerima(User penerima) { this.penerima = penerima; }

    public User getPengirim() { return pengirim; }
    public void setPengirim(User pengirim) { this.pengirim = pengirim; }

    public String getJenis() { return jenis; }
    public void setJenis(String jenis) { this.jenis = jenis; }

    public Cerita getCerita() { return cerita; }
    public void setCerita(Cerita cerita) { this.cerita = cerita; }

    public String getPesan() { return pesan; }
    public void setPesan(String pesan) { this.pesan = pesan; }

    public LocalDateTime getWaktu() { return waktu; }
    public void setWaktu(LocalDateTime waktu) { this.waktu = waktu; }

    public boolean isSudahDibaca() { return sudahDibaca; }
    public void setSudahDibaca(boolean sudahDibaca) { this.sudahDibaca = sudahDibaca; }
}