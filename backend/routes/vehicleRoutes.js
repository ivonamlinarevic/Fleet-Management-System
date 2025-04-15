const express = require('express');
const jwt = require('jsonwebtoken'); // Importaj jsonwebtoken
const router = express.Router();
const Vehicle = require('../models/Vehicle');

// Provjera tokena
const checkToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(403).send('Ne postoji autorizacijsko zaglavlje');
   
    const token = authHeader.split(' ')[1];
    if (!token) return res.status(403).send('Bearer token nije pronađen');
   
    try {
        const decodedToken = jwt.verify(token, 'tajniKljuc');
        req.user = decodedToken; // dodajemo korisničke podatke u req.user
        console.log('Decoded Token:', decodedToken);
    } catch (err) {
        return res.status(401).send('Neispravni Token');
    }
    return next();
};

// Provjera uloge
const checkRole = (role) => (req, res, next) => {
    if (req.user && req.user.userRole === role) {
        next();
    } else {
        res.status(403).send(`Zabranjen pristup - vaša uloga je ${req.user ? req.user.userRole : 'nepoznata'}`);
    }
};

// Dohvati sva vozila
router.get('/', async (req, res) => {
    try {
        const vehicles = await Vehicle.find();

        if (vehicles.length === 0) {
            return res.status(404).json({ message: 'Nema unesenih vozila' });
        }

        res.json(vehicles);
    } catch (error) {
        res.status(500).json({ message: 'Greška pri dohvaćanju vozila', error });
    }
});

// Dodaj novo vozilo (samo admin može dodati)
router.post('/add', checkToken, checkRole('admin'), async (req, res) => {
    const { type, maker, model, year, registrationNumber, availabilityStatus } = req.body;

    try {
        const vehicle = new Vehicle({
            type,
            maker,
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

// Uredi vozilo (samo admin može uređivati)
router.put('/:id', checkToken, checkRole('admin'), async (req, res) => {
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

// Admin pregledava sve prijavljene kvarove i štetu na vozilima
router.get('/damaged', checkToken, checkRole('admin'), async (req, res) => {
    try {
        const vehiclesWithDamage = await Vehicle.find({ damageReported: true });

        if (vehiclesWithDamage.length === 0) {
            return res.status(200).json({ message: 'Nema prijavljene štete' });
        }

        res.json(vehiclesWithDamage);
    } catch (error) {
        res.status(500).json({ message: 'Greška pri dohvaćanju vozila s prijavljenom štetom', error });
    }
});

module.exports = router;
