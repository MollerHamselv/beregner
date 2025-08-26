// Global variables for calculator state
let calculatorData = {
    employees: 50,
    avgSalary: 38000,
    stressPercent: 15,
    absentDays: 20,
    productivityLoss: 30,
    locale: 'da-DK',
    currency: 'DKK',
    results: {
        absentCost: 0,
        productivityCost: 0,
        turnoverCost: 0,
        totalCost: 0,
        stressedEmployees: 0
    }
};

// Currency conversion rates (approximate)
const currencyRates = {
    'DKK': 1,
    'USD': 0.145,
    'GBP': 0.12,
    'EUR': 0.134,
    'SEK': 1.56
};

// Format number as currency
function formatCurrency(amount, locale = 'da-DK', currency = 'DKK') {
    try {
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    } catch (error) {
        // Fallback formatting
        return `${Math.round(amount).toLocaleString()} ${currency}`;
    }
}

// Convert currency
function convertCurrency(amount, fromCurrency = 'DKK', toCurrency = 'DKK') {
    if (fromCurrency === toCurrency) return amount;
    
    // Convert to DKK first, then to target currency
    const dkkAmount = amount / currencyRates[fromCurrency];
    return dkkAmount * currencyRates[toCurrency];
}

// Calculate stress-related costs
function calculateCosts() {
    const employees = parseInt(document.getElementById('employees').value) || 0;
    const avgSalary = parseInt(document.getElementById('avgSalary').value) || 0;
    const stressPercent = parseInt(document.getElementById('stressPercent').value) || 0;
    const absentDays = parseInt(document.getElementById('absentDays').value) || 0;
    const productivityLoss = parseInt(document.getElementById('productivityLoss').value) || 0;
    
    // Update global data
    calculatorData.employees = employees;
    calculatorData.avgSalary = avgSalary;
    calculatorData.stressPercent = stressPercent;
    calculatorData.absentDays = absentDays;
    calculatorData.productivityLoss = productivityLoss;
    
    // Calculate number of stressed employees
    const stressedEmployees = Math.round(employees * (stressPercent / 100));
    
    // Calculate daily salary (monthly salary / 21.7 working days)
    const dailySalary = avgSalary / 21.7;
    
    // Calculate annual salary
    const annualSalary = avgSalary * 12;
    
    // 1. Sick leave costs
    const absentCost = stressedEmployees * absentDays * dailySalary;
    
    // 2. Productivity loss costs (reduced productivity when at work)
    // Assuming they work 260 days per year minus sick days
    const workingDays = 260 - absentDays;
    const productivityCost = stressedEmployees * workingDays * dailySalary * (productivityLoss / 100);
    
    // 3. Turnover costs (assuming 20% of stressed employees leave annually)
    // Cost of replacement is typically 50-100% of annual salary
    const turnoverRate = 0.20;
    const replacementCost = 0.75; // 75% of annual salary
    const turnoverCost = stressedEmployees * turnoverRate * annualSalary * replacementCost;
    
    // Total cost
    const totalCost = absentCost + productivityCost + turnoverCost;
    
    // Store results
    calculatorData.results = {
        absentCost,
        productivityCost,
        turnoverCost,
        totalCost,
        stressedEmployees
    };
    
    return {
        absentCost,
        productivityCost,
        turnoverCost,
        totalCost,
        stressedEmployees,
        employees
    };
}

// Update display with calculated results
function updateResults() {
    const results = calculateCosts();
    const { locale, currency } = calculatorData;
    
    // Convert to selected currency
    const convertedResults = {
        absentCost: convertCurrency(results.absentCost, 'DKK', currency),
        productivityCost: convertCurrency(results.productivityCost, 'DKK', currency),
        turnoverCost: convertCurrency(results.turnoverCost, 'DKK', currency),
        totalCost: convertCurrency(results.totalCost, 'DKK', currency)
    };
    
    // Update result cards
    document.getElementById('absentCost').textContent = formatCurrency(convertedResults.absentCost, locale, currency);
    document.getElementById('productivityCost').textContent = formatCurrency(convertedResults.productivityCost, locale, currency);
    document.getElementById('turnoverCost').textContent = formatCurrency(convertedResults.turnoverCost, locale, currency);
    document.getElementById('totalCost').textContent = formatCurrency(convertedResults.totalCost, locale, currency);
    
    // Update summary info
    document.getElementById('stressedEmployees').textContent = results.stressedEmployees;
    document.getElementById('totalEmployees').textContent = results.employees;
    
    const costPerEmployee = results.stressedEmployees > 0 ? convertedResults.totalCost / results.stressedEmployees : 0;
    document.getElementById('costPerEmployee').textContent = formatCurrency(costPerEmployee, locale, currency);
    
    // Update chart
    updateChart(convertedResults);
    
    // Update table
    updateTable(convertedResults);
}

// Update chart visualization
function updateChart(results) {
    const { locale, currency } = calculatorData;
    const maxValue = Math.max(results.absentCost, results.productivityCost, results.turnoverCost);
    
    if (maxValue === 0) {
        // Reset chart if no data
        document.getElementById('absentBar').style.height = '0%';
        document.getElementById('productivityBar').style.height = '0%';
        document.getElementById('turnoverBar').style.height = '0%';
        
        // Reset Y-axis labels
        const yAxisLabels = document.querySelectorAll('.chart-y-axis-label');
        yAxisLabels.forEach(label => label.textContent = formatCurrency(0, locale, currency));
        
        // Reset bar values
        document.getElementById('absentBarValue').textContent = formatCurrency(0, locale, currency);
        document.getElementById('productivityBarValue').textContent = formatCurrency(0, locale, currency);
        document.getElementById('turnoverBarValue').textContent = formatCurrency(0, locale, currency);
        
        return;
    }
    
    // Calculate heights as percentages
    const absentHeight = (results.absentCost / maxValue) * 100;
    const productivityHeight = (results.productivityCost / maxValue) * 100;
    const turnoverHeight = (results.turnoverCost / maxValue) * 100;
    
    // Update bar heights
    document.getElementById('absentBar').style.height = absentHeight + '%';
    document.getElementById('productivityBar').style.height = productivityHeight + '%';
    document.getElementById('turnoverBar').style.height = turnoverHeight + '%';
    
    // Update Y-axis labels
    const yMax = Math.ceil(maxValue / 100000) * 100000; // Round up to nearest 100k
    document.getElementById('y-max').textContent = formatCurrency(yMax, locale, currency);
    document.querySelector('.chart-y-axis-label[style*="top: 25%"]').textContent = formatCurrency(yMax * 0.75, locale, currency);
    document.querySelector('.chart-y-axis-label[style*="top: 50%"]').textContent = formatCurrency(yMax * 0.5, locale, currency);
    document.querySelector('.chart-y-axis-label[style*="top: 75%"]').textContent = formatCurrency(yMax * 0.25, locale, currency);
    document.querySelector('.chart-y-axis-label[style*="top: 100%"]').textContent = formatCurrency(0, locale, currency);
    
    // Update bar value labels
    document.getElementById('absentBarValue').textContent = formatCurrency(results.absentCost, locale, currency);
    document.getElementById('productivityBarValue').textContent = formatCurrency(results.productivityCost, locale, currency);
    document.getElementById('turnoverBarValue').textContent = formatCurrency(results.turnoverCost, locale, currency);
}

// Update table view
function updateTable(results) {
    const { locale, currency } = calculatorData;
    const total = results.totalCost;
    
    // Calculate percentages
    const absentPercent = total > 0 ? (results.absentCost / total * 100).toFixed(1) : 0;
    const productivityPercent = total > 0 ? (results.productivityCost / total * 100).toFixed(1) : 0;
    const turnoverPercent = total > 0 ? (results.turnoverCost / total * 100).toFixed(1) : 0;
    
    // Update table values
    document.getElementById('tableAbsentCost').textContent = formatCurrency(results.absentCost, locale, currency);
    document.getElementById('tableAbsentPercent').textContent = absentPercent + '%';
    
    document.getElementById('tableProductivityCost').textContent = formatCurrency(results.productivityCost, locale, currency);
    document.getElementById('tableProductivityPercent').textContent = productivityPercent + '%';
    
    document.getElementById('tableTurnoverCost').textContent = formatCurrency(results.turnoverCost, locale, currency);
    document.getElementById('tableTurnoverPercent').textContent = turnoverPercent + '%';
    
    document.getElementById('tableTotalCost').textContent = formatCurrency(total, locale, currency);
}

// Validate input fields
function validateInputs() {
    let isValid = true;
    
    const employees = parseInt(document.getElementById('employees').value);
    const avgSalary = parseInt(document.getElementById('avgSalary').value);
    
    // Clear previous errors
    document.getElementById('employeesError').classList.add('hidden');
    document.getElementById('avgSalaryError').classList.add('hidden');
    
    if (!employees || employees < 1) {
        document.getElementById('employeesError').textContent = 'Antal medarbejdere skal være mindst 1';
        document.getElementById('employeesError').classList.remove('hidden');
        isValid = false;
    }
    
    if (!avgSalary || avgSalary < 1000) {
        document.getElementById('avgSalaryError').textContent = 'Månedsløn skal være mindst 1.000 kr.';
        document.getElementById('avgSalaryError').classList.remove('hidden');
        isValid = false;
    }
    
    return isValid;
}

// Export data as CSV
function exportCSV() {
    const results = calculatorData.results;
    const { locale, currency } = calculatorData;
    
    // Convert to selected currency for export
    const convertedResults = {
        absentCost: convertCurrency(results.absentCost, 'DKK', currency),
        productivityCost: convertCurrency(results.productivityCost, 'DKK', currency),
        turnoverCost: convertCurrency(results.turnoverCost, 'DKK', currency),
        totalCost: convertCurrency(results.totalCost, 'DKK', currency)
    };
    
    const csvData = [
        ['Omkostningstype', 'Beløb', 'Valuta'],
        ['Sygefravær', convertedResults.absentCost.toFixed(0), currency],
        ['Produktivitetstab', convertedResults.productivityCost.toFixed(0), currency],
        ['Udskiftning af personale', convertedResults.turnoverCost.toFixed(0), currency],
        ['Total', convertedResults.totalCost.toFixed(0), currency],
        [''],
        ['Inputparametre', '', ''],
        ['Antal medarbejdere', calculatorData.employees, ''],
        ['Gennemsnitlig månedsløn', calculatorData.avgSalary, 'DKK'],
        ['Andel stressramte (%)', calculatorData.stressPercent, '%'],
        ['Sygedage pr. stressramt', calculatorData.absentDays, 'dage'],
        ['Produktivitetstab (%)', calculatorData.productivityLoss, '%']
    ];
    
    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'stress_omkostninger.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

// Export data as PDF (simplified version)
function exportPDF() {
    // For a basic implementation, we'll create a printable version
    // In a production environment, you would use a library like jsPDF
    
    const printWindow = window.open('', '_blank');
    const results = calculatorData.results;
    const { locale, currency } = calculatorData;
    
    // Convert to selected currency for export
    const convertedResults = {
        absentCost: convertCurrency(results.absentCost, 'DKK', currency),
        productivityCost: convertCurrency(results.productivityCost, 'DKK', currency),
        turnoverCost: convertCurrency(results.turnoverCost, 'DKK', currency),
        totalCost: convertCurrency(results.totalCost, 'DKK', currency)
    };
    
    const printContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Stress Omkostningsrapport</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 40px; }
                .header { text-align: center; margin-bottom: 30px; }
                .results { margin: 20px 0; }
                .result-item { margin: 10px 0; padding: 10px; border-bottom: 1px solid #eee; }
                .total { font-weight: bold; font-size: 1.2em; color: #d63031; }
                .params { margin-top: 30px; }
                .param-item { margin: 5px 0; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>Omkostningsberegner for Medarbejderstress</h1>
                <p>Rapport genereret ${new Date().toLocaleDateString('da-DK')}</p>
            </div>
            
            <div class="results">
                <h2>Årlige omkostninger</h2>
                <div class="result-item">
                    <strong>Sygefravær:</strong> ${formatCurrency(convertedResults.absentCost, locale, currency)}
                </div>
                <div class="result-item">
                    <strong>Produktivitetstab:</strong> ${formatCurrency(convertedResults.productivityCost, locale, currency)}
                </div>
                <div class="result-item">
                    <strong>Udskiftning af personale:</strong> ${formatCurrency(convertedResults.turnoverCost, locale, currency)}
                </div>
                <div class="result-item total">
                    <strong>Samlede omkostninger:</strong> ${formatCurrency(convertedResults.totalCost, locale, currency)}
                </div>
                
                <p><strong>${results.stressedEmployees}</strong> ud af <strong>${calculatorData.employees}</strong> medarbejdere er påvirket af stress</p>
            </div>
            
            <div class="params">
                <h2>Inputparametre</h2>
                <div class="param-item"><strong>Antal medarbejdere:</strong> ${calculatorData.employees}</div>
                <div class="param-item"><strong>Gennemsnitlig månedsløn:</strong> ${calculatorData.avgSalary.toLocaleString()} DKK</div>
                <div class="param-item"><strong>Andel stressramte:</strong> ${calculatorData.stressPercent}%</div>
                <div class="param-item"><strong>Sygedage pr. stressramt:</strong> ${calculatorData.absentDays} dage</div>
                <div class="param-item"><strong>Produktivitetstab:</strong> ${calculatorData.productivityLoss}%</div>
            </div>
        </body>
        </html>
    `;
    
    printWindow.document.write(printContent);
    printWindow.document.close();
    
    // Trigger print dialog
    setTimeout(() => {
        printWindow.print();
    }, 250);
}

// Initialize the calculator
function initCalculator() {
    // Set up range input event listeners
    const stressPercentSlider = document.getElementById('stressPercent');
    const stressPercentValue = document.getElementById('stressPercentValue');
    
    const absentDaysSlider = document.getElementById('absentDays');
    const absentDaysValue = document.getElementById('absentDaysValue');
    
    const productivityLossSlider = document.getElementById('productivityLoss');
    const productivityLossValue = document.getElementById('productivityLossValue');
    
    // Update slider value displays
    stressPercentSlider.addEventListener('input', function() {
        stressPercentValue.textContent = this.value + '%';
        updateResults();
    });
    
    absentDaysSlider.addEventListener('input', function() {
        absentDaysValue.textContent = this.value + ' dage';
        updateResults();
    });
    
    productivityLossSlider.addEventListener('input', function() {
        productivityLossValue.textContent = this.value + '%';
        updateResults();
    });
    
    // Set up input field event listeners
    document.getElementById('employees').addEventListener('input', updateResults);
    document.getElementById('avgSalary').addEventListener('input', updateResults);
    
    // Set up calculate button
    document.getElementById('calculateBtn').addEventListener('click', function() {
        if (validateInputs()) {
            updateResults();
        }
    });
    
    // Set up export buttons
    document.getElementById('exportCsvBtn').addEventListener('click', exportCSV);
    document.getElementById('exportPdfBtn').addEventListener('click', exportPDF);
    
    // Set up locale/currency selector
    document.getElementById('localeSelect').addEventListener('change', function() {
        const [locale, currency] = this.value.split(',');
        calculatorData.locale = locale;
        calculatorData.currency = currency;
        updateResults();
    });
    
    // Set up tab switching
    document.getElementById('chartTab').addEventListener('click', function() {
        document.getElementById('chartView').classList.remove('hidden');
        document.getElementById('tableView').classList.add('hidden');
        document.getElementById('chartTab').classList.add('active');
        document.getElementById('tableTab').classList.remove('active');
    });
    
    document.getElementById('tableTab').addEventListener('click', function() {
        document.getElementById('chartView').classList.add('hidden');
        document.getElementById('tableView').classList.remove('hidden');
        document.getElementById('chartTab').classList.remove('active');
        document.getElementById('tableTab').classList.add('active');
    });
    
    // Initial calculation
    updateResults();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initCalculator);