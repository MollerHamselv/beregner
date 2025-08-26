// Initialize EmailJS with your User ID
(function() {
    emailjs.init('WxsFcH0Ah_J79S9tO'); // Replace with your actual EmailJS user ID
})();

// Elementer
const employeesInput = document.getElementById('employees');
const avgSalaryInput = document.getElementById('avgSalary');
const stressPercentInput = document.getElementById('stressPercent');
const stressPercentValue = document.getElementById('stressPercentValue');
const absentDaysInput = document.getElementById('absentDays');
const absentDaysValue = document.getElementById('absentDaysValue');
const productivityLossInput = document.getElementById('productivityLoss');
const productivityLossValue = document.getElementById('productivityLossValue');
const calculateBtn = document.getElementById('calculateBtn');

// Resultat elementer
const absentCostElement = document.getElementById('absentCost');
const productivityCostElement = document.getElementById('productivityCost');
const turnoverCostElement = document.getElementById('turnoverCost');
const totalCostElement = document.getElementById('totalCost');
const stressedEmployeesElement = document.getElementById('stressedEmployees');
const totalEmployeesElement = document.getElementById('totalEmployees');
const costPerEmployeeElement = document.getElementById('costPerEmployee');

// Graf elementer
const absentBar = document.getElementById('absentBar');
const productivityBar = document.getElementById('productivityBar');
const turnoverBar = document.getElementById('turnoverBar');
const absentBarValue = document.getElementById('absentBarValue');
const productivityBarValue = document.getElementById('productivityBarValue');
const turnoverBarValue = document.getElementById('turnoverBarValue');
const yMaxLabel = document.getElementById('y-max');
const yAxisLabels = document.querySelectorAll('.chart-y-axis-label');

// Forbedret scenarie elementer
const improvementPercentInput = document.getElementById('improvementPercent');
const improvementPercentValue = document.getElementById('improvementPercentValue');
const programCostInput = document.getElementById('programCost');
const currentTotalForCompare = document.getElementById('currentTotalForCompare');
const improvedTotalCostEl = document.getElementById('improvedTotalCost');
const savingsAmountEl = document.getElementById('savingsAmount');
const roiValueEl = document.getElementById('roiValue');

// Tabel elementer
const tableAbsentCost = document.getElementById('tableAbsentCost');
const tableProductivityCost = document.getElementById('tableProductivityCost');
const tableTurnoverCost = document.getElementById('tableTurnoverCost');
const tableTotalCost = document.getElementById('tableTotalCost');
const tableAbsentPercent = document.getElementById('tableAbsentPercent');
const tableProductivityPercent = document.getElementById('tableProductivityPercent');
const tableTurnoverPercent = document.getElementById('tableTurnoverPercent');

// Modal elementer
const modalTotalCost = document.getElementById('modalTotalCost');
const modalStressedEmployees = document.getElementById('modalStressedEmployees');
const modalCostPerEmployee = document.getElementById('modalCostPerEmployee');

// Form hidden fields
const formTotalCost = document.getElementById('formTotalCost');
const formStressedEmployees = document.getElementById('formStressedEmployees');
const formCostPerEmployee = document.getElementById('formCostPerEmployee');
const formAbsentCost = document.getElementById('formAbsentCost');
const formProductivityCost = document.getElementById('formProductivityCost');
const formTurnoverCost = document.getElementById('formTurnoverCost');

// Tab navigation
const chartTab = document.getElementById('chartTab');
const tableTab = document.getElementById('tableTab');
const chartView = document.getElementById('chartView');
const tableView = document.getElementById('tableView');

// CTA og Modal
const ctaButton = document.getElementById('ctaButton');
const ctaModal = document.getElementById('ctaModal');
const closeModal = document.getElementById('closeModal');

// Kontaktformular
const contactFormContainer = document.getElementById('contactFormContainer');
const contactForm = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const formSuccess = document.getElementById('formSuccess');

// Export buttons
const exportCsvBtn = document.getElementById('exportCsvBtn');
const exportPdfBtn = document.getElementById('exportPdfBtn');

// Global Currency selector
const globalCurrencySelect = document.getElementById('globalCurrencySelect');
let currentLocale = 'da-DK';
let currentCurrency = 'DKK';

// Modal funktionalitet
ctaButton.addEventListener('click', () => {
    ctaModal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Forhindrer scrolling af baggrunden
    
    // Opdater modal med de aktuelle beregninger
    updateModalValues();
});

closeModal.addEventListener('click', () => {
    ctaModal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Genaktiverer scrolling
});

window.addEventListener('click', (event) => {
    if (event.target === ctaModal) {
        ctaModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Opdater modal værdier med aktuelle beregninger
function updateModalValues() {
    modalTotalCost.textContent = totalCostElement.textContent;
    modalStressedEmployees.textContent = stressedEmployeesElement.textContent;
    modalCostPerEmployee.textContent = costPerEmployeeElement.textContent;
    
    // Opdater skjulte formularfelter
    formTotalCost.value = totalCostElement.textContent;
    formStressedEmployees.value = stressedEmployeesElement.textContent;
    formCostPerEmployee.value = costPerEmployeeElement.textContent;
    formAbsentCost.value = absentCostElement.textContent;
    formProductivityCost.value = productivityCostElement.textContent;
    formTurnoverCost.value = turnoverCostElement.textContent;
}

chartTab.addEventListener('click', () => {
    chartTab.classList.add('active');
    tableTab.classList.remove('active');
    chartView.classList.remove('hidden');
    tableView.classList.add('hidden');
});

tableTab.addEventListener('click', () => {
    tableTab.classList.add('active');
    chartTab.classList.remove('active');
    tableView.classList.remove('hidden');
    chartView.classList.add('hidden');
});

// Validation helpers
const employeesError = document.getElementById('employeesError');
const avgSalaryError = document.getElementById('avgSalaryError');

function clamp(value, min, max) {
    const numeric = Number(value);
    if (Number.isNaN(numeric)) return min;
    return Math.min(Math.max(numeric, min), max);
}

// -------- Export: CSV & PDF --------
function getCurrentExportData() {
    return {
        employees: employeesInput.value,
        avgSalary: avgSalaryInput.value,
        stressPercent: stressPercentInput.value,
        absentDays: absentDaysInput.value,
        productivityLoss: productivityLossInput.value,
        improvementPercent: improvementPercentInput ? improvementPercentInput.value : '',
        programCost: programCostInput ? programCostInput.value : '',
        absentCost: absentCostElement.textContent,
        productivityCost: productivityCostElement.textContent,
        turnoverCost: turnoverCostElement.textContent,
        totalCost: totalCostElement.textContent,
        stressedEmployees: stressedEmployeesElement.textContent,
        costPerEmployee: costPerEmployeeElement.textContent,
        improvedTotal: improvedTotalCostEl ? improvedTotalCostEl.textContent : '',
        savingsAmount: savingsAmountEl ? savingsAmountEl.textContent : '',
        roiValue: roiValueEl ? roiValueEl.textContent : ''
    };
}

function downloadBlob(content, filename, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}

function exportCSV() {
    const d = getCurrentExportData();
    const headers = [
        'Felt','Værdi'
    ];
    const rows = [
        ['Antal medarbejdere', d.employees],
        ['Gennemsnitlig månedsløn (DKK)', d.avgSalary],
        ['Andel stressramte (%)', d.stressPercent],
        ['Sygedage pr. stressramt', d.absentDays],
        ['Produktivitetstab (%)', d.productivityLoss],
        ['Sygefravær (kr.)', d.absentCost],
        ['Produktivitetstab (kr.)', d.productivityCost],
        ['Udskiftning (kr.)', d.turnoverCost],
        ['Samlede omkostninger (kr.)', d.totalCost],
        ['Stressramte medarbejdere', d.stressedEmployees],
        ['Omkostning pr. stressramt (kr.)', d.costPerEmployee]
    ];
    const csv = [headers.join(','), ...rows.map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(','))].join('\n');
    const timestamp = new Date().toISOString().slice(0,19).replace(/[:T]/g,'-');
    downloadBlob(csv, `stress-beregning-${timestamp}.csv`, 'text/csv;charset=utf-8;');
}

async function exportPDF() {
    const d = getCurrentExportData();
    const { jsPDF } = window.jspdf || {};
    if (!jsPDF || !window.jspdf || !('autoTable' in (window.jspdf.jsPDF || {}))) {
        // Try proceed even if typings check fails (plugin augments prototype)
    }
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 40;
    let cursorY = margin;

    // Header banner
    doc.setFillColor(44, 124, 99); // primary-500
    doc.rect(0, 0, pageWidth, 64, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.text('Medica Pro – Stressomkostningsrapport', margin, 40);

    // Subheader with date
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    const dateStr = new Date().toLocaleString('da-DK');
    doc.text(`Genereret: ${dateStr}`, margin, 58);

    // Reset color for body
    doc.setTextColor(33, 37, 41);
    cursorY = 80;

    // Summary card
    const cardTop = cursorY;
    const cardHeight = 72;
    doc.setDrawColor(226, 232, 240);
    doc.setFillColor(249, 250, 251);
    doc.roundedRect(margin, cardTop, pageWidth - margin * 2, cardHeight, 8, 8, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Sammenfatning', margin + 12, cardTop + 22);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.text(`Samlede omkostninger: ${d.totalCost}`, margin + 12, cardTop + 42);
    doc.text(`Stressramte medarbejdere: ${d.stressedEmployees}    Omkostning pr. stressramt: ${d.costPerEmployee}`, margin + 12, cardTop + 60);
    cursorY += cardHeight + 16;

    // Inputs table
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text('Inddata', margin, cursorY);
    doc.autoTable({
        startY: cursorY + 8,
        head: [['Felt', 'Værdi']],
        body: [
            ['Antal medarbejdere', d.employees],
            ['Gennemsnitlig månedsløn (DKK)', d.avgSalary],
            ['Andel stressramte (%)', d.stressPercent],
            ['Sygedage pr. stressramt', d.absentDays],
            ['Produktivitetstab (%)', d.productivityLoss],
            ['Forbedring (%)', d.improvementPercent],
            ['Programomkostning (DKK)', d.programCost]
        ],
        styles: { font: 'helvetica', fontSize: 10, cellPadding: 6 },
        headStyles: { fillColor: [44,124,99], textColor: 255, fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [247, 250, 252] },
        tableWidth: pageWidth - margin * 2,
        margin: { left: margin, right: margin }
    });

    // Results table
    const afterInputsY = doc.lastAutoTable.finalY + 20;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text('Resultater', margin, afterInputsY);
    doc.autoTable({
        startY: afterInputsY + 8,
        head: [['Kategori', 'Beløb']],
        body: [
            ['Sygefravær (kr.)', d.absentCost],
            ['Produktivitetstab (kr.)', d.productivityCost],
            ['Udskiftning (kr.)', d.turnoverCost],
            ['Samlede omkostninger (kr.)', d.totalCost],
            ['Omkostning pr. stressramt (kr.)', d.costPerEmployee],
            ['Besparelse (kr.)', d.savingsAmount || ''],
            ['Total (forbedret, kr.)', d.improvedTotal || ''],
            ['ROI', d.roiValue || '']
        ],
        styles: { font: 'helvetica', fontSize: 10, cellPadding: 6 },
        headStyles: { fillColor: [44,124,99], textColor: 255, fontStyle: 'bold' },
        bodyStyles: { },
        willDrawCell: data => {
            if (data.row && data.row.index === 3) { // total row emphasis
                doc.setFont('helvetica', 'bold');
            }
        },
        alternateRowStyles: { fillColor: [247, 250, 252] },
        tableWidth: pageWidth - margin * 2,
        margin: { left: margin, right: margin }
    });

    // Footer
    const footerY = doc.internal.pageSize.getHeight() - 24;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(107, 114, 128);
    doc.text('Beregnet af Medica Pro\'s stressomkostningsværktøj', margin, footerY);

    const timestamp = new Date().toISOString().slice(0,19).replace(/[:T]/g,'-');
    doc.save(`stress-beregning-${timestamp}.pdf`);
}

if (exportCsvBtn) exportCsvBtn.addEventListener('click', exportCSV);
if (exportPdfBtn) exportPdfBtn.addEventListener('click', exportPDF);

function setError(el, msg) {
    if (!el) return;
    el.textContent = msg;
    el.classList.remove('hidden');
}

function clearError(el) {
    if (!el) return;
    el.textContent = '';
    el.classList.add('hidden');
}

function validateAndClampNumber(inputEl, { min, max, step = 1 }, errorEl, label) {
    const raw = inputEl.value;
    if (raw === '' || isNaN(Number(raw))) {
        setError(errorEl, `${label} skal være et tal.`);
        inputEl.value = min;
        return;
    }
    const clamped = clamp(Number(raw), min, max);
    if (clamped !== Number(raw)) {
        setError(errorEl, `${label} er justeret til ${clamped}.`);
    } else {
        clearError(errorEl);
    }
    // Align to step if needed
    const stepped = Math.round(clamped / step) * step;
    inputEl.value = stepped;
}

let rAFHandle = null;
function scheduleCalculate() {
    if (rAFHandle !== null) cancelAnimationFrame(rAFHandle);
    rAFHandle = requestAnimationFrame(() => {
        rAFHandle = null;
        calculateCosts();
    });
}

// Opdater værdier når sliders ændres (instant recalc)
stressPercentInput.addEventListener('input', () => {
    // slider inherent limits ensure 0-50
    stressPercentValue.textContent = `${stressPercentInput.value}%`;
    scheduleCalculate();
});

absentDaysInput.addEventListener('input', () => {
    absentDaysValue.textContent = `${absentDaysInput.value} dage`;
    scheduleCalculate();
});

productivityLossInput.addEventListener('input', () => {
    // Fix: force instant UI + calculation sync
    productivityLossValue.textContent = `${productivityLossInput.value}%`;
    scheduleCalculate();
});

if (improvementPercentInput) {
    improvementPercentInput.addEventListener('input', () => {
        improvementPercentValue.textContent = `${improvementPercentInput.value}%`;
        scheduleCalculate();
        saveState();
    });
}
if (programCostInput) {
    programCostInput.addEventListener('change', () => {
        scheduleCalculate();
        saveState();
    });
}

// Beregn omkostninger
calculateBtn.addEventListener('click', calculateCosts);

// Beregn omkostninger ved indlæsning + load state
document.addEventListener('DOMContentLoaded', () => {
    updateInputLabels();
    updateProgramLabel();
    loadState();
    calculateCosts();
});

// Beregn omkostninger når input ændres (med en lille forsinkelse)
const inputElements = [employeesInput, avgSalaryInput, programCostInput].filter(Boolean);
inputElements.forEach(element => {
    element.addEventListener('input', debounce(() => { calculateCosts(); saveState(); }, 500));
});

// Immediate validation on blur/change for numeric inputs
employeesInput.addEventListener('change', () => {
    validateAndClampNumber(employeesInput, { min: 1, max: 100000, step: 1 }, employeesError, 'Antal medarbejdere');
    calculateCosts();
    saveState();
});
avgSalaryInput.addEventListener('change', () => {
    validateAndClampNumber(avgSalaryInput, { min: 0, max: 200000, step: 1 }, avgSalaryError, 'Gennemsnitlig månedsløn');
    calculateCosts();
    saveState();
});

// Håndter kontaktformular med EmailJS
contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Vis loading-indikator
    submitBtn.disabled = true;
    submitBtn.classList.add('opacity-75');
    submitBtn.innerHTML = 'Sender...';
    
    // Send email via EmailJS
    emailjs.sendForm('service_vqez58l', 'template_d4qaffp', this)
        .then(function() {
            // Success
            contactFormContainer.style.display = 'none';
            formSuccess.classList.remove('hidden');
        }, function(error) {
            // Error
            alert('Der opstod en fejl ved afsendelse: ' + JSON.stringify(error));
        })
        .finally(function() {
            // Nulstil knappen
            submitBtn.disabled = false;
            submitBtn.classList.remove('opacity-75');
            submitBtn.innerHTML = 'Send forespørgsel';
        });
});

// Debounce funktion for at undgå for mange beregninger
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(context, args);
        }, wait);
    };
}

// State persistence (URL params + localStorage)
const STATE_KEYS = ['employees','avgSalary','stressPercent','absentDays','productivityLoss','improvementPercent','programCost','locale'];

function saveState() {
    const state = {
        employees: String(employeesInput.value || ''),
        avgSalary: String(avgSalaryInput.value || ''),
        stressPercent: String(stressPercentInput.value || ''),
        absentDays: String(absentDaysInput.value || ''),
        productivityLoss: String(productivityLossInput.value || ''),
        improvementPercent: String(improvementPercentInput ? improvementPercentInput.value : ''),
        programCost: String(programCostInput ? programCostInput.value : ''),
        locale: String(currentLocale + ',' + currentCurrency)
    };
    try {
        localStorage.setItem('calculatorState', JSON.stringify(state));
    } catch {}

    const url = new URL(window.location.href);
    STATE_KEYS.forEach(k => {
        if (state[k] !== '') {
            url.searchParams.set(k, state[k]);
        } else {
            url.searchParams.delete(k);
        }
    });
    history.replaceState(null, '', url.toString());
}

function loadState() {
    let loaded = {};
    try {
        const fromStorage = localStorage.getItem('calculatorState');
        if (fromStorage) loaded = JSON.parse(fromStorage) || {};
    } catch {}

    const params = new URLSearchParams(window.location.search);
    STATE_KEYS.forEach(k => {
        if (params.has(k)) {
            loaded[k] = params.get(k);
        }
    });

    if (loaded.employees) employeesInput.value = loaded.employees;
    if (loaded.avgSalary) avgSalaryInput.value = loaded.avgSalary;
    if (loaded.stressPercent) stressPercentInput.value = loaded.stressPercent;
    if (loaded.absentDays) absentDaysInput.value = loaded.absentDays;
    if (loaded.productivityLoss) productivityLossInput.value = loaded.productivityLoss;
    if (loaded.improvementPercent && improvementPercentInput) improvementPercentInput.value = loaded.improvementPercent;
    if (loaded.programCost && programCostInput) programCostInput.value = loaded.programCost;
    
    // Load locale/currency selection
    if (loaded.locale && globalCurrencySelect) {
        const [locale, currency] = loaded.locale.split(',');
        currentLocale = locale || 'da-DK';
        currentCurrency = currency || 'DKK';
        globalCurrencySelect.value = loaded.locale;
    }

    // Sync slider labels
    stressPercentValue.textContent = `${stressPercentInput.value}%`;
    absentDaysValue.textContent = `${absentDaysInput.value} dage`;
    productivityLossValue.textContent = `${productivityLossInput.value}%`;
    if (improvementPercentInput) improvementPercentValue.textContent = `${improvementPercentInput.value}%`;
}

function calculateCosts() {
    // Tilføj animation til beregningsknappen
    calculateBtn.classList.add('animate-pulse');
    setTimeout(() => {
        calculateBtn.classList.remove('animate-pulse');
    }, 500);
    
    // Hent input værdier
    const employees = parseInt(employeesInput.value) || 0;
    const avgSalary = parseInt(avgSalaryInput.value) || 0;
    const stressPercent = parseInt(stressPercentInput.value) || 0;
    const absentDays = parseInt(absentDaysInput.value) || 0;
    const productivityLoss = parseInt(productivityLossInput.value) || 0;
    
    // Beregn antal stressramte medarbejdere
    const stressedEmployees = Math.round(employees * (stressPercent / 100));
    
    // Beregn daglig løn (antager 22 arbejdsdage pr. måned)
    const dailySalary = avgSalary / 22;
    
    // Beregn omkostninger ved sygefravær
    const absentCost = stressedEmployees * absentDays * dailySalary;
    
    // Beregn produktivitetstab (antager 220 arbejdsdage årligt)
    const workingDays = 220 - absentDays;
    const productivityCost = stressedEmployees * workingDays * dailySalary * (productivityLoss / 100);
    
    // Beregn omkostninger ved udskiftning af personale (antager 10% af stressramte forlader virksomheden)
    // og at det koster 6 måneders løn at erstatte en medarbejder
    const turnoverRate = 0.1;
    const replacementCost = 6 * avgSalary;
    const turnoverCost = stressedEmployees * turnoverRate * replacementCost;
    
    // Beregn samlede omkostninger
    const totalCost = absentCost + productivityCost + turnoverCost;
    
    // Beregn omkostning pr. stressramt medarbejder
    const costPerEmployee = stressedEmployees > 0 ? totalCost / stressedEmployees : 0;
    
    // Opdater resultater med formaterede tal
    absentCostElement.textContent = formatCurrency(absentCost);
    productivityCostElement.textContent = formatCurrency(productivityCost);
    turnoverCostElement.textContent = formatCurrency(turnoverCost);
    totalCostElement.textContent = formatCurrency(totalCost);
    stressedEmployeesElement.textContent = stressedEmployees;
    totalEmployeesElement.textContent = employees;
    costPerEmployeeElement.textContent = formatCurrency(costPerEmployee);

    // Forbedret scenarie beregning
    const improvementPercent = improvementPercentInput ? (parseInt(improvementPercentInput.value) || 0) : 0;
    const programCost = programCostInput ? (parseInt(programCostInput.value) || 0) : 0;
    const reductionFactor = Math.max(0, Math.min(100, improvementPercent)) / 100;
    const savings = totalCost * reductionFactor;
    const improvedTotal = Math.max(0, totalCost - savings + programCost);
    const roi = programCost > 0 ? (savings / programCost) : 0;

    if (currentTotalForCompare) currentTotalForCompare.textContent = formatCurrency(totalCost);
    if (improvedTotalCostEl) improvedTotalCostEl.textContent = formatCurrency(improvedTotal);
    if (savingsAmountEl) savingsAmountEl.textContent = formatCurrency(savings);
    if (roiValueEl) roiValueEl.textContent = `${(roi * 100).toFixed(0)}%`;
    
    // Opdater Y-akse værdier
    const maxValue = Math.max(absentCost, productivityCost, turnoverCost, 1000); // Minimum 1000 for at undgå tomme grafer
    
    // Afrund maxValue til et pænt tal for y-aksen
    const roundedMax = roundToNiceNumber(maxValue);
    
    // Opdater y-akse labels
    yMaxLabel.textContent = formatCurrency(roundedMax);
    yAxisLabels[1].textContent = formatCurrency(roundedMax * 0.75);
    yAxisLabels[2].textContent = formatCurrency(roundedMax * 0.5);
    yAxisLabels[3].textContent = formatCurrency(roundedMax * 0.25);
    yAxisLabels[4].textContent = formatCurrency(0);
    
    // Opdater søjlehøjder i forhold til den afrundede maksværdi
    absentBar.style.height = `${(absentCost / roundedMax) * 100}%`;
    productivityBar.style.height = `${(productivityCost / roundedMax) * 100}%`;
    turnoverBar.style.height = `${(turnoverCost / roundedMax) * 100}%`;
    
    // Opdater værdier under søjlerne
    absentBarValue.textContent = formatCurrency(absentCost);
    productivityBarValue.textContent = formatCurrency(productivityCost);
    turnoverBarValue.textContent = formatCurrency(turnoverCost);
    
    // Opdater tabel
    tableAbsentCost.textContent = formatCurrency(absentCost);
    tableProductivityCost.textContent = formatCurrency(productivityCost);
    tableTurnoverCost.textContent = formatCurrency(turnoverCost);
    tableTotalCost.textContent = formatCurrency(totalCost);
    
    // Beregn procentdele til tabellen
    if (totalCost > 0) {
        tableAbsentPercent.textContent = `${Math.round((absentCost / totalCost) * 100)}%`;
        tableProductivityPercent.textContent = `${Math.round((productivityCost / totalCost) * 100)}%`;
        tableTurnoverPercent.textContent = `${Math.round((turnoverCost / totalCost) * 100)}%`;
    } else {
        tableAbsentPercent.textContent = '0%';
        tableProductivityPercent.textContent = '0%';
        tableTurnoverPercent.textContent = '0%';
    }
    
    // Opdater modal værdier hvis modalen er åben
    if (ctaModal.style.display === 'block') {
        updateModalValues();
    }
}

// Afrund til et pænt tal for y-aksen
function roundToNiceNumber(value) {
    const exponent = Math.floor(Math.log10(value));
    const fraction = value / Math.pow(10, exponent);
    let niceFraction;
    
    if (fraction <= 1.5) {
        niceFraction = 1.5;
    } else if (fraction <= 2) {
        niceFraction = 2;
    } else if (fraction <= 2.5) {
        niceFraction = 2.5;
    } else if (fraction <= 5) {
        niceFraction = 5;
    } else {
        niceFraction = 10;
    }
    
    return niceFraction * Math.pow(10, exponent);
}

// Formater tal som valuta
function formatCurrency(amount) {
    return new Intl.NumberFormat(currentLocale, {
        style: 'currency',
        currency: currentCurrency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(Math.round(amount));
}

if (globalCurrencySelect) {
    globalCurrencySelect.addEventListener('change', () => {
        const val = globalCurrencySelect.value || 'da-DK,DKK';
        const parts = val.split(',');
        currentLocale = parts[0] || 'da-DK';
        currentCurrency = parts[1] || 'DKK';
        calculateCosts();
        saveState();
    });
}
