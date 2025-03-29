const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
 res.send('Popis korisnika');
});

router.get('/:id', (req, res) => {
 res.send('Korisnik :id');
});

router.post('/', (req, res) => {
 res.send('Stvori korisnika');
});

module.exports = router;
