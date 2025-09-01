# 🧪 TestSprite Automated Test Plan for Beregner

## 🎯 Critical Test Scenarios

### 1. Frontend Form Validation Tests
```javascript
// Test Case: Valid form submission
test('Valid form submission with all required fields', async () => {
  const formData = {
    employees: 25,
    industry: 'IT & Teknologi',
    salary: 550000,
    stressPct: 65,
    consent: true,
    _hp: ''
  };
  
  // Expected: Success response with entry ID
  // URL: https://beregner-4u8hozgod-nikolajs-projects-52d10ebe.vercel.app/
});

// Test Case: GDPR Compliance
test('Form requires GDPR consent', async () => {
  const formData = {
    employees: 25,
    industry: 'IT & Teknologi', 
    salary: 550000,
    stressPct: 65,
    consent: false  // Missing consent
  };
  
  // Expected: Error - "Consent required"
});

// Test Case: Honeypot spam protection
test('Honeypot field blocks spam submissions', async () => {
  const formData = {
    employees: 25,
    industry: 'IT & Teknologi',
    salary: 550000, 
    stressPct: 65,
    consent: true,
    _hp: 'spam_content'  // Bot filled honeypot
  };
  
  // Expected: Silent success (bot blocked)
});
```

### 2. Backend API Tests
```javascript
// Test Case: Collect endpoint functionality
test('POST /api/collect processes valid data', async () => {
  const response = await fetch('/api/collect', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      employees: 50,
      industry: 'Finans & Bank',
      salary: 650000,
      stressPct: 72,
      consent: true,
      _hp: ''
    })
  });
  
  // Expected: 200 status, { ok: true, id: "entry_..." }
});

// Test Case: Admin authentication
test('Admin endpoints require valid key', async () => {
  const response = await fetch('/api/admin/stats', {
    headers: { 'X-Admin-Key': 'invalid_key' }
  });
  
  // Expected: 401 Unauthorized
});

// Test Case: Admin stats functionality  
test('Admin stats return valid data structure', async () => {
  const response = await fetch('/api/admin/stats', {
    headers: { 'X-Admin-Key': 'Adm-medicapro-beregner-xyz123!' }
  });
  
  // Expected: Statistics object with totalEntries, industries, etc.
});
```

### 3. Admin Dashboard Tests
```javascript
// Test Case: Login functionality
test('Admin login with correct credentials', async () => {
  // Navigate to /admin.html
  // Enter key: Adm-medicapro-beregner-xyz123!
  // Click login
  // Expected: Dashboard visible, login form hidden
});

// Test Case: Password visibility toggle
test('Password toggle shows/hides admin key', async () => {
  // Click eye icon
  // Expected: Input type changes from password to text
});

// Test Case: Code viewer functionality
test('Code viewer loads and displays files', async () => {
  // Login to dashboard
  // Select file from dropdown
  // Click "Vis kode"
  // Expected: Code content displayed in viewer
});
```

### 4. Cross-Browser Compatibility Tests
```javascript
// Test browsers: Chrome, Firefox, Safari, Edge
// Test devices: Desktop, Tablet, Mobile
// Test features:
// - CSS Grid layouts
// - Glassmorphism effects (backdrop-filter)
// - Fetch API calls
// - Local storage
// - Form validation
```

### 5. Performance Tests
```javascript
// Test Case: Page load performance
test('Main page loads under 3 seconds', async () => {
  // Measure Time to First Contentful Paint
  // Expected: < 3000ms
});

// Test Case: API response times
test('API endpoints respond under 1 second', async () => {
  // Test /api/collect, /api/admin/stats
  // Expected: < 1000ms response time
});
```

### 6. Security Tests
```javascript
// Test Case: Input sanitization
test('Form inputs are properly sanitized', async () => {
  // Submit XSS payloads in form fields
  // Expected: Sanitized or rejected
});

// Test Case: Rate limiting
test('API has rate limiting protection', async () => {
  // Send many requests rapidly
  // Expected: Rate limit responses after threshold
});
```

## 🎯 Automated Test URLs

### Production URLs to Test:
- **Main App**: https://beregner-4u8hozgod-nikolajs-projects-52d10ebe.vercel.app/
- **Admin Dashboard**: https://beregner-4u8hozgod-nikolajs-projects-52d10ebe.vercel.app/admin.html
- **API Collect**: https://beregner-4u8hozgod-nikolajs-projects-52d10ebe.vercel.app/api/collect
- **API Admin Stats**: https://beregner-4u8hozgod-nikolajs-projects-52d10ebe.vercel.app/api/admin/stats

### Test Credentials:
- **Admin Key**: `Adm-medicapro-beregner-xyz123!`

## 📊 Success Criteria

### ✅ Must Pass:
1. Form submission works with valid data
2. GDPR consent enforcement  
3. Admin authentication security
4. Cross-browser compatibility (Chrome, Firefox, Safari)
5. Mobile responsive design
6. API error handling

### ⚠️ Should Pass:
1. Performance under 3s load time
2. Honeypot spam protection
3. Code viewer functionality
4. Password visibility toggle
5. Admin logout functionality

### 🎯 Nice to Have:
1. Advanced browser support (IE11, older Safari)
2. Accessibility compliance (WCAG)
3. SEO optimization
4. Analytics tracking
