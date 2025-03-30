const express = require('express');
const router = express.Router();
const Vehicle = require('../models/Vehicle');

// Dohvati sva vozila
router.get('/', async (req, res) => {
    try {
        const vehicles = await Vehicle.find();
        res.json(vehicles);
    } catch (error) {
        res.status(500).json({ message: 'Greška pri dohvaćanju vozila', error });
    }
});

// Dodaj novo vozilo
router.post('/', async (req, res) => {
    const { type, make, model, year, registrationNumber, availabilityStatus } = req.body;

    try {
        const vehicle = new Vehicle({
            type,
            make,
            model,
            year,
            registrationNumber,
            availabilityStatus,
        });

        await vehicle.save();
        res.status(201).json({ message: 'Vozilo uspješno dodano' });
    } catch (error) {
        res.status(500).json({ message: 'Greška pri dodavanju vozila', error });
    }
});

// Uredi vozilo (npr. promjena statusa)
router.put('/:id', async (req, res) => {
    try {
        const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!vehicle) {
            return res.status(404).json({ message: 'Vozilo nije pronađeno' });
        }
        res.json({ message: 'Vozilo uspješno uređeno', vehicle });
    } catch (error) {
        res.status(500).json({ message: 'Greška pri uređivanju vozila', error });
    }
});

module.exports = router;
