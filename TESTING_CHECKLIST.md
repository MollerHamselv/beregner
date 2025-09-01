# 🧪 Beregner System Test Checklist

## ✅ Frontend Tests

### Main Application (index.html)
- [ ] Form inputs accepterer gyldige værdier
- [ ] Validation virker for tomme felter
- [ ] GDPR samtykke checkbox er påkrævet
- [ ] Honeypot felt er skjult for brugere
- [ ] Form submission sender til /api/collect
- [ ] Success/error beskeder vises korrekt
- [ ] Responsive design på mobile enheder

### Admin Dashboard (admin.html)
- [ ] Login form kræver admin key
- [ ] Password visibility toggle virker
- [ ] Dashboard vises efter succesfuld login
- [ ] Statistikker indlæses og vises
- [ ] Code viewer funktionalitet virker
- [ ] File selector viser tilgængelige filer
- [ ] Download funktionalitet virker
- [ ] Logout funktionalitet virker
- [ ] Responsive design på alle skærmstørrelser

## 🔧 Backend API Tests

### Data Collection (/api/collect)
- [ ] Accepterer POST requests
- [ ] Afviser GET requests (405 error)
- [ ] Validerer GDPR samtykke (krævet)
- [ ] Blokerer spam via honeypot
- [ ] Returnerer success med entry ID
- [ ] Logger data korrekt til console
- [ ] Håndterer invalid JSON gracefully

### Admin Endpoints
- [ ] /api/admin/stats kræver admin key
- [ ] /api/admin/stats returnerer mock statistikker
- [ ] /api/admin/code-viewer kræver admin key
- [ ] /api/admin/code-viewer viser filliste
- [ ] /api/admin/code-viewer returnerer filindhold
- [ ] Unauthorized access returnerer 401

## 🔒 Security Tests

### Authentication
- [ ] Forkert admin key afvises
- [ ] Admin endpoints beskyttet
- [ ] GDPR samtykke håndhæves
- [ ] Honeypot blokerer automatiserede requests

### Data Protection
- [ ] IP adresser logges men maskeres i frontend
- [ ] Ingen sensitive data i frontend JavaScript
- [ ] Environment variables ikke eksponeret

## 🌐 Deployment Tests

### Vercel Production
- [ ] Main site tilgængeligt
- [ ] Admin dashboard tilgængeligt
- [ ] API endpoints responsive
- [ ] HTTPS konfigureret korrekt
- [ ] Environment variables konfigureret

## 📱 Cross-Browser Tests

### Desktop Browsers
- [ ] Chrome/Chromium
- [ ] Firefox
- [ ] Safari
- [ ] Edge

### Mobile Browsers
- [ ] Mobile Chrome
- [ ] Mobile Safari
- [ ] Mobile Firefox

## 🚀 Performance Tests

- [ ] Page load times under 3 sekunder
- [ ] API response times under 1 sekund
- [ ] Glassmorphism effekter smooth på alle enheder
- [ ] Ingen console errors

## Test URLs
- **Main App**: https://beregner-4u8hozgod-nikolajs-projects-52d10ebe.vercel.app/
- **Admin Dashboard**: https://beregner-4u8hozgod-nikolajs-projects-52d10ebe.vercel.app/admin.html
- **Admin Key**: `Adm-medicapro-beregner-xyz123!`

## Test Data Examples

### Valid Form Data
```json
{
  "employees": 25,
  "industry": "IT & Teknologi", 
  "salary": 550000,
  "stressPct": 65,
  "consent": true,
  "_hp": ""
}
```

### Invalid Test Cases
- Manglende samtykke: `"consent": false`
- Spam detection: `"_hp": "filled_by_bot"`
- Tomme felter: `"employees": ""`
- Negative værdier: `"salary": -1000`
