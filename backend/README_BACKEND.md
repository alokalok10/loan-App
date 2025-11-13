# Backend

1. Copy `.env.example` to `.env` and fill variables.
2. npm install
3. npm run dev

API endpoints:
- POST /auth/register
- POST /auth/login
- POST /loans/apply (AUTH, role CUSTOMER)
- GET /loans/:id/status (AUTH)
- GET /loans/mine (AUTH, role CUSTOMER)
- GET /officer/loans/pending (AUTH, role OFFICER)
- POST /officer/loans/:id/review (AUTH, role OFFICER)
