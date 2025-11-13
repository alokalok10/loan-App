Below is a **professional, complete, production-grade README.md** for your **Loan Origination & Approval System** (Node.js + React + MongoDB).

You can **copy–paste this directly into your GitHub README.md**.
It is formatted, clean, includes installation, setup, API docs, features, screenshots sections, and everything expected in a real project submission.

---

# 📄 **Loan Origination & Approval System**

### *Full-Stack MERN Application (Node.js, Express, MongoDB, React)*

A complete digital loan management system that allows **customers** to apply for loans, calculate **EMI**, track application status, and receive officer feedback — while **loan officers** can review, comment, approve/reject applications.

---

## ✨ **Features**

### 👤 Customer Features

* Register / Login (JWT Authentication)
* Apply for loan with **live EMI calculator**
* Automatic eligibility score (backend logic)
* View loan status
* Edit & delete loan **(only while PENDING)**
* View loan officer comments (missing documents, corrections, etc.)

### 🧑‍💼 Loan Officer Features

* Login using officer account
* View all **pending** loan applications
* Review loan details + eligibility score
* Add comments (document missing, suggestion, risk note)
* Approve / Reject loan applications
* Track previously reviewed loans

### 🔐 Security & Auth

* JWT-based authentication
* Protected routes on backend
* Protected pages on frontend
* Role-based access (customer/officer)

### 🚀 Tech Stack

* **Frontend:** React, Axios, React Router, Context API
* **Backend:** Node.js, Express, Mongoose
* **Database:** MongoDB
* **Auth:** JWT
* **UI:** Custom CSS (Glassmorphic + Attractive UI)
* **Other:** Toast notifications, EMI calculator logic

---

# 📁 **Project Structure**

```
loan-origination-app/
│
├── backend/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   ├── config/
│   ├── server.js
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── contexts/
    │   ├── pages/
    │   ├── api.js
    │   └── App.js
    └── .env.example
```

---

# ⚙️ **Backend Setup**

### 1️⃣ Install dependencies

```
cd backend
npm install
```

### 2️⃣ Create `.env` file

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/loan_app_db
JWT_SECRET=your_jwt_secret
JWT_EXPIRY=7d
```

### 3️⃣ Start backend

```
npm start
```

Backend runs at:
👉 [http://localhost:5000](http://localhost:5000)

---

# 🖥️ **Frontend Setup**

### 1️⃣ Install dependencies

```
cd frontend
npm install
```

### 2️⃣ Create `.env` file

```
REACT_APP_API_URL=http://localhost:5000
```

### 3️⃣ Start frontend

```
npm start
```

Frontend runs at:
👉 [http://localhost:3000](http://localhost:3000)

---

# 🔌 **API Endpoints**

## 🔐 Auth API

### **POST /auth/register**

Register as Customer or Officer
Request:

```json
{
  "name": "Ravi",
  "email": "ravi@example.com",
  "password": "P@ssw0rd",
  "role": "CUSTOMER"
}
```

---

### **POST /auth/login**

Response:

```json
{
  "token": "xxx",
  "userId": "xxx",
  "role": "CUSTOMER"
}
```

---

## 🧑 Customer API

### **POST /loans/apply**

Create a new loan

```json
{
  "amountRequested": 500000,
  "tenureMonths": 24,
  "interestRate": 12
}
```

### **GET /loans/mine**

Fetch all my loans

### **PUT /loans/:id**

Update loan (**only if PENDING**)

### **DELETE /loans/:id**

Delete loan (**only if PENDING**)

---

## 🧑‍💼 Officer API

### **GET /officer/loans/pending**

Fetch pending loans

### **POST /officer/loans/:id/review**

Approve/Reject loan
Request:

```json
{
  "action": "APPROVE",
  "comment": "Your bank statement is missing."
}
```

---

# 🧮 **Eligibility Score Logic**

Backend calculates score using:

```
score = (0.6 * creditScoreNormalized) + (0.4 * incomeNormalized)
```

Status remains **PENDING** until officer approves/rejects.

---

# 📊 **EMI Calculator Logic**

Used in frontend when applying for loans:

```
EMI = [P × R × (1+R)^N] / [(1+R)^N – 1]
```

Shown live on screen:

* Monthly EMI
* Total Interest
* Total Payable

---

# 🔒 **Protected Routes**

### Backend

All `/loans/*` and `/officer/*` routes require:

```
Authorization: Bearer <token>
```

### Frontend

Protected using:

* Context API
* ProtectedRoute wrapper
* Role-based redirection

---



Add the following when uploading to GitHub:

* Login page
* Register page
* Apply loan (with EMI calculator)
* Customer Dashboard
* Officer Dashboard
* Loan review screen
* Officer comments

---

# 🧪 **Testing**

### Customer

* Register → login → apply loan → see live EMI → check eligibility score → view officer comments

### Officer

* Login → view pending loans → comment → approve/reject → verify status update

---

# 📦 **Deploy Instructions**



* Build command: `npm run build`
* Add env:

```
REACT_APP_API_URL=https://your-backend.com
```

---

# 🤝 **Contributing**

Pull requests are welcome.

---

# 📜 License

This project is open-source under the MIT License.

---

# 🎉 Final Note

This project demonstrates:

✔ Full MERN stack
✔ Role-based access
✔ JWT authentication
✔ Loan flow automation
✔ EMI + eligibility scoring
✔ Real-world loan approval workflow

---


