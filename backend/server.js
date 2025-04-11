const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const mongoose = require("mongoose");
const app = express();
const cookieParser = require("cookie-parser");


require('dotenv').config();  // Ovdje učitaj .env datoteku

dotenv.config();
connectDB();

//app.use(cors());
/* app.use(cors({
  origin: 'http://localhost:3000',  // Zamijeni s frontend domenom
  credentials: true
})); */

app.use(cors({
  origin: 'http://localhost:5173',  // Ovo omogućava samo tvojoj frontend aplikaciji da pristupi API-ju
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Ovo omogućava korištenje specifičnih HTTP metoda
  allowedHeaders: ['Content-Type', 'Authorization']  // Ovo omogućava specifične zaglavlja
}));

app.use(express.json());
app.use(cookieParser())

// Routes
app.use('/api/users', userRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/reservations', reservationRoutes);

app.get('/', (req, res) => {
  res.send('Fleet Management API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
