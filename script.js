// KONSEP MODUL 1: VARIABEL & TIPE DATA 
const IDEAL = {
    PH_MIN: 5.5,
    PH_MAX: 6.5,
    TEMP_MIN: 20, 
    TEMP_MAX: 28,
    PPM_MIN: 800, 
    PPM_MAX: 1200,
    SCORE_PER_PARAM: 33.333333333
};

// KONSEP MODUL 1: VARIABEL & TIPE DATA (Array)
let historyData = []; 

// KONSEP MODUL 2 & 4: FUNCTION & METHOD, PENGKONDISIAN
const getSimpleStatus = (score) => {
    if (score >= 85) return 'Optimal! ✨';
    if (score >= 60) return 'Baik, Tetapi Perlu Dicek.';
    return 'Kritis! 🚨 Segera periksa.';
};

const calculateDetailedScore = (ph, temp, ppm) => {
    let score = 0;
    const details = {}; 

    if (ph >= IDEAL.PH_MIN && ph <= IDEAL.PH_MAX) {
        score += IDEAL.SCORE_PER_PARAM;
        details.phStatus = 'Optimal';
    } else if (ph > (IDEAL.PH_MIN - 1) && ph < (IDEAL.PH_MAX + 1)) {
        score += IDEAL.SCORE_PER_PARAM / 2;
        details.phStatus = 'Perlu Penyesuaian';
    } else {
        details.phStatus = 'Kritis';
    }


    if (temp >= IDEAL.TEMP_MIN && temp <= IDEAL.TEMP_MAX) {
        score += IDEAL.SCORE_PER_PARAM;
        details.tempStatus = 'Optimal';
    } else if (temp > (IDEAL.TEMP_MIN - 5) && temp < (IDEAL.TEMP_MAX + 5)) {
        score += IDEAL.SCORE_PER_PARAM / 2;
        details.tempStatus = 'Perlu Penyesuaian';
    } else {
        details.tempStatus = 'Kritis';
    }

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

    let criticalChecks = []; 
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
        if (recommendation) recommendation += ' <br> '; 
        recommendation += `**Perlu Perhatian:Nilai ${adjustmentChecks.join(', ')} mulai menyimpang, segera lakukan penyesuaian kecil.**`;
    }
    
    return recommendation || 'Kondisi Baik, tapi ada potensi masalah yang belum terdeteksi. Periksa kembali semua parameter.';
};

//KONSEP MODUL 4: FUNCTION & METHOD
const addReading = () => {
    const plantName = document.getElementById('plantName').value.trim();
    const age = parseInt(document.getElementById('age').value); // Ambil nilai usia
    const ph = parseFloat(document.getElementById('ph').value);
    const temp = parseFloat(document.getElementById('temp').value);
    const ppm = parseInt(document.getElementById('ppm').value);

//KONSEP MODUL 2 & 1: PENGKONDISIAN & TIPE DATA (isNaN)
    if (!plantName || isNaN(ph) || isNaN(temp) || isNaN(ppm) || isNaN(age)) {
        alert("Mohon isi semua data dengan benar.");
        return;
    }
    
    if (age < 0) {
        alert("Usia (hari) tidak boleh bernilai negatif. Nilai minimal adalah 0.");
        return;
    }

    const scoreResult = calculateDetailedScore(ph, temp, ppm);
    const score = scoreResult.totalScore;
    const statusText = getSimpleStatus(score); 
    const recommendation = getDetailedRecommendation(scoreResult);
    const newReading = { plantName, age, ph, temp, ppm, score, statusText, recommendation, details: scoreResult.details };
    historyData.push(newReading);

    renderHealthCard(score, statusText, recommendation);
    renderTable(); 
};

const editReading = (displayIndex) => {
    const actualIndex = historyData.length - displayIndex;
    
    if (actualIndex >= 0 && actualIndex < historyData.length) {
        const itemToEdit = historyData[actualIndex];
        
        document.getElementById('plantName').value = itemToEdit.plantName;
        document.getElementById('ph').value = itemToEdit.ph;
        document.getElementById('temp').value = itemToEdit.temp;
        document.getElementById('ppm').value = itemToEdit.ppm;
        historyData.splice(actualIndex, 1);
        renderTable(); 
        
        if (historyData.length > 0) {
            const lastReading = historyData[historyData.length - 1];
            renderHealthCard(lastReading.score, lastReading.statusText, lastReading.recommendation);
        } else {
            renderHealthCard('—', 'Belum ada data.', 'Masukkan data untuk melihat saran dan detail diagnostik.');
        }

        alert(`Data ke-${displayIndex} (${itemToEdit.plantName}) telah dimuat ke formulir. Silakan koreksi nilainya dan tekan "Tambah Data" untuk menyimpan versi terbaru di posisi teratas.`);
    }
};

//KONSEP MODUL 4 & 1: FUNCTION & METHOD, ARRAY 
const deleteReading = (displayIndex) => {

    const actualIndex = historyData.length - displayIndex; 
    
    if (actualIndex >= 0 && actualIndex < historyData.length) {
        historyData.splice(actualIndex, 1);
        renderTable();

        if (historyData.length > 0) {
            const lastReading = historyData[historyData.length - 1];
            renderHealthCard(lastReading.score, lastReading.statusText, lastReading.recommendation);
        } else {
            renderHealthCard('—', 'Belum ada data.', 'Masukkan data untuk melihat saran dan detail diagnostik.');
        }
    }
};

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
       
// KONSEP MODUL 8: GUI PROGRAMMING
        queueList.innerHTML = '<li style="color:var(--color-muted)">Item utama sudah diproses. Masukkan data baru untuk pembaruan status.</li>';
        document.getElementById('processBtn').style.opacity = '0.5';
        document.getElementById('processBtn').style.cursor = 'default';
    } 
    
    else {
        alert("Antrian Pemeliharaan kosong atau tidak ada item yang perlu diproses!");
    }
};


//KONSEP Modul 8: GUI PROGRAMMING 
const renderHealthCard = (score, statusText, recommendation) => {
    document.getElementById('score').textContent = score;
    document.getElementById('statusText').textContent = statusText;
    document.getElementById('recommend').innerHTML = recommendation; 
};

const renderTable = () => {
    const historyBody = document.getElementById('historyBody');
    historyBody.innerHTML = '';
    
 //KONSEP MODUL 3: PERULANGAN 
    for (let i = historyData.length - 1; i >= 0; i--) {
        const r = historyData[i];
        const displayIndex = historyData.length - i; 

//KONSEP MODUL 8: GUI PROGRAMMING 
        historyBody.innerHTML += `
            <tr>
              <td>${displayIndex}</td>
              <td>${r.plantName}</td>
              <td>${r.ph}</td>
              <td>${r.temp}</td>
              <td>${r.ppm} PPM</td>
              <td>${r.statusText} (${r.score})</td>
              <td>
                <button onclick="editReading(${displayIndex})" 
                        style="background: none; border: none; color: var(--color-primary); cursor: pointer; font-weight: 600; font-size: 14px; padding: 0 8px 0 0;">
                    Edit
                </button>
                <button onclick="deleteReading(${displayIndex})" 
                        style="background: none; border: none; color: var(--color-danger); cursor: pointer; font-weight: 600; font-size: 14px; padding: 0;">
                    Hapus
                </button>
              </td>
            </tr>
        `;
    }
 
    updateMaintenanceQueue();
};

const renderQueue = (queue) => {
    const queueList = document.getElementById('queueList');
    queueList.innerHTML = '';
    
    if (queue.length === 0) {
        queueList.innerHTML = '<li style="color:var(--color-primary)">Antrian kosong. Semua optimal atau baik.</li>';
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
        document.getElementById('processBtn').style.opacity = '1';
        document.getElementById('processBtn').style.cursor = 'pointer';
    }
};

// KONSEP MODUL 4 & 7: FUNGSI (Method) & STRUKTUR DATA QUEUE
const updateMaintenanceQueue = () => {
    const latestReadings = {};
    historyData.forEach(r => {
        latestReadings[r.plantName] = r; 
    });

    const queue = Object.values(latestReadings)
        .filter(r => r.score < 85) 
        .sort((a, b) => a.score - b.score); 
    renderQueue(queue);
};


document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('addBtn').addEventListener('click', addReading);
    
    document.getElementById('resetBtn').addEventListener('click', resetData);
    
    document.getElementById('processBtn').addEventListener('click', processNext);

    renderHealthCard('—', 'Belum ada data.', 'Masukkan data untuk melihat saran dan detail diagnostik.');
    renderQueue([]); 
});