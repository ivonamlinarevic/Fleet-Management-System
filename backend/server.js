const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const app = express();

require('dotenv').config();  // Ovdje učitaj .env datoteku

dotenv.config();
connectDB();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/reservations', reservationRoutes);

app.get('/', (req, res) => {
  res.send('Fleet Management API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
