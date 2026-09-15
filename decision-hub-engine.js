// ==============================================================
// Decision Hub Engine: High-Performance Scoped KaTeX + Custom Combobox
// ==============================================================

const ALGO_REGISTRY = {
    sMBR01: {
        title: "sMBR01 Soft Decision-Making Simulator",
        desc: "Sign-based rapid soft decision-making algorithm evaluated across fuzzy parameterized fuzzy soft matrices (fpfs-matrices).",
        citation: "Enginoğlu, S., Memiş, S., 2018. Comment on 'Fuzzy Soft Sets', IJLERA, 3(9), 1-9.",
        bibtex: `@article{enginoglu2018comment,
  title={Comment on "Fuzzy Soft Sets"[The Journal of Fuzzy Mathematics, 9 (3), 2001, 589--602]},
  author={Engino{\\u{g}}lu, Serdar and Memi{\\c{s}}, Samet},
  journal={International Journal of Latest Engineering Research and Applications},
  volume={3},
  number={9},
  pages={1--9},
  year={2018}
}`,
        mode: "fpfs",
        status: "active"
    },
    PEM: {
        title: "Prevalence Effect Method (PEM)",
        desc: "Soft decision-making method evaluating relative prevalence degree across fuzzy parameters.",
        citation: "Memiş, S. et al., Prevalence Effect Method for Multi-Criteria Decision-Making.",
        bibtex: `@article{memis2024pem,
  title={Prevalence Effect Method for Decision-Making},
  author={Memi{\\c{s}}, Samet},
  journal={Working Toolbox},
  year={2024}
}`,
        mode: "fpfs",
        status: "active"
    },
    AHP: {
        title: "Analytic Hierarchy Process (Classical AHP)",
        desc: "Saaty pairwise matrix comparisons for criteria weights. Computes Principal Eigenvalue (\\lambda_{\\max}), Consistency Index (CI), and Consistency Ratio (CR).",
        citation: "Saaty, T. L., 1980. The Analytic Hierarchy Process, McGraw-Hill.",
        bibtex: `@book{saaty1980analytic,
  title={The Analytic Hierarchy Process},
  author={Saaty, Thomas L},
  year={1980},
  publisher={McGraw-Hill}
}`,
        mode: "pairwise",
        status: "active"
    },
    TOPSIS: {
        title: "Classical TOPSIS Engine",
        desc: "Vector normalization, Euclidean distances to Positive (PIS) & Negative Ideal Solutions (NIS), and Relative Closeness C_i.",
        citation: "Hwang, C. L., & Yoon, K., 1981. Multiple Attribute Decision Making: Methods and Applications.",
        bibtex: `@book{hwang1981multiple,
  title={Multiple Attribute Decision Making: Methods and Applications},
  author={Hwang, Ching-Lai and Yoon, Kwangsun},
  year={1981},
  publisher={Springer-Verlag}
}`,
        mode: "topsis",
        status: "active"
    },
    VIKOR: {
        title: "VIKOR Compromise Ranking",
        desc: "Compromise ranking method determining S_i, R_i, and Q_i values with acceptable advantage conditions.",
        citation: "Opricovic, S., 1998. Multicriteria Optimization of Civil Engineering Systems.",
        status: "upcoming"
    },
    FAHP: {
        title: "Fuzzy AHP (Extent Analysis)",
        desc: "Chang extent analysis using triangular fuzzy numbers (TFN: l, m, u) and degree of possibility calculations.",
        citation: "Chang, D. Y., 1996. Applications of the extent analysis method on fuzzy AHP, EJOR.",
        status: "upcoming"
    },
    FTOPSIS: {
        title: "Fuzzy TOPSIS Multi-Criteria Engine",
        desc: "Fuzzy distance operators and fuzzy decision matrix aggregations under uncertain environments.",
        citation: "Chen, C. T., 2000. Extensions of the TOPSIS for group decision-making under fuzzy environment.",
        status: "upcoming"
    },
    "DELPHI-AHP-PEM": {
        title: "DELPHI-AHP-PEM Hybrid Model",
        desc: "Hybrid decision pipeline coupling Delphi expert consensus, AHP criteria weights, and Picture Fuzzy Prevalence Effect Method (PEM).",
        citation: "Memiş, S. et al., Determining Green Transformation Strategies via DELPHI-AHP-PEM.",
        bibtex: `@article{memis2025delphi,
  title={Determining Green Transformation Strategies via DELPHI-AHP-PEM},
  author={Memi{\\c{s}}, Samet and collaborators},
  journal={Working Toolbox},
  year={2025}
}`,
        status: "upcoming"
    },
    "IDOCRIW-SDM": {
        title: "IDOCRIW-SDM Hybrid Model",
        desc: "Integrated Determination of Objective Criteria Weights (IDOCRIW) synthesized with Soft Decision-Making algorithms.",
        citation: "Memiş, S. et al., IDOCRIW-SDM Decision Platform.",
        status: "upcoming"
    }
};

let currentAlgoKey = "AHP";

// Scoped KaTeX Derleyicisi (Performans kilitlemelerini önler)
function renderMathScoped(element) {
    if (window.renderMathInElement && element) {
        renderMathInElement(element, {
            delimiters: [
                { left: "$$", right: "$$", display: true },
                { left: "\\[", right: "\\]", display: true },
                { left: "$", right: "$", display: false },
                { left: "\\(", right: "\\)", display: false }
            ],
            throwOnError: false
        });
    }
}

// Custom Combobox Açıp Kapatma
function toggleCombobox(id) {
    const box = document.getElementById(id);
    const isOpen = box.classList.contains('open');
    
    // Açık olan tüm diğer dropdown'ları kapat
    document.querySelectorAll('.custom-combobox').forEach(b => b.classList.remove('open'));
    
    if (!isOpen) {
        box.classList.add('open');
    }
}

// Dışarı tıklandığında açık olan Combobox'ları kapat
document.addEventListener('click', (e) => {
    if (!e.target.closest('.custom-combobox')) {
        document.querySelectorAll('.custom-combobox').forEach(b => b.classList.remove('open'));
    }
});

// FPFS Model Seçimi
function selectFPFSModel(algoName, status) {
    document.querySelectorAll('input[name="selected-algo"]').forEach(r => r.checked = false);
    
    document.getElementById('fpfs-selected-label').textContent = algoName;
    const badge = document.getElementById('fpfs-selected-badge');
    badge.textContent = status;
    badge.className = "status-pill " + (status === 'Active' ? 'status-ongoing' : 'status-completed');

    document.getElementById('combo-fpfs').classList.remove('open');
    currentAlgoKey = algoName;
    syncUIWithAlgo();
}

// Yakında (Upcoming) Olan Modeller Tıklandığında
function selectUpcomingModel(algoName) {
    document.querySelectorAll('.custom-combobox').forEach(b => b.classList.remove('open'));
    alert(`The [${algoName}] algorithmic module is cataloged in the ConfigSDM repository and will be active in the upcoming release.`);
}

// Radyo Butonları Değiştiğinde
function handleSingleAlgoChange(radioInput) {
    currentAlgoKey = radioInput.value;
    syncUIWithAlgo();
}

function syncUIWithAlgo() {
    const meta = ALGO_REGISTRY[currentAlgoKey] || ALGO_REGISTRY["sMBR01"];

    const titleEl = document.getElementById('active-algo-title');
    const descEl = document.getElementById('active-algo-desc');
    const citeEl = document.getElementById('algo-citation');

    titleEl.innerHTML = `<i class="fa-solid fa-sliders"></i> ${meta.title}`;
    descEl.textContent = meta.desc;
    citeEl.textContent = meta.citation || "Academic Benchmark";

    const altWrap = document.getElementById('dim-alt-wrap');
    const critWrap = document.getElementById('dim-crit-wrap');
    const lblAlt = document.getElementById('lbl-alt');
    const lblCrit = document.getElementById('lbl-crit');

    if (meta.mode === "pairwise") {
        lblCrit.textContent = "Number of Criteria (n):";
        critWrap.style.display = "flex";
        altWrap.style.display = "none";
    } else {
        lblAlt.innerHTML = "Alternatives ($m-1$):";
        lblCrit.innerHTML = "Criteria ($n$):";
        altWrap.style.display = "flex";
        critWrap.style.display = "flex";
        renderMathScoped(lblAlt);
        renderMathScoped(lblCrit);
    }

    generateInputMatrix();
}

function generateInputMatrix() {
    const meta = ALGO_REGISTRY[currentAlgoKey] || ALGO_REGISTRY["sMBR01"];
    const table = document.getElementById('hub-data-table');
    document.getElementById('hub-results-panel').style.display = 'none';
    table.innerHTML = '';

    if (meta.status === "upcoming") {
        table.innerHTML = `<tr><td style="padding: 2.5rem; color: var(--text-muted); font-size: 0.95rem;">
            <i class="fa-solid fa-clock-rotate-left" style="font-size: 2rem; display: block; margin-bottom: 0.8rem; color: #f59e0b;"></i>
            <strong>${meta.title}</strong> module is scheduled for deployment. Active modules: <strong>AHP</strong>, <strong>TOPSIS</strong>, <strong>sMBR01</strong>, and <strong>PEM</strong>.
        </td></tr>`;
        return;
    }

    if (meta.mode === "pairwise") {
        buildAHPMatrix(table);
    } else if (meta.mode === "topsis") {
        buildTOPSISMatrix(table);
    } else {
        buildFPFSMatrix(table);
    }

    renderMathScoped(table);
}

function buildAHPMatrix(table) {
    const n = parseInt(document.getElementById('hub-num-crit').value, 10);
    const thead = document.createElement('thead');
    const hrow = document.createElement('tr');
    hrow.innerHTML = `<th>Pairwise Comparison</th>`;
    for (let j = 1; j <= n; j++) hrow.innerHTML += `<th>Criterion C${j}</th>`;
    thead.appendChild(hrow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    for (let i = 1; i <= n; i++) {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td><strong>Criterion C${i}</strong></td>`;
        for (let j = 1; j <= n; j++) {
            const td = document.createElement('td');
            if (i === j) {
                td.innerHTML = `<span style="font-weight:700; color:var(--text-muted)">1.00</span>`;
            } else if (i < j) {
                td.innerHTML = `<input type="number" step="0.1" min="0.11" max="9" value="1.0" class="matrix-input-ahp" data-i="${i}" data-j="${j}" onchange="updateAHPSymmetric(this)">`;
            } else {
                td.innerHTML = `<span id="ahp-cell-${i}-${j}" style="font-size:0.8rem; color:var(--text-muted)">1.00</span>`;
            }
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    }
    table.appendChild(tbody);
}

function updateAHPSymmetric(input) {
    const i = parseInt(input.dataset.i, 10);
    const j = parseInt(input.dataset.j, 10);
    const val = parseFloat(input.value) || 1.0;
    const recip = (1 / val).toFixed(3);
    const mirrorCell = document.getElementById(`ahp-cell-${j}-${i}`);
    if (mirrorCell) mirrorCell.textContent = recip;
}

function buildFPFSMatrix(table) {
    const mAlt = parseInt(document.getElementById('hub-num-alt').value, 10);
    const nCrit = parseInt(document.getElementById('hub-num-crit').value, 10);

    const thead = document.createElement('thead');
    const hrow = document.createElement('tr');
    hrow.innerHTML = `<th>fpfs-Space</th>`;
    for (let j = 1; j <= nCrit; j++) hrow.innerHTML += `<th>Param $e_{${j}}$</th>`;
    thead.appendChild(hrow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    const wrow = document.createElement('tr');
    wrow.className = 'weights-row';
    wrow.innerHTML = `<td><strong>Weights $a(1,:)$</strong></td>`;
    for (let j = 0; j < nCrit; j++) {
        wrow.innerHTML += `<td><input type="number" step="0.05" min="0" max="1" value="${(0.5 + Math.random()*0.4).toFixed(2)}" class="fpfs-cell" data-r="0" data-c="${j}"></td>`;
    }
    tbody.appendChild(wrow);

    for (let i = 1; i <= mAlt; i++) {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td><strong>Alternative $u_{${i}}$</strong></td>`;
        for (let j = 0; j < nCrit; j++) {
            tr.innerHTML += `<td><input type="number" step="0.05" min="0" max="1" value="${(Math.random()).toFixed(2)}" class="fpfs-cell" data-r="${i}" data-c="${j}"></td>`;
        }
        tbody.appendChild(tr);
    }
    table.appendChild(tbody);
}

function buildTOPSISMatrix(table) {
    const mAlt = parseInt(document.getElementById('hub-num-alt').value, 10);
    const nCrit = parseInt(document.getElementById('hub-num-crit').value, 10);

    const thead = document.createElement('thead');
    const hrow = document.createElement('tr');
    hrow.innerHTML = `<th>Alternatives</th>`;
    for (let j = 1; j <= nCrit; j++) hrow.innerHTML += `<th>Criterion $C_{${j}}$</th>`;
    thead.appendChild(hrow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    const wrow = document.createElement('tr');
    wrow.className = 'weights-row';
    wrow.innerHTML = `<td><strong>Weights $w_j$</strong></td>`;
    for (let j = 0; j < nCrit; j++) {
        wrow.innerHTML += `<td><input type="number" step="0.05" min="0.01" max="1" value="${(1/nCrit).toFixed(2)}" class="topsis-weight" data-c="${j}"></td>`;
    }
    tbody.appendChild(wrow);

    for (let i = 1; i <= mAlt; i++) {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td><strong>Alternative $A_{${i}}$</strong></td>`;
        for (let j = 0; j < nCrit; j++) {
            tr.innerHTML += `<td><input type="number" step="1" value="${(20 + Math.random()*80).toFixed(1)}" class="topsis-cell" data-r="${i-1}" data-c="${j}"></td>`;
        }
        tbody.appendChild(tr);
    }
    table.appendChild(tbody);
}

function fillRandomData() {
    const inputs = document.querySelectorAll('.dss-matrix-table input[type="number"]');
    inputs.forEach(inp => {
        if (inp.classList.contains('matrix-input-ahp')) {
            const r = [1, 2, 3, 4, 5, 0.5, 0.33, 0.25];
            inp.value = r[Math.floor(Math.random() * r.length)];
            updateAHPSymmetric(inp);
        } else if (inp.classList.contains('topsis-cell')) {
            inp.value = (10 + Math.random() * 90).toFixed(1);
        } else {
            inp.value = (Math.random()).toFixed(2);
        }
    });
}

function executeAlgorithm() {
    const meta = ALGO_REGISTRY[currentAlgoKey] || ALGO_REGISTRY["sMBR01"];

    if (meta.status === "upcoming") {
        alert("This module is cataloged for upcoming release.");
        return;
    }

    if (meta.mode === "pairwise") {
        solveAHP();
    } else if (meta.mode === "topsis") {
        solveTOPSIS();
    } else {
        solveSDM();
    }
}

function solveSDM() {
    const mAlt = parseInt(document.getElementById('hub-num-alt').value, 10);
    const nCrit = parseInt(document.getElementById('hub-num-crit').value, 10);
    const m = mAlt + 1;
    const n = nCrit;

    const a = Array.from({ length: m }, () => Array(n).fill(0));
    document.querySelectorAll('.fpfs-cell').forEach(inp => {
        const r = parseInt(inp.dataset.r, 10);
        const c = parseInt(inp.dataset.c, 10);
        a[r][c] = parseFloat(inp.value) || 0;
    });

    if (currentAlgoKey === "PEM") {
        const s = Array(m - 1).fill(0);
        for (let i = 1; i < m; i++) {
            for (let j = 0; j < n; j++) {
                let colSum = 0;
                for (let k = 1; k < m; k++) colSum += a[k][j];
                const prevalence = colSum > 0 ? (a[i][j] / colSum) : 0;
                s[i - 1] += a[0][j] * prevalence;
            }
        }
        const maxS = Math.max(...s);
        const minS = Math.min(...s);
        const dm = s.map(val => (maxS === minS) ? 1 : (val - minS) / (maxS - minS));
        const maxVal = Math.max(...dm);
        const bestIdx = dm.indexOf(maxVal) + 1;

        renderResults({
            winner: `Alternative $u_{${bestIdx}}$ (PEM Score = ${maxVal.toFixed(4)})`,
            theads: ["Rank", "Alternative", "Prevalence Score ($s$)", "Normalized Decision ($dm$)", "Status"],
            rows: dm.map((val, idx) => ({
                name: `Alternative $u_{${idx + 1}}$`,
                col1: s[idx].toFixed(4),
                col2: val.toFixed(4),
                isBest: (idx + 1) === bestIdx,
                scoreSort: val
            }))
        });
    } else {
        const s = Array(m - 1).fill(0);
        for (let i = 1; i < m; i++) {
            for (let k = 1; k < m; k++) {
                for (let j = 0; j < n; j++) {
                    const diff = a[i][j] - a[k][j];
                    const sign = diff > 0 ? 1 : (diff < 0 ? -1 : 0);
                    s[i - 1] += a[0][j] * sign;
                }
            }
        }
        const maxS = Math.max(...s);
        const minS = Math.min(...s);
        const dm = Array(m - 1).fill(0);
        for (let i = 0; i < m - 1; i++) {
            dm[i] = (maxS === 0 && minS === 0) ? 1 : (s[i] + Math.abs(minS)) / (maxS + Math.abs(minS));
        }
        const maxVal = Math.max(...dm);
        const bestIdx = dm.indexOf(maxVal) + 1;

        renderResults({
            winner: `Alternative $u_{${bestIdx}}$ (Decision Value = ${maxVal.toFixed(4)})`,
            theads: ["Rank", "Alternative", "Raw Score ($s$)", "Normalized Decision ($dm$)", "Status"],
            rows: dm.map((val, idx) => ({
                name: `Alternative $u_{${idx + 1}}$`,
                col1: s[idx].toFixed(4),
                col2: val.toFixed(4),
                isBest: (idx + 1) === bestIdx,
                scoreSort: val
            }))
        });
    }
}

function solveAHP() {
    const n = parseInt(document.getElementById('hub-num-crit').value, 10);
    const A = Array.from({ length: n }, () => Array(n).fill(1));

    document.querySelectorAll('.matrix-input-ahp').forEach(inp => {
        const i = parseInt(inp.dataset.i, 10) - 1;
        const j = parseInt(inp.dataset.j, 10) - 1;
        const val = parseFloat(inp.value) || 1.0;
        A[i][j] = val;
        A[j][i] = 1.0 / val;
    });

    const colSums = Array(n).fill(0);
    for (let j = 0; j < n; j++) {
        for (let i = 0; i < n; i++) colSums[j] += A[i][j];
    }

    const weights = Array(n).fill(0);
    for (let i = 0; i < n; i++) {
        let sumRowNorm = 0;
        for (let j = 0; j < n; j++) sumRowNorm += A[i][j] / colSums[j];
        weights[i] = sumRowNorm / n;
    }

    let lambdaMax = 0;
    for (let i = 0; i < n; i++) {
        let dot = 0;
        for (let j = 0; j < n; j++) dot += A[i][j] * weights[j];
        lambdaMax += dot / weights[i];
    }
    lambdaMax /= n;

    const RI = [0, 0, 0.58, 0.90, 1.12, 1.24, 1.32, 1.41, 1.45, 1.49][n - 1] || 1.5;
    const CI = (lambdaMax - n) / (n - 1 > 0 ? n - 1 : 1);
    const CR = RI > 0 ? (CI / RI) : 0;

    const maxW = Math.max(...weights);
    const bestIdx = weights.indexOf(maxW) + 1;

    renderResults({
        winner: `Criterion $C_{${bestIdx}}$ (Weight = ${maxW.toFixed(4)}) &bull; $CR = ${CR.toFixed(4)}$ ${CR < 0.1 ? '<span style="color:#059669; font-weight:700;">(Consistent)</span>' : '<span style="color:#dc2626; font-weight:700;">(Inconsistent &gt; 0.10)</span>'}`,
        theads: ["Rank", "Criterion", "Priority Weight ($w$)", "Percentage", "Status"],
        rows: weights.map((w, idx) => ({
            name: `Criterion $C_{${idx + 1}}$`,
            col1: w.toFixed(4),
            col2: (w * 100).toFixed(2) + "%",
            isBest: (idx + 1) === bestIdx,
            scoreSort: w
        }))
    });
}

function solveTOPSIS() {
    const mAlt = parseInt(document.getElementById('hub-num-alt').value, 10);
    const nCrit = parseInt(document.getElementById('hub-num-crit').value, 10);

    const X = Array.from({ length: mAlt }, () => Array(nCrit).fill(0));
    document.querySelectorAll('.topsis-cell').forEach(inp => {
        const r = parseInt(inp.dataset.r, 10);
        const c = parseInt(inp.dataset.c, 10);
        X[r][c] = parseFloat(inp.value) || 0;
    });

    const W = [];
    document.querySelectorAll('.topsis-weight').forEach(inp => {
        W.push(parseFloat(inp.value) || (1 / nCrit));
    });

    const norm = Array.from({ length: mAlt }, () => Array(nCrit).fill(0));
    for (let j = 0; j < nCrit; j++) {
        let sqSum = 0;
        for (let i = 0; i < mAlt; i++) sqSum += X[i][j] * X[i][j];
        const denom = Math.sqrt(sqSum) || 1;
        for (let i = 0; i < mAlt; i++) norm[i][j] = (X[i][j] / denom) * W[j];
    }

    const PIS = [];
    const NIS = [];
    for (let j = 0; j < nCrit; j++) {
        let col = norm.map(r => r[j]);
        PIS.push(Math.max(...col));
        NIS.push(Math.min(...col));
    }

    const C = [];
    for (let i = 0; i < mAlt; i++) {
        let dPlus = 0;
        let dMinus = 0;
        for (let j = 0; j < nCrit; j++) {
            dPlus += Math.pow(norm[i][j] - PIS[j], 2);
            dMinus += Math.pow(norm[i][j] - NIS[j], 2);
        }
        dPlus = Math.sqrt(dPlus);
        dMinus = Math.sqrt(dMinus);
        const ci = (dMinus + dPlus === 0) ? 0 : (dMinus / (dPlus + dMinus));
        C.push(ci);
    }

    const maxC = Math.max(...C);
    const bestIdx = C.indexOf(maxC) + 1;

    renderResults({
        winner: `Alternative $A_{${bestIdx}}$ (Closeness = ${maxC.toFixed(4)})`,
        theads: ["Rank", "Alternative", "Relative Closeness ($C_i$)", "Proximity Ratio", "Decision"],
        rows: C.map((val, idx) => ({
            name: `Alternative $A_{${idx + 1}}$`,
            col1: val.toFixed(4),
            col2: (val * 100).toFixed(1) + "%",
            isBest: (idx + 1) === bestIdx,
            scoreSort: val
        }))
    });
}

function renderResults({ winner, theads, rows }) {
    const panel = document.getElementById('hub-results-panel');
    const winnerEl = document.getElementById('hub-winner-name');
    const theadEl = document.getElementById('results-thead');
    const tbodyEl = document.getElementById('results-tbody');

    panel.style.display = 'block';
    winnerEl.innerHTML = winner;

    theadEl.innerHTML = `<tr>${theads.map(t => `<th>${t}</th>`).join('')}</tr>`;
    rows.sort((a, b) => b.scoreSort - a.scoreSort);

    tbodyEl.innerHTML = '';
    rows.forEach((row, idx) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>#${idx + 1}</strong></td>
            <td>${row.name}</td>
            <td><code>${row.col1}</code></td>
            <td><code>${row.col2}</code></td>
            <td>${row.isBest ? '<span class="status-pill status-ongoing">Optimal</span>' : '<span class="status-pill status-completed">Evaluated</span>'}</td>
        `;
        tbodyEl.appendChild(tr);
    });

    renderMathScoped(panel);
    panel.scrollIntoView({ behavior: 'smooth' });
}

function copyCitation() {
    const meta = ALGO_REGISTRY[currentAlgoKey] || ALGO_REGISTRY["sMBR01"];
    const bib = meta.bibtex || `@misc{decisionhub2026, title={Decision Hub Platform}, author={Memi{\\c{s}}, Samet}, year={2026}}`;
    navigator.clipboard.writeText(bib).then(() => {
        alert("BibTeX citation copied to clipboard!");
    });
}

document.addEventListener('DOMContentLoaded', () => {
    syncUIWithAlgo();
});