const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Registracija korisnika
router.post('/register', async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'Korisnik već postoji' });
        }

        const user = new User({
            name,
            email,
            password,
            role,
        });

        await user.save();
        res.status(201).json({ message: 'Korisnik uspješno registriran' });
    } catch (error) {
        res.status(500).json({ message: 'Greška prilikom registracije', error });
    }
});

// Login korisnika
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Korisnik ne postoji' });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Pogrešna lozinka' });
        }

        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Greška prilikom login-a', error });
    }
});

// Dobivanje podataka o korisniku (autentifikacija putem tokena)
router.get('/profile', async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: 'Korisnik nije pronađen' });
        }
        res.json({ name: user.name, email: user.email, role: user.role });
    } catch (error) {
        res.status(500).json({ message: 'Greška pri dohvaćanju podataka', error });
    }
});

module.exports = router;
