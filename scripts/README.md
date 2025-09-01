# 🔧 Scripts & Utilities

Denne mappe indeholder test scripts og udviklings værktøjer.

## 📝 Scripts

### `quick-test.sh`
Omfattende test suite der validerer:
- Frontend tilgængelighed 
- API endpoints (når tilgængelige)
- File integritet
- JavaScript syntax
- HTML struktur

**Usage:**
```bash
./scripts/quick-test.sh [domain]
./scripts/quick-test.sh http://localhost:8080
```

### `test-api-logic.sh`
Tester API logik komponenter lokalt:
- Data validering og sanitering
- Statistics generation
- CSV export funktionalitet  
- Authentication flows

**Usage:**
```bash
./scripts/test-api-logic.sh
ADMIN_KEY=your-key ./scripts/test-api-logic.sh
```

## 🔗 Relateret

Se `/docs/` mappen for fuld dokumentation.
