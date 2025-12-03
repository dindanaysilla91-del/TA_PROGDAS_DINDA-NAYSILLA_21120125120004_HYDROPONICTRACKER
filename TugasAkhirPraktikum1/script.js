// KONSEP MODUL 1: VARIABEL & TIPE DATA : menyimpan nilai const untuk perhitungan
const IDEAL = {
    PH_MIN: 5.5,
    PH_MAX: 6.5,
    TEMP_MIN: 20, 
    TEMP_MAX: 28,
    PPM_MIN: 800, 
    PPM_MAX: 1200,
    SCORE_PER_PARAM: 33.333333333
};

// KONSEP MODUL VARIABEL & TIPE DATA (Array) : tempat penyimpanan data (Struktur Data) yang akan terus bertambah.
let historyData = []; 

// KONSEP MODUL FUNCTION & METHOD, PENGKONDISIAN : mendapatkan status umum berdasarkan skor total.
const getSimpleStatus = (score) => {
    if (score >= 85) return 'Optimal! ✨';
    if (score >= 60) return 'Baik, Tetapi Perlu Dicek.';
    return 'Kritis! 🚨 Segera periksa.';
};

//Menghitung skor dan menentukan status detail setiap parameter. Mengembalikan objek yang berisi total skor dan status detail.
const calculateDetailedScore = (ph, temp, ppm) => {
    let score = 0;
    const details = {}; 

    // --- SKOR PH ---
    if (ph >= IDEAL.PH_MIN && ph <= IDEAL.PH_MAX) {
        score += IDEAL.SCORE_PER_PARAM;
        details.phStatus = 'Optimal';
    } else if (ph > (IDEAL.PH_MIN - 1) && ph < (IDEAL.PH_MAX + 1)) {
        score += IDEAL.SCORE_PER_PARAM / 2;
        details.phStatus = 'Perlu Penyesuaian';
    } else {
        details.phStatus = 'Kritis';
    }

    // --- SKOR SUHU ---
    if (temp >= IDEAL.TEMP_MIN && temp <= IDEAL.TEMP_MAX) {
        score += IDEAL.SCORE_PER_PARAM;
        details.tempStatus = 'Optimal';
    } else if (temp > (IDEAL.TEMP_MIN - 5) && temp < (IDEAL.TEMP_MAX + 5)) {
        score += IDEAL.SCORE_PER_PARAM / 2;
        details.tempStatus = 'Perlu Penyesuaian';
    } else {
        details.tempStatus = 'Kritis';
    }

    // --- SKOR PPM ---
    if (ppm >= IDEAL.PPM_MIN && ppm <= IDEAL.PPM_MAX) {
        score += IDEAL.SCORE_PER_PARAM;
        details.ppmStatus = 'Optimal';
    } else if (ppm >= (IDEAL.PPM_MIN * 0.7) && ppm <= (IDEAL.PPM_MAX * 1.3)) {
        score += IDEAL.SCORE_PER_PARAM / 2;
        details.ppmStatus = 'Perlu Penyesuaian';
    } else {
        details.ppmStatus = 'Kritis';
    }
    return { 
        totalScore: Math.round(score), 
        details: details
    };
};

const getDetailedRecommendation = (scoreResult) => {
    const { totalScore, details } = scoreResult;
    
    if (totalScore >= 85) {
        return 'Sistem optimal! Pertahankan kondisi ini dengan monitoring harian.';
    }

    let criticalChecks = []; //KONSEP MODUL ARRAY
    let adjustmentChecks = [];

    if (details.phStatus === 'Kritis') criticalChecks.push('pH Air');
    if (details.tempStatus === 'Kritis') criticalChecks.push('Suhu Air');
    if (details.ppmStatus === 'Kritis') criticalChecks.push('PPM Nutrisi');
    
    if (details.phStatus === 'Perlu Penyesuaian') adjustmentChecks.push('pH Air');
    if (details.tempStatus === 'Perlu Penyesuaian') adjustmentChecks.push('Suhu Air');
    if (details.ppmStatus === 'Perlu Penyesuaian') adjustmentChecks.push('PPM Nutrisi');

    let recommendation = '';

    if (criticalChecks.length > 0) {
        recommendation += `**Kritis:Segera periksa dan sesuaikan nilai ${criticalChecks.join(', ')} agar masuk rentang optimal.**`;
    }

    if (adjustmentChecks.length > 0) {
        if (recommendation) recommendation += ' <br> '; // Tambah baris baru jika sudah ada rekomendasi kritis
        recommendation += `**Perlu Perhatian:Nilai ${adjustmentChecks.join(', ')} mulai menyimpang, segera lakukan penyesuaian kecil.**`;
    }
    
    return recommendation || 'Kondisi Baik, tapi ada potensi masalah yang belum terdeteksi. Periksa kembali semua parameter.';
};

//KONSEP MODUL FUNCTION & METHOD
//LOGIKA UTAMA: MENAMBAH, MENGHAPUS, DAN MERESET DATA
const addReading = () => {
    const plantName = document.getElementById('plantName').value.trim();
    const ph = parseFloat(document.getElementById('ph').value);
    const temp = parseFloat(document.getElementById('temp').value);
    const ppm = parseInt(document.getElementById('ppm').value);

//KONSEP MODUL PENGKONDISIAN & TIPE DATA (isNaN)
    if (!plantName || isNaN(ph) || isNaN(temp) || isNaN(ppm)) {
        alert("Mohon isi semua data dengan benar.");
        return;
    }

    // 2. Hitung Skor & Detail Status
    const scoreResult = calculateDetailedScore(ph, temp, ppm);
    const score = scoreResult.totalScore;
    const statusText = getSimpleStatus(score); // Status umum untuk judul
    const recommendation = getDetailedRecommendation(scoreResult); // Rekomendasi spesifik

    // 3. Simpan data ke Riwayat
    const newReading = { plantName, ph, temp, ppm, score, statusText, recommendation, details: scoreResult.details };
    historyData.push(newReading);

    // 4. Perbarui Tampilan
    renderHealthCard(score, statusText, recommendation);
    renderTable(); // renderTable akan memanggil updateMaintenanceQueue
};

//KONSEP MODUL FUNCTION & METHOD, ARRAY : menghapus satu baris data riwayat
const deleteReading = (displayIndex) => {
    // Menghitung indeks aktual di array historyData (karena tabel dirender terbalik)
    const actualIndex = historyData.length - displayIndex; 
    
    if (actualIndex >= 0 && actualIndex < historyData.length) {
        historyData.splice(actualIndex, 1);
        renderTable();

    // Setelah penghapusan, perbarui kartu kesehatan ke data terakhir, atau ke tampilan awal jika kosong
        if (historyData.length > 0) {
            const lastReading = historyData[historyData.length - 1];
            renderHealthCard(lastReading.score, lastReading.statusText, lastReading.recommendation);
        } else {
            renderHealthCard('—', 'Belum ada data.', 'Masukkan data untuk melihat saran dan detail diagnostik.');
        }
    }
};

////KONSEP MODUL FUNCTION & METHOD, VARIABEL
const resetData = () => {
    if (confirm("Apakah Anda yakin ingin menghapus semua Riwayat Pemantauan?")) {
        historyData = [];
        renderHealthCard('—', 'Belum ada data.', 'Masukkan data untuk melihat saran dan detail diagnostik.');
        renderTable();
        renderQueue([]);
    }
};

const processNext = () => {
    const queueList = document.getElementById('queueList');
    if (queueList.children.length > 0 && queueList.children[0].textContent.includes(':')) {
        const criticalItem = queueList.children[0].textContent;
        alert(`Sedang mensimulasikan penanganan masalah untuk ${criticalItem.split(':')[0].trim()}. 
        Asumsi: Tindakan korektif sudah dilakukan. Anda harus memasukkan data baru setelah koreksi.`);
       
// KONSEP: GUI PROGRAMMING (DOM Manipulation)
        // Dalam implementasi sederhana ini, kita hanya akan mereset tampilan antrian
        // untuk menunjukkan bahwa item telah "ditangani" secara simulatif.
        queueList.innerHTML = '<li style="color:var(--color-muted)">Item utama sudah diproses. Masukkan data baru untuk pembaruan status.</li>';
        document.getElementById('processBtn').style.opacity = '0.5';
        document.getElementById('processBtn').style.cursor = 'default';
    } else {
        alert("Antrian Pemeliharaan kosong atau tidak ada item yang perlu diproses!");
    }
};


//KONSEP: GUI PROGRAMMING (DOM Manipulation): untuk merender tampilan
const renderHealthCard = (score, statusText, recommendation) => {
    document.getElementById('score').textContent = score;
    document.getElementById('statusText').textContent = statusText;
    // Menggunakan innerHTML karena rekomendasi mengandung tag <br> dan **
    document.getElementById('recommend').innerHTML = recommendation; 
};
const renderTable = () => {
    const historyBody = document.getElementById('historyBody');
    historyBody.innerHTML = '';
    
 //KONSEP: PERULANGAN (FOR Loop - Menurun)
    for (let i = historyData.length - 1; i >= 0; i--) {
        const r = historyData[i];
        const displayIndex = historyData.length - i; 

//KONSEP: GUI PROGRAMMING (DOM Manipulation - Menambah baris HTML)
        historyBody.innerHTML += `
            <tr>
              <td>${displayIndex}</td>
              <td>${r.plantName}</td>
              <td>${r.ph}</td>
              <td>${r.temp}</td>
              <td>${r.ppm} PPM</td>
              <td>${r.statusText} (${r.score})</td>
              <td>
                <button onclick="deleteReading(${displayIndex})" 
                        style="background: none; border: none; color: var(--color-danger); cursor: pointer; font-weight: 600; font-size: 14px; padding: 0;">
                    Hapus
                </button>
              </td>
            </tr>
        `;
    }
    
    // Panggil fungsi antrian setelah tabel diperbarui
    updateMaintenanceQueue();
};

//merender antrian pemeliharaan
const renderQueue = (queue) => {
    const queueList = document.getElementById('queueList');
    queueList.innerHTML = '';
    
    if (queue.length === 0) {
        queueList.innerHTML = '<li style="color:var(--color-muted)">Antrian kosong. Semua optimal atau baik.</li>';
        // Nonaktifkan tombol
        document.getElementById('processBtn').style.opacity = '0.5';
        document.getElementById('processBtn').style.cursor = 'default';
    } else {
        queue.forEach(item => {
            const color = item.score < 60 ? 'var(--color-critical)' : 'var(--color-warning)';
            queueList.innerHTML += `
                <li style="margin-bottom: 5px; font-weight: 600;">
                    <span style="color: ${color}">${item.plantName}</span>: ${item.statusText} (${item.score})
                </li>
            `;
        });
        // Aktifkan tombol
        document.getElementById('processBtn').style.opacity = '1';
        document.getElementById('processBtn').style.cursor = 'pointer';
    }
};

// KONSEP: FUNGSI (Method) & STRUKTUR DATA QUEUE (Simulasi Antrian/Prioritas)
const updateMaintenanceQueue = () => {
    // 1. Ambil hanya data terakhir (terbaru) dari setiap nama tanaman
    const latestReadings = {};
    historyData.forEach(r => {
        // Data terbaru akan menimpa data lama dengan nama tanaman yang sama
        latestReadings[r.plantName] = r; 
    });

    // 2. Filter yang tidak optimal dan urutkan
    const queue = Object.values(latestReadings)
        .filter(r => r.score < 85) // Hanya masukkan yang 'Baik, Perlu Dicek' atau 'Kritis'
        .sort((a, b) => a.score - b.score); // Urutkan dari skor terendah (paling kritis, prioritas tinggi)

    renderQueue(queue);
};


// 4. EVENT LISTENERS (Menghubungkan tombol dengan fungsi)
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('addBtn').addEventListener('click', addReading);
    
    // --- Menghubungkan Tombol Reset ---
    document.getElementById('resetBtn').addEventListener('click', resetData);
    document.getElementById('resetBtn').style.opacity = '1'; // Aktifkan Tampilan
    document.getElementById('resetBtn').style.cursor = 'pointer'; // Aktifkan Kursor
    
    // --- Menghubungkan Tombol Process Next ---
    document.getElementById('processBtn').addEventListener('click', processNext);
    // Tampilan awal tombol Process Next diatur di renderQueue()

    // Atur tampilan awal
    renderHealthCard('—', 'Belum ada data.', 'Masukkan data untuk melihat saran dan detail diagnostik.');
    // Set tampilan awal untuk antrian
    renderQueue([]); 
});