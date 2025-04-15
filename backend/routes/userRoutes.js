const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

    const checkCookie = (cookieName) => (req, res, next) => {
        if (!req.cookies || !req.cookies[cookieName]) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
    
        try {
            const decodedToken = jwt.verify(req.cookies[cookieName], 'tajniKljuc');
            req.user = decodedToken;
            next();
        } catch (err) {
            return res.status(401).json({ error: 'Neispravan token' });
        }
    };
    
    const checkToken = (req, res, next) => {
        const authHeader = req.headers['authorization'];
        if (!authHeader) return res.status(403).send('Ne postoji autorizacijsko zaglavlje');
       
        const token = authHeader.split(' ')[1];
        if (!token) return res.status(403).send('Bearer token nije pronađen');
       
        try {
        const decodedToken = jwt.verify(token, 'tajniKljuc');
        req.user = decodedToken;
        console.log('Decoded Token:', decodedToken);
        } catch (err) {
        return res.status(401).send('Neispravni Token');
        }
        return next();
       };

       const checkRole = (role) => (req, res, next) => {
        if (req.user && req.user.userRole === role) {
        next();
        } else {
        res.status(403).send(`Zabranjen pristup - vaša uloga je ${req.user ? req.user.userRole : 'nepoznata'}`);
        }
       };

// Registracija korisnika
const saltRunde = 10;

router.post('/register', async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        const hashPassword = await bcrypt.hash(req.body.password, saltRunde);
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'Korisnik već postoji' });
        }
        const user = new User({
            name,
            email,
            password: hashPassword,
            role,
        });

        await user.save();
        const token = jwt.sign(
            { userId: user._id, role: user.role }, //promjena iz userRole u role
            'tajniKljuc',
            { expiresIn: '1h' }
          );
          
          res.status(201).json({
            message: 'Korisnik uspješno registriran',
            token,
            user: {
              id: user._id,
              name: user.name,
              email: user.email,
              role: user.role
            }
          });
          
    } catch (error) {
        res.status(500).json({ message: 'Greška prilikom registracije', error });
    }
});

// Login korisnika
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if(user && await bcrypt.compare(password, user.password)){
            const token = jwt.sign(
                { userId: user._id, role: user.role }, // promjena iz userRole u role
                'tajniKljuc', 
                { expiresIn: '1h' });
            res.json({ token });
        }
        else {
            res.status(401).send('Neispravni podaci za prijavu');
          }
        } catch (error) {
            res.status(500).send(error.message);
          }
});

// Dobivanje podataka o korisniku (autentifikacija putem tokena)
router.get('/profile', checkToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId); //zar je id a ne user
        if (!user) {
            return res.status(404).json({ message: 'Korisnik nije pronađen' });
        }
        res.json({ name: user.name, email: user.email, role: user.role });
    } catch (error) {
        res.status(500).json({ message: 'Greška pri dohvaćanju podataka', error });
    }
});

router.post('/login-cookie', async (req, res) => {
    try {
    const user = await User.findOne({ email: req.body.email });
    if (user && await bcrypt.compare(req.body.password, user.password)) {
    const token = jwt.sign({ userId: user.name }, 'tajniKljuc', { expiresIn: '1h' });
    
    res.cookie('accessToken', token, {
    httpOnly: true,
    maxAge: 3600000, // 1 sat
    // secure: process.env.NODE_ENV === 'production',
    secure: false // u produkcijskoj verziji mora biti TRUE
    });
    
    res.status(200).send('Prijava uspješna'); 
    } else {
    res.status(401).send('Neispravni podaci za prijavu'); 
    }
    } catch (error) {
    res.status(500).send(error.message); 
    }
    });

    router.get('/ruta-cookie', checkCookie('accessToken'), (req, res) => {
        res.status(200).json({ message: 'Dozvoljen pristup podatku' });
        }); 

        router.get('/zasticena-ruta', checkToken, (req, res) => {
            res.send('Odgovor iz zasticene rute')
               });

router.get('/admin-only', checkToken, checkRole('admin'), (req, res) => { //kada ostane adminov token a employee se prijavi opet radi - POPRAVITI
    res.send('Ovo je podatak samo za admina');
   });

module.exports = router;
