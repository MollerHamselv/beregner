# Copilot Instructions for Beregner (Stress Cost Calculator)

## Project Overview
This is a Danish stress cost calculator application built for Medica Pro. It's a serverless web app deployed on Vercel that calculates workplace stress-related costs and provides ROI analysis for stress prevention programs.

## Architecture
- **Frontend**: Vanilla HTML/CSS/JS with TailwindCSS (Danish language)
- **Backend**: Vercel serverless functions in `/api/`
- **Data**: Uses Vercel Edge Config/KV (Google Sheets integration disabled)
- **Admin**: Separate admin dashboard at `/admin.html`

## Key Components

### Core Calculator Logic (`script.js`)
- **State Management**: Uses localStorage + URL params for persistence
- **Main Formula**: Calculates stress costs across 3 categories:
  - Sygefravær (sick leave): `stressedEmployees × absentDays × dailySalary`
  - Produktivitetstab (productivity loss): `stressedEmployees × workingDays × dailySalary × (productivityLoss/100)`
  - Udskiftning (turnover): `stressedEmployees × 0.1 × (6 × avgSalary)`
- **ROI Calculator**: Compares current costs vs improved scenario with program costs
- **Danish Formatting**: Uses `da-DK` locale for currency (kr.) and numbers

### Data Flow
1. User inputs → validation/clamping → state persistence
2. Calculate button → `calculateCosts()` → updates UI + sends to `/api/collect`
3. Admin dashboard queries `/api/admin/stats` for aggregated data

### API Endpoints (`/api/`)
- `collect.js`: Stores calculation data (GDPR consent required, honeypot protection)
- `admin/stats.js`: Returns aggregated statistics (requires `X-Admin-Key` header)
- `admin/export.js`: Data export functionality
- All have 30s timeout limit (see `vercel.json`)

## Development Workflow

### Local Testing
```bash
# Start local server
python3 -m http.server 8080

# Run comprehensive tests
./quick-test.sh http://localhost:8080

# Check specific test priorities
cat PRIORITY_TESTS.md
```

### Key Files to Modify
- **UI/UX**: `index.html` (main calculator), `admin.html` (dashboard), `style.css`
- **Business Logic**: `script.js` (calculation functions, state management)
- **Backend**: `api/collect.js` (data collection), `api/admin/*.js` (admin functions)
- **Config**: `vercel.json` (deployment), `.vscode/settings.json` (dev environment)

## Critical Patterns

### Input Validation
Use `validateAndClampNumber()` with bounds checking:
```javascript
validateAndClampNumber(employeesInput, { min: 1, max: 100000, step: 1 }, employeesError, 'Antal medarbejdere');
```

### Danish Currency Formatting
Always use `fmtMoney()` function for consistent kr. display:
```javascript
const fmtMoney = (amount) => new Intl.NumberFormat('da-DK', { 
    style: 'currency', currency: 'DKK' 
}).format(amount);
```

### State Persistence
Both localStorage and URL params are synced via `saveState()` - modify `STATE_KEYS` array to add new fields.

### GDPR Compliance
- Cookie consent popup with multi-language support
- All data collection requires explicit consent
- Honeypot field `_hp` for spam protection

## Testing Priorities
1. **Core calculation accuracy** - verify formulas match Danish workplace research
2. **Responsive design** - mobile-first approach with TailwindCSS
3. **GDPR compliance** - consent flow and data handling
4. **Admin authentication** - secure endpoints with proper headers
5. **Performance** - track calculation times and optimize for mobile

## Common Gotchas
- **No auto-calculation**: Users must click "Beregn omkostninger" button explicitly
- **Danish locale**: All text, numbers, and dates must use Danish formatting
- **Vercel limits**: 30s function timeout, Edge Config size limits
- **State sync**: URL params override localStorage on page load
- **Color coding**: Total costs always display in red (`text-red-600`)

## External Dependencies
- TailwindCSS (CDN)
- EmailJS for contact forms
- Vercel analytics and speed insights
    

Remember: This is a business-critical tool for healthcare consultancy - prioritize accuracy, clarity, and Danish business culture compliance.
