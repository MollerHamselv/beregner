// Initialize EmailJS with your User ID
(function() {
    emailjs.init('WxsFcH0Ah_J79S9tO'); // Replace with your actual EmailJS user ID
})();

// Initialize page load time for tracking
let pageLoadTime = Date.now();

// Cookie Consent Management
const cookieConsent = {
    translations: {
        en: {
            title: "Privacy & Analytics",
            message: "This site uses analytics to improve performance and user experience. We collect anonymous usage data to help optimize our stress cost calculator. No personal data is shared with third parties.",
            accept: "Accept & Continue",
            decline: "Decline",
            language: "Language:"
        },
        da: {
            title: "Privatliv & Analyse",
            message: "Denne side bruger analyse for at forbedre ydeevne og brugeroplevelse. Vi indsamler anonyme brugsdata for at hjælpe med at optimere vores stress-omkostningsberegner. Ingen personlige data deles med tredjeparter.",
            accept: "Accepter & Fortsæt",
            decline: "Afvis",
            language: "Sprog:"
        },
        de: {
            title: "Datenschutz & Analyse",
            message: "Diese Website verwendet Analysen zur Verbesserung der Leistung und Benutzererfahrung. Wir sammeln anonyme Nutzungsdaten, um unseren Stress-Kostenrechner zu optimieren. Keine persönlichen Daten werden an Dritte weitergegeben.",
            accept: "Akzeptieren & Fortfahren",
            decline: "Ablehnen",
            language: "Sprache:"
        },
        fr: {
            title: "Confidentialité & Analyse",
            message: "Ce site utilise des analyses pour améliorer les performances et l'expérience utilisateur. Nous collectons des données d'utilisation anonymes pour optimiser notre calculateur de coûts de stress. Aucune donnée personnelle n'est partagée avec des tiers.",
            accept: "Accepter & Continuer",
            decline: "Refuser",
            language: "Langue:"
        },
        es: {
            title: "Privacidad & Análisis",
            message: "Este sitio utiliza análisis para mejorar el rendimiento y la experiencia del usuario. Recopilamos datos de uso anónimos para optimizar nuestra calculadora de costos de estrés. No se comparten datos personales con terceros.",
            accept: "Aceptar & Continuar",
            decline: "Rechazar",
            language: "Idioma:"
        }
    },

    init() {
        const consentGiven = localStorage.getItem('cookieConsent');
        const consentDeclined = localStorage.getItem('cookieDeclined');
        
        if (!consentGiven && !consentDeclined) {
            this.showPopup();
        } else if (consentDeclined === 'true') {
            this.disableTracking();
        }
        
        this.bindEvents();
    },

    showPopup() {
        const popup = document.getElementById('cookieConsent');
        if (popup) {
            popup.classList.remove('hidden');
            // Set default language based on current locale
            const currentLang = currentLocale?.split('-')[0] || 'en';
            const langSelect = document.getElementById('cookieLanguage');
            if (langSelect && this.translations[currentLang]) {
                langSelect.value = currentLang;
                this.updateLanguage(currentLang);
            }
        }
    },

    hidePopup() {
        const popup = document.getElementById('cookieConsent');
        if (popup) {
            popup.classList.add('hidden');
        }
    },

    updateLanguage(lang) {
        const translations = this.translations[lang] || this.translations.en;
        
        document.getElementById('cookieTitle').textContent = translations.title;
        document.getElementById('cookieMessage').textContent = translations.message;
        document.getElementById('acceptText').textContent = translations.accept;
        document.getElementById('declineText').textContent = translations.decline;
        document.getElementById('languageLabel').textContent = translations.language;
    },

    acceptCookies() {
        localStorage.setItem('cookieConsent', 'true');
        localStorage.removeItem('cookieDeclined');
        this.hidePopup();
        
        // Track consent acceptance
        trackEvent('cookie_consent_accepted', {
            timestamp: new Date().toISOString()
        });
    },

    declineCookies() {
        localStorage.setItem('cookieDeclined', 'true');
        localStorage.removeItem('cookieConsent');
        this.hidePopup();
        this.disableTracking();
    },

    disableTracking() {
        // Override tracking functions to do nothing
        window.trackEvent = () => {};
        window.trackPerformance = () => {};
        
        // You could also disable Vercel scripts here if needed
        console.log('Analytics tracking disabled by user choice');
    },

    bindEvents() {
        const acceptBtn = document.getElementById('acceptCookies');
        const declineBtn = document.getElementById('declineCookies');
        const languageSelect = document.getElementById('cookieLanguage');

        if (acceptBtn) {
            acceptBtn.addEventListener('click', () => this.acceptCookies());
        }

        if (declineBtn) {
            declineBtn.addEventListener('click', () => this.declineCookies());
        }

        if (languageSelect) {
            languageSelect.addEventListener('change', (e) => {
                this.updateLanguage(e.target.value);
            });
        }

        // Close on backdrop click
        const popup = document.getElementById('cookieConsent');
        if (popup) {
            popup.addEventListener('click', (e) => {
                if (e.target === popup) {
                    // Don't close on backdrop click for cookie consent
                    // this.declineCookies();
                }
            });
        }
    }
};

// Vercel Analytics helper function (enhanced with consent check)
function trackEvent(eventName, properties = {}) {
    // Check if user has declined cookies
    if (localStorage.getItem('cookieDeclined') === 'true') {
        return;
    }
    
    if (typeof window !== 'undefined' && window.va) {
        window.va('track', eventName, properties);
    } else if (typeof window !== 'undefined' && window.gtag) {
        // Fallback to gtag if va is not available
        window.gtag('event', eventName, properties);
    }
}

// Performance tracking helper (enhanced with consent check)
function trackPerformance(metricName, value, properties = {}) {
    // Check if user has declined cookies
    if (localStorage.getItem('cookieDeclined') === 'true') {
        return;
    }
    
    if (typeof window !== 'undefined' && window.va) {
        window.va('track', `performance_${metricName}`, {
            value: value,
            ...properties
        });
    }
}

// Elementer
const employeesInput = document.getElementById('employees');
const brancheInput = document.getElementById('branche');
const avgSalaryInput = document.getElementById('avgSalary');
const stressPercentInput = document.getElementById('stressPercent');
const stressPercentValue = document.getElementById('stressPercentValue');
const absentDaysInput = document.getElementById('absentDays');
const absentDaysValue = document.getElementById('absentDaysValue');
const productivityLossInput = document.getElementById('productivityLoss');
const productivityLossValue = document.getElementById('productivityLossValue');
const calculateBtn = document.getElementById('calculateBtn');
const calculateBtn2 = document.getElementById('calculateBtn2');

// Resultat elementer
const absentCostElement = document.getElementById('absentCost');
const productivityCostElement = document.getElementById('productivityCost');
const turnoverCostElement = document.getElementById('turnoverCost');
const totalCostElement = document.getElementById('totalCost');

// Graf elementer (fjernet fra hovedvisning, flyttet til modal)
const absentBar = null; // Removed from main view
const productivityBar = null; // Removed from main view
const turnoverBar = null; // Removed from main view
const absentBarValue = null; // Removed from main view
const productivityBarValue = null; // Removed from main view
const turnoverBarValue = null; // Removed from main view

// Modal chart elementer
const modalAbsentBar = document.getElementById('modalAbsentBar');
const modalProductivityBar = document.getElementById('modalProductivityBar');
const modalTurnoverBar = document.getElementById('modalTurnoverBar');
const modalAbsentBarValue = document.getElementById('modalAbsentBarValue');
const modalProductivityBarValue = document.getElementById('modalProductivityBarValue');
const modalTurnoverBarValue = document.getElementById('modalTurnoverBarValue');

// Modal y-axis labels
const modalYMaxLabel = document.getElementById('modal-y-max');
const modalY75Label = document.getElementById('modal-y-75');
const modalY50Label = document.getElementById('modal-y-50');
const modalY25Label = document.getElementById('modal-y-25');
const modalY0Label = document.getElementById('modal-y-0');

// Chart modal elements
const chartModal = document.getElementById('chartModal');
const openChartModalBtn = document.getElementById('openChartModal');
const closeChartModalBtn = document.getElementById('closeChartModal');

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

// Tab navigation (nu kun table tab)
const tableTab = document.getElementById('tableTab');
const tableView = document.getElementById('tableView');

// Export buttons (updated IDs)
const exportCsvBtn = document.getElementById('btnExportCsv');
const exportPdfBtn = document.getElementById('btnExportPdf');

// Global Currency selector
const globalCurrencySelect = document.getElementById('globalCurrencySelect');
let currentLocale = 'da-DK';
let currentCurrency = 'DKK';

// Chart modal event listeners
if (openChartModalBtn) {
    openChartModalBtn.addEventListener('click', () => {
        if (chartModal) {
            chartModal.classList.remove('hidden');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        }
    });
}

if (closeChartModalBtn) {
    closeChartModalBtn.addEventListener('click', () => {
        if (chartModal) {
            chartModal.classList.add('hidden');
            document.body.style.overflow = 'auto'; // Restore scrolling
        }
    });
}

// Close modal when clicking outside
if (chartModal) {
    chartModal.addEventListener('click', (e) => {
        if (e.target === chartModal) {
            chartModal.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }
    });
}

// Close modal with ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && chartModal && !chartModal.classList.contains('hidden')) {
        chartModal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }
});

// Remove old chart/table tab functionality (commented out)
// chartTab.addEventListener('click', () => {
//     chartTab.classList.add('active');
//     tableTab.classList.remove('active');
//     chartView.classList.remove('hidden');
//     tableView.classList.add('hidden');
// });

// tableTab.addEventListener('click', () => {
//     tableTab.classList.add('active');
//     chartTab.classList.remove('active');
//     tableView.classList.remove('hidden');
//     chartView.classList.add('hidden');
// });

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
    // Beregn værdier fra input-felterne
    const employees = parseInt(employeesInput.value) || 0;
    const stressPercent = parseInt(stressPercentInput.value) || 0;
    const stressedEmployees = Math.round(employees * (stressPercent / 100));
    const totalCostValue = parseInt(totalCostElement.textContent.replace(/[^\d]/g, '')) || 0;
    const costPerEmployee = stressedEmployees > 0 ? totalCostValue / stressedEmployees : 0;
    
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
        stressedEmployees: stressedEmployees.toString(),
        costPerEmployee: fmtMoney(costPerEmployee),
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

// Opdater kun UI værdier når sliders ændres (ingen automatisk beregning)
stressPercentInput.addEventListener('input', () => {
    stressPercentValue.textContent = `${stressPercentInput.value}%`;
    saveState();
});

absentDaysInput.addEventListener('input', () => {
    absentDaysValue.textContent = `${absentDaysInput.value} dage`;
    saveState();
});

productivityLossInput.addEventListener('input', () => {
    productivityLossValue.textContent = `${productivityLossInput.value}%`;
    saveState();
});

if (improvementPercentInput) {
    improvementPercentInput.addEventListener('input', () => {
        improvementPercentValue.textContent = `${improvementPercentInput.value}%`;
        saveState();
    });
}
if (programCostInput) {
    programCostInput.addEventListener('change', () => {
        saveState();
    });
}

// Beregn omkostninger
calculateBtn.addEventListener('click', () => {
    calculateCosts();
    
    // Send data to Google Sheets when user explicitly calculates
    const employees = parseInt(employeesInput.value) || 0;
    const stressPercent = parseInt(stressPercentInput.value) || 0;
    const stressedEmployees = Math.round(employees * (stressPercent / 100));
    const totalCostValue = parseInt(totalCostElement.textContent.replace(/[^\d]/g, '')) || 0;
    const costPerEmployee = stressedEmployees > 0 ? totalCostValue / stressedEmployees : 0;
    
    sendDataToGoogleSheets({
        employees: employees,
        branche: brancheInput.value || 'Ikke angivet',
        totalCost: totalCostValue,
        costPerEmployee: costPerEmployee,
        stressPercent: stressPercent,
        usedImprovement: improvementPercentInput ? (improvementPercentInput.value > 0) : false,
        region: 'Danmark',
        timeOnSite: Math.round((Date.now() - pageLoadTime) / 1000)
    });
});

// Tilføj event listener for den anden beregningsknap i forbedringssektionen
calculateBtn2.addEventListener('click', () => {
    calculateCosts();
    
    // Send data to Google Sheets when user explicitly calculates
    const employees = parseInt(employeesInput.value) || 0;
    const stressPercent = parseInt(stressPercentInput.value) || 0;
    const stressedEmployees = Math.round(employees * (stressPercent / 100));
    const totalCostValue = parseInt(totalCostElement.textContent.replace(/[^\d]/g, '')) || 0;
    const costPerEmployee = stressedEmployees > 0 ? totalCostValue / stressedEmployees : 0;
    
    // Data til Google Sheets
    sendDataToGoogleSheets({
        employees: employees,
        avgSalary: parseInt(avgSalaryInput.value) || 0,
        stressPercent: stressPercent,
        stressedEmployees: stressedEmployees,
        absentDays: parseInt(absentDaysInput.value) || 0,
        productivityLoss: parseInt(productivityLossInput.value) || 0,
        absentCost: parseInt(absentCostElement.textContent.replace(/[^\d]/g, '')) || 0,
        productivityCost: parseInt(productivityCostElement.textContent.replace(/[^\d]/g, '')) || 0,
        turnoverCost: parseInt(turnoverCostElement.textContent.replace(/[^\d]/g, '')) || 0,
        totalCost: totalCostValue,
        costPerEmployee: Math.round(costPerEmployee),
        branche: brancheSelect.value || 'Ikke angivet',
        improvementPercent: parseInt(improvementPercentInput.value) || 0,
        programCost: parseInt(programCostInput.value) || 0,
        region: 'Danmark',
        timeOnSite: Math.round((Date.now() - pageLoadTime) / 1000)
    });
});

// Indlæs gemt tilstand ved page load
document.addEventListener('DOMContentLoaded', () => {
    initializeChart(); // Initialize chart on page load
    loadState();
    // Note: calculateCosts() ikke kaldt automatisk - kræver bruger klik
});

// Beregn omkostninger når input ændres (kun gem state, beregn ikke automatisk)
const inputElements = [employeesInput, avgSalaryInput, programCostInput].filter(Boolean);
inputElements.forEach(element => {
    element.addEventListener('input', debounce(() => { saveState(); }, 500));
});

// Immediate validation on blur/change for numeric inputs
employeesInput.addEventListener('change', () => {
    validateAndClampNumber(employeesInput, { min: 1, max: 100000, step: 1 }, employeesError, 'Antal medarbejdere');
    saveState();
});
avgSalaryInput.addEventListener('change', () => {
    validateAndClampNumber(avgSalaryInput, { min: 0, max: 200000, step: 1 }, avgSalaryError, 'Gennemsnitlig månedsløn');
    saveState();
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
const STATE_KEYS = ['employees','branche','avgSalary','stressPercent','absentDays','productivityLoss','improvementPercent','programCost','locale'];

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

// Chart initialization function
function initializeChart() {
    // Reset modal chart bars to 0 height initially
    const modalBars = [modalAbsentBar, modalProductivityBar, modalTurnoverBar].filter(Boolean);
    const modalValues = [modalAbsentBarValue, modalProductivityBarValue, modalTurnoverBarValue].filter(Boolean);
    
    modalBars.forEach(bar => bar.style.height = '0%');
    modalValues.forEach(value => {
        value.textContent = '-- kr.';
        value.className = 'chart-bar-value text-gray-400';
    });
    
    // Reset modal y-axis labels to default state
    const modalYLabels = [modalYMaxLabel, modalY75Label, modalY50Label, modalY25Label, modalY0Label].filter(Boolean);
    modalYLabels.forEach((label, index) => {
        if (index === 4) { // Bottom label (0%)
            label.textContent = '0 kr.';
        } else {
            label.textContent = '-- kr.';
        }
    });
}

function calculateCosts() {
    // Performance tracking - start timer
    const calcStartTime = performance.now();
    
    // Track calculation event
    trackEvent('calculation_performed', {
        employees: parseInt(employeesInput.value) || 0,
        currency: currentCurrency,
        hasStressData: (parseInt(stressPercentInput.value) || 0) > 0
    });
    
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
    
    // Opdater resultater med formaterede tal og korrekte farver
    absentCostElement.textContent = fmtMoney(absentCost);
    absentCostElement.className = "text-2xl font-bold text-gray-800";
    
    productivityCostElement.textContent = fmtMoney(productivityCost);
    productivityCostElement.className = "text-2xl font-bold text-gray-800";
    
    turnoverCostElement.textContent = fmtMoney(turnoverCost);
    turnoverCostElement.className = "text-2xl font-bold text-gray-800";
    
    totalCostElement.textContent = fmtMoney(totalCost);
    totalCostElement.className = "text-2xl font-bold text-red-600";

    // Forbedret scenarie beregning
    const improvementPercent = improvementPercentInput ? (parseInt(improvementPercentInput.value) || 0) : 0;
    const programCost = programCostInput ? (parseInt(programCostInput.value) || 0) : 0;
    const reductionFactor = Math.max(0, Math.min(100, improvementPercent)) / 100;
    const savings = totalCost * reductionFactor;
    const improvedTotal = Math.max(0, totalCost - savings + programCost);
    const roi = programCost > 0 ? (savings / programCost) : 0;

    if (currentTotalForCompare) {
        currentTotalForCompare.textContent = fmtMoney(totalCost);
        currentTotalForCompare.className = "text-xl font-bold text-gray-800";
    }
    if (improvedTotalCostEl) {
        improvedTotalCostEl.textContent = fmtMoney(improvedTotal);
        improvedTotalCostEl.className = "text-xl font-bold text-gray-800";
    }
    if (savingsAmountEl) savingsAmountEl.textContent = fmtMoney(savings);
    if (roiValueEl) roiValueEl.textContent = `${(roi * 100).toFixed(0)}%`;
    
    // Opdater Y-akse værdier
    const maxValue = Math.max(absentCost, productivityCost, turnoverCost, 1000); // Minimum 1000 for at undgå tomme grafer
    
    // Afrund maxValue til et pænt tal for y-aksen
    const roundedMax = roundToNiceNumber(maxValue);
    
    // Opdater y-akse labels (nu kun modal)
    if (modalYMaxLabel) modalYMaxLabel.textContent = formatCompactCurrency(roundedMax);
    if (modalY75Label) modalY75Label.textContent = formatCompactCurrency(roundedMax * 0.75);
    if (modalY50Label) modalY50Label.textContent = formatCompactCurrency(roundedMax * 0.5);
    if (modalY25Label) modalY25Label.textContent = formatCompactCurrency(roundedMax * 0.25);
    if (modalY0Label) modalY0Label.textContent = formatCompactCurrency(0);
    
    // Opdater modal søjlehøjder
    if (modalAbsentBar) modalAbsentBar.style.height = `${(absentCost / roundedMax) * 100}%`;
    if (modalProductivityBar) modalProductivityBar.style.height = `${(productivityCost / roundedMax) * 100}%`;
    if (modalTurnoverBar) modalTurnoverBar.style.height = `${(turnoverCost / roundedMax) * 100}%`;
    
    // Opdater modal værdier under søjlerne
    if (modalAbsentBarValue) {
        modalAbsentBarValue.textContent = fmtMoney(absentCost);
        modalAbsentBarValue.className = "chart-bar-value text-gray-800";
    }
    if (modalProductivityBarValue) {
        modalProductivityBarValue.textContent = fmtMoney(productivityCost);
        modalProductivityBarValue.className = "chart-bar-value text-gray-800";
    }
    if (modalTurnoverBarValue) {
        modalTurnoverBarValue.textContent = fmtMoney(turnoverCost);
        modalTurnoverBarValue.className = "chart-bar-value text-gray-800";
    }
    
    // Opdater tabel med korrekte farver
    tableAbsentCost.textContent = fmtMoney(absentCost);
    tableAbsentCost.className = "py-2 px-4 text-sm text-right text-gray-700";
    
    tableProductivityCost.textContent = fmtMoney(productivityCost);
    tableProductivityCost.className = "py-2 px-4 text-sm text-right text-gray-700";
    
    tableTurnoverCost.textContent = fmtMoney(turnoverCost);
    tableTurnoverCost.className = "py-2 px-4 text-sm text-right text-gray-700";
    
    tableTotalCost.textContent = fmtMoney(totalCost);
    tableTotalCost.className = "py-2 px-4 text-sm text-right text-red-600";
    
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
    
    // Performance tracking - end timer
    const calcEndTime = performance.now();
    const calcDuration = calcEndTime - calcStartTime;
    
    // Enable export buttons when there are results
    setExportEnabled(totalCost > 0);
    
    // Track calculation performance
    trackPerformance('calculation_time', calcDuration, {
        employees: employees,
        currency: currentCurrency
    });
}

// Send anonymous data til backend API (kun ved explicit beregning)
async function sendDataToGoogleSheets(data) {
    try {
        // MIGRATION: Nu bruger vi sikker backend API i stedet for direkte Google Sheets
        // Ny, sikker indsendelse (ingen no-cors, ingen hemmelige URLs i frontend)
        const success = await sendToCollectAPI({
            employees: data.employees,
            industry: data.industry || 'unknown',
            salary: data.salary,
            stressPct: data.stressPct,
            // Map din eksisterende data struktur til API format
            currency: data.currency
        });
        
        if (success) {
            console.log('Data sent via backend API successfully');
        } else {
            console.log('Backend API unavailable - data not collected');
        }
        
        // LEGACY CODE (deaktiveret) - kan slettes senere når backend er testet
        /*
        const response = await fetch('https://script.google.com/macros/s/AKfycby_wSC8rT4F4miVmOqNgUL-Xevz0Auzh0GztqnenUWwh0eBgNXFGbytMeGAFvyFdDN6/exec', {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        console.log('Data sent to Google Sheets successfully');
        */
    } catch (error) {
        console.log('Error sending data:', error);
        // Fail silently - don't disturb user experience
    }
}

// New currency formatting functions
function parseCurrencySelect(val) {
    if (!val || typeof val !== 'string') {
        return {code: 'DKK', locale: 'da-DK'};
    }
    const parts = val.split('|');
    const code = parts[0] || 'DKK';
    const locale = parts[1] || 'da-DK';
    return {code, locale};
}

function fmtMoney(amount) {
    try {
        const selectValue = globalCurrencySelect?.value || 'DKK|da-DK';
        const {code, locale} = parseCurrencySelect(selectValue);
        
        // Fallback hvis currency code er tom
        const currencyCode = code || 'DKK';
        const localeCode = locale || 'da-DK';
        
        return new Intl.NumberFormat(localeCode, {
            style: 'currency',
            currency: currencyCode,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    } catch (error) {
        console.warn('Currency formatting error:', error);
        // Fallback til simpel formattering
        return `${amount} DKK`;
    }
}

// Backend API helper function
async function sendToCollectAPI(data) {
  // Tilføj samtykke + honeypot til payload
  const payload = { ...data, consent: true, _hp: '' };
  try {
    const res = await fetch('/api/collect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      credentials: 'same-origin'
    });
    const json = await res.json().catch(()=>({ ok:false }));
    if (!res.ok || !json.ok) {
      console.warn('collect failed', json);
    }
    return json.ok === true;
  } catch (error) {
    console.warn('Backend API unavailable, data not collected:', error);
    return false;
  }
}

function updateAllCurrencyDisplays() {
    // Only update if there are actual calculated values (not default text)
    if (totalCostElement && totalCostElement.textContent && !totalCostElement.textContent.includes('--')) {
        calculateCosts(); // Trigger re-render with new currency
    }
}

// Export state management
function setExportEnabled(enabled) {
    const btnExportCsv = document.getElementById('btnExportCsv');
    const btnExportPdf = document.getElementById('btnExportPdf');
    
    [btnExportCsv, btnExportPdf].forEach(btn => {
        if (btn) {
            btn.disabled = !enabled;
            if (enabled) {
                btn.classList.remove('opacity-50', 'cursor-not-allowed');
                if (btn.id === 'btnExportCsv') {
                    btn.classList.add('hover:text-gray-900', 'hover:bg-gray-50');
                } else {
                    btn.classList.add('hover:bg-primary-600');
                }
            } else {
                btn.classList.add('opacity-50', 'cursor-not-allowed');
                btn.classList.remove('hover:text-gray-900', 'hover:bg-gray-50', 'hover:bg-primary-600');
            }
        }
    });
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

// Formater tal som kompakt valuta for y-akse (K, M format)
function formatCompactCurrency(amount) {
    const {code, locale} = parseCurrencySelect(globalCurrencySelect.value);
    const currencySymbol = new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: code,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).formatToParts(0).find(part => part.type === 'currency')?.value || code;
    
    if (amount >= 1000000) {
        return `${(amount / 1000000).toFixed(1)}M ${currencySymbol}`;
    } else if (amount >= 1000) {
        return `${(amount / 1000).toFixed(0)}K ${currencySymbol}`;
    } else {
        return fmtMoney(amount);
    }
}

if (globalCurrencySelect) {
    globalCurrencySelect.addEventListener('change', () => {
        const val = globalCurrencySelect.value || 'DKK|da-DK';
        const {code, locale} = parseCurrencySelect(val);
        currentLocale = locale;
        currentCurrency = code;
        
        // Track currency change
        trackEvent('currency_changed', {
            from_currency: currentCurrency,
            to_currency: code,
            locale: locale
        });
        
        updateAllCurrencyDisplays();
        saveState();
    });
}

// Page load performance tracking
window.addEventListener('load', () => {
    // Initialize cookie consent popup
    cookieConsent.init();
    
    // Track page load time
    const loadTime = performance.now();
    trackPerformance('page_load', loadTime);
    
    // Track Core Web Vitals when available
    if ('web-vital' in window) {
        window.webVitals.getLCP((lcp) => {
            trackPerformance('lcp', lcp.value);
        });
        
        window.webVitals.getFID((fid) => {
            trackPerformance('fid', fid.value);
        });
        
        window.webVitals.getCLS((cls) => {
            trackPerformance('cls', cls.value);
        });
    }
});
