const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');
const Vehicle = require('../models/Vehicle');

// Kreiraj novu rezervaciju
router.post('/', async (req, res) => {
    const { userId, vehicleId, startDate, endDate, purpose } = req.body;

    try {
        const vehicle = await Vehicle.findById(vehicleId);
        if (!vehicle) {
            return res.status(404).json({ message: 'Vozilo nije pronađeno' });
        }

        if (vehicle.availabilityStatus !== 'available') {
            return res.status(400).json({ message: 'Vozilo nije dostupno' });
        }

        const reservation = new Reservation({
            user: userId,
            vehicle: vehicleId,
            startDate,
            endDate,
            purpose,
        });

        await reservation.save();

        // Postavljanje vozila na "rezervirano"
        vehicle.availabilityStatus = 'reserved';
        await vehicle.save();

        res.status(201).json({ message: 'Rezervacija uspješno kreirana', reservation });
    } catch (error) {
        res.status(500).json({ message: 'Greška pri kreiranju rezervacije', error });
    }
});

// Dohvati sve rezervacije korisnika
router.get('/:userId', async (req, res) => {
    try {
        const reservations = await Reservation.find({ user: req.params.userId }).populate('vehicle');
        res.json(reservations);
    } catch (error) {
        res.status(500).json({ message: 'Greška pri dohvaćanju rezervacija', error });
    }
});

// Otkazi rezervaciju
router.delete('/:id', async (req, res) => {
    try {
        const reservation = await Reservation.findByIdAndDelete(req.params.id);
        if (!reservation) {
            return res.status(404).json({ message: 'Rezervacija nije pronađena' });
        }

        const vehicle = await Vehicle.findById(reservation.vehicle);
        vehicle.availabilityStatus = 'available';
        await vehicle.save();

        res.json({ message: 'Rezervacija uspješno otkazana' });
    } catch (error) {
        res.status(500).json({ message: 'Greška pri otkazivanju rezervacije', error });
    }
});

module.exports = router;
