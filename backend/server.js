// ✅ Load environment variables safely (Windows friendly)
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Connect to MongoDB
connectDB();

// ✅ Routes
app.use('/auth', require('./routes/auth'));
app.use('/loans', require('./routes/loans'));
app.use('/officer', require('./routes/officer'));

// ✅ Default route (optional)
app.get('/', (req, res) => {
  res.send('Loan Origination & Approval System API is running 🚀');
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
