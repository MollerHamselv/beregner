// Initialize EmailJS with your User ID
(function() {
    emailjs.init('WxsFcH0Ah_J79S9tO'); // Replace with your actual EmailJS user ID
})();

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

// Resultat elementer
const absentCostElement = document.getElementById('absentCost');
const productivityCostElement = document.getElementById('productivityCost');
const turnoverCostElement = document.getElementById('turnoverCost');
const totalCostElement = document.getElementById('totalCost');

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
    // Track modal open event
    trackEvent('contact_modal_opened', {
        currency: currentCurrency,
        has_calculations: !!document.getElementById('totalCost')?.textContent
    });
    
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
    // Beregn værdier fra input-felterne
    const employees = parseInt(employeesInput.value) || 0;
    const stressPercent = parseInt(stressPercentInput.value) || 0;
    const stressedEmployees = Math.round(employees * (stressPercent / 100));
    const totalCostValue = parseInt(totalCostElement.textContent.replace(/[^\d]/g, '')) || 0;
    const costPerEmployee = stressedEmployees > 0 ? totalCostValue / stressedEmployees : 0;
    
    modalTotalCost.textContent = totalCostElement.textContent;
    modalStressedEmployees.textContent = stressedEmployees.toString();
    modalCostPerEmployee.textContent = formatCurrency(costPerEmployee);
    
    // Opdater skjulte formularfelter
    formTotalCost.value = totalCostElement.textContent;
    formStressedEmployees.value = stressedEmployees.toString();
    formCostPerEmployee.value = formatCurrency(costPerEmployee);
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
        costPerEmployee: formatCurrency(costPerEmployee),
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
    absentCostElement.textContent = formatCurrency(absentCost);
    absentCostElement.className = "text-2xl font-bold text-gray-800";
    
    productivityCostElement.textContent = formatCurrency(productivityCost);
    productivityCostElement.className = "text-2xl font-bold text-gray-800";
    
    turnoverCostElement.textContent = formatCurrency(turnoverCost);
    turnoverCostElement.className = "text-2xl font-bold text-gray-800";
    
    totalCostElement.textContent = formatCurrency(totalCost);
    totalCostElement.className = "text-2xl font-bold text-red-600";

    // Forbedret scenarie beregning
    const improvementPercent = improvementPercentInput ? (parseInt(improvementPercentInput.value) || 0) : 0;
    const programCost = programCostInput ? (parseInt(programCostInput.value) || 0) : 0;
    const reductionFactor = Math.max(0, Math.min(100, improvementPercent)) / 100;
    const savings = totalCost * reductionFactor;
    const improvedTotal = Math.max(0, totalCost - savings + programCost);
    const roi = programCost > 0 ? (savings / programCost) : 0;

    if (currentTotalForCompare) {
        currentTotalForCompare.textContent = formatCurrency(totalCost);
        currentTotalForCompare.className = "text-xl font-bold text-gray-800";
    }
    if (improvedTotalCostEl) {
        improvedTotalCostEl.textContent = formatCurrency(improvedTotal);
        improvedTotalCostEl.className = "text-xl font-bold text-gray-800";
    }
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
    
    // Opdater værdier under søjlerne med korrekte farver
    absentBarValue.textContent = formatCurrency(absentCost);
    absentBarValue.className = "chart-bar-value text-gray-800";
    
    productivityBarValue.textContent = formatCurrency(productivityCost);
    productivityBarValue.className = "chart-bar-value text-gray-800";
    
    turnoverBarValue.textContent = formatCurrency(turnoverCost);
    turnoverBarValue.className = "chart-bar-value text-gray-800";
    
    // Opdater tabel med korrekte farver
    tableAbsentCost.textContent = formatCurrency(absentCost);
    tableAbsentCost.className = "py-2 px-4 text-sm text-right text-gray-700";
    
    tableProductivityCost.textContent = formatCurrency(productivityCost);
    tableProductivityCost.className = "py-2 px-4 text-sm text-right text-gray-700";
    
    tableTurnoverCost.textContent = formatCurrency(turnoverCost);
    tableTurnoverCost.className = "py-2 px-4 text-sm text-right text-gray-700";
    
    tableTotalCost.textContent = formatCurrency(totalCost);
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
    
    // Opdater modal værdier hvis modalen er åben
    if (ctaModal.style.display === 'block') {
        updateModalValues();
    }
    
    // Performance tracking - end timer
    const calcEndTime = performance.now();
    const calcDuration = calcEndTime - calcStartTime;
    
    // Track calculation performance
    trackPerformance('calculation_time', calcDuration, {
        employees: employees,
        currency: currentCurrency
    });
    
    // Send anonymous data to Google Sheets
    sendDataToGoogleSheets({
        employees: employees,
        branche: brancheInput.value || 'Ikke angivet',
        totalCost: totalCost,
        costPerEmployee: costPerEmployee,
        stressPercent: stressPercent,
        usedImprovement: improvementPercentInput ? (improvementPercentInput.value > 0) : false,
        region: 'Danmark', // Du kan udvide dette senere
        timeOnSite: Math.round((Date.now() - pageLoadTime) / 1000) // sekunder på siden
    });
}

// Send anonymous data til Google Sheets
async function sendDataToGoogleSheets(data) {
    try {
        const response = await fetch('https://script.google.com/macros/s/AKfycby_wSC8rT4F4miVmOqNgUL-Xevz0Auzh0GztqnenUWwh0eBgNXFGbytMeGAFvyFdDN6/exec', {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        console.log('Data sent to Google Sheets successfully');
    } catch (error) {
        console.log('Error sending data to Google Sheets:', error);
        // Fail silently - don't disturb user experience
    }
}

// Track when page loads
let pageLoadTime = Date.now();

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
        
        // Track currency change
        trackEvent('currency_changed', {
            from_currency: currentCurrency,
            to_currency: parts[1] || 'DKK',
            locale: parts[0] || 'da-DK'
        });
        
        calculateCosts();
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
