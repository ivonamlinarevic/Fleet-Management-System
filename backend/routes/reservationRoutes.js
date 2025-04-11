const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const Reservation = require('../models/Reservation');
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

// Kreiraj novu rezervaciju: Unos željenog vremena korištenja, svrhe putovanja i preferiranog tipa vozila, ZAPOSLENIK SAMO
router.post('/new', checkToken, checkRole('employee'), async (req, res) => {
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

// Dohvati sve rezervacije korisnika, ZAPOSLENIK I ADMIN
router.get('/:userId', checkToken, (req, res, next) => {
    // Provjeravamo je li korisnik zaposlenik ili administrator
    if (req.user.userRole === 'employee' || req.user.userRole === 'admin') {
        next(); // Ako je korisnik zaposlenik ili admin, dopuštamo pristup
    } else {
        res.status(403).send('Zabranjen pristup - vaša uloga nije dopuštena za ovu akciju');
    }
}, async (req, res) => {
    try {
        const reservations = await Reservation.find({ user: req.params.userId }).populate('vehicle');
        res.json(reservations);
    } catch (error) {
        res.status(500).json({ message: 'Greška pri dohvaćanju rezervacija', error });
    }
});

// Otkazi rezervaciju, ZAPOSLENIK
router.delete('/:id', checkToken, checkRole('employee'), async (req, res) => {
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

// Admin odbija ili odobrava rezervaciju
router.put('/:id/status', checkToken, checkRole('admin'), async (req, res) => {
    const { status } = req.body; // očekuje status 'approved' ili 'rejected'
    
    if (!['approved', 'rejected'].includes(status)) {
        return res.status(400).json({ message: 'Status mora biti "approved" ili "rejected"' });
    }

    try {
        const reservation = await Reservation.findById(req.params.id);
        if (!reservation) {
            return res.status(404).json({ message: 'Rezervacija nije pronađena' });
        }

        reservation.status = status;
        await reservation.save();

        // Ako je rezervacija odobrena, ažuriraj vozilo na "reserved"
        if (status === 'approved') {
            const vehicle = await Vehicle.findById(reservation.vehicle);
            vehicle.availabilityStatus = 'reserved';
            await vehicle.save();
        }

        res.json({ message: `Rezervacija ${status}`, reservation });
    } catch (error) {
        res.status(500).json({ message: 'Greška pri ažuriranju statusa rezervacije', error });
    }
});

// Zaposlenik prijavljuje problem ili štetu na vozilu
router.post('/:vehicleId/damage', checkToken, checkRole('employee'), async (req, res) => {
    const { damageDescription } = req.body; // Ovdje pretpostavljamo da će zaposlenik opisati štetu

    if (!damageDescription) {
        return res.status(400).json({ message: 'Opis štete je obavezan' });
    }

    try {
        const vehicle = await Vehicle.findById(req.params.vehicleId);
        if (!vehicle) {
            return res.status(404).json({ message: 'Vozilo nije pronađeno' });
        }

        // Ažuriramo vozilo tako da označimo da ima prijavljenu štetu
        vehicle.damageReported = true; // Pretpostavljamo da postoji ovo polje na modelu Vehicle
        vehicle.damageDescription = damageDescription; // Dodajemo opis štete

        await vehicle.save();

        res.status(200).json({ message: 'Šteta uspješno prijavljena', vehicle });
    } catch (error) {
        res.status(500).json({ message: 'Greška pri prijavi štete', error });
    }
});

// Admin pregledava sve prijavljene kvarove i štetu na vozilima
router.get('/damaged', checkToken, checkRole('admin'), async (req, res) => {
    try {
        const vehiclesWithDamage = await Vehicle.find({ damageReported: true });

        // Ako nema vozila sa štetama
        if (vehiclesWithDamage.length === 0) {
            return res.status(200).json({ message: 'Nema prijavljene štete' });
        }

        res.json(vehiclesWithDamage);
    } catch (error) {
        res.status(500).json({ message: 'Greška pri dohvaćanju vozila s prijavljenom štetom', error });
    }
});

// Admin dodjeljuje drugo vozilo ovisno o raspoloživosti
router.put('/:reservationId/assign', checkToken, checkRole('admin'), async (req, res) => {
    const { vehicleId } = req.body;

    try {
        const reservation = await Reservation.findById(req.params.reservationId);
        if (!reservation) {
            return res.status(404).json({ message: 'Rezervacija nije pronađena' });
        }

        const vehicle = await Vehicle.findById(vehicleId);
        if (!vehicle || vehicle.availabilityStatus !== 'available') {
            return res.status(400).json({ message: 'Vozilo nije dostupno' });
        }

        reservation.vehicle = vehicleId;
        await reservation.save();

        // Ažuriramo status vozila na "rezervirano"
        vehicle.availabilityStatus = 'reserved';
        await vehicle.save();

        res.json({ message: 'Vozilo uspješno dodijeljeno rezervaciji', reservation });
    } catch (error) {
        res.status(500).json({ message: 'Greška pri dodjeli vozila', error });
    }
});

module.exports = router;
