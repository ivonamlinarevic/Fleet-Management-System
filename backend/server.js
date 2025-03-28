const express = require("express");
const app = express();

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

const mongoose = require('mongoose');
//Spajanje na bazu
mongoose.connect('mongodb://127.0.0.1:27017/testBaza', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
 
// Instanca konekcije na bazu
const db = mongoose.connection;

const { Schema } = mongoose;
const korisnikShema = new Schema({
  ime: String,
  godine: Number,
  email: { type: String, required: true },
});

const Korisnik = mongoose.model('Korisnik', korisnikShema, "korisnici");

 
// Upravljanje događajima
db.on('error', (error) => {
    console.error('Greška pri spajanju:', error);
});
db.once('open', function() {
  console.log('Spojeni smo na MongoDB bazu');
});

app.get("/", (req, res) => {
    res.send("Pozdrav od Express poslužitelja!");
   });

/* app.get("/korisnici", (req, res) => {
    res.send("Popis svih korisnika");
   }); */

   app.get('/korisnici', async (req, res) => {
    try {
    const sviKorisnici = await Korisnik.find();
    res.json(sviKorisnici);
    } catch (error) {
    res.status(500).send(error.message);
    }
   });
   
   
app.get("/trazi", (req, res) => { //query string
    let parametar = req.query.broj;
    res.send(`Rezultati za parametar: ${parametar}`);
   });

   // http://localhost:3000/trazi?broj=5

/* app.get('/korisnici/:id', (req, res) => { // path parameters
    let userId = req.params.id;
    res.send(`Informacije o korisniku sa ID: ${userId}`);
   }); */

   app.get('/korisnici/:id', async (req, res) => {
    const idKor = req.params.id
    try {
    const korisnik = await Korisnik.findById(idKor);
    if (!korisnik) {
    return res.status(404).send('Korisnik ne postoji');
    }
    res.json(korisnik);
    } catch (error) {
    res.status(500).send(error.message);
    }
   });
   

/*    app.post('/korisnici', (req, res) => {
    res.send('Stvoren je novi korisnik');
   }) */;
   
/* app.post('/korisnici', (req, res) => {
    let korisnik = req.body
    // Logika stvaranja novog korisnika - npr. spremanje u bazu
    res.send(`Stvoren je novi korisnik imena ${korisnik.ime}` );
   }); */

   app.post("/korisnici", async (req, res) => {
    const noviKorisnik = new Korisnik({
    ime: "Tea",
    godine: 30,
    email: "tea@pmfst.hr",
    });
    try {
    await noviKorisnik.save();
    res.send("Korisnik spremljen u bazu");
    } catch (error) {
    res.status(500).send(error.message);
    }
   });
   
   
/* app.put('/korisnici/:id', (req, res) => {
    let idKorisnika = req.params.id;
    let noviPodaci = req.body;
    // Logika osvježavanja podataka za korisnika s tim ID-om
    res.send(`Podaci korisnika ID:${idKorisnika} su ažurirani`);
   }); */

   app.put('/korisnici/:id', async (req, res) => {
    try {
    const korisnik = await Korisnik.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!korisnik) {
    return res.status(404).send('Korisnik ne postoji');
    }
    res.json(korisnik);
    } catch (error) {
    res.status(500).send(error.message);
    }
   });
   
   
app.patch('/korisnici/:id', (req, res) => {
    let idKorisnika = req.params.id;
    let noviPodaci = req.body;
    // Logika djelomičnog osvježavanja podataka za korisnika s tim ID-om
    res.send(`Podaci korisnika ID:${idKorisnika} su ažurirani`);
   });
   
/* app.delete('/korisnici/:id', (req, res) => {
    let idKorisnika = req.params.id;
    // Logika brisanja korisnika sa zadanim ID-om
    res.send(`Korisnik ID: ${userId} je izbrisan`);
   });
    */

   app.delete('/korisnici/:id', async (req, res) => {
    try {
    const korisnik = await Korisnik.findByIdAndDelete(req.params.id);
    if (!korisnik) {
    return res.status(404).send('Korisnik ne postoji');
    }
    res.send('Korisnik izbrisan');
    } catch (error) {
    res.status(500).send(error.message);
    }
   });
   
   
const PORT = 3000;
  app.listen(PORT, () => {
   console.log(`Server sluša zahtjeve na portu ${PORT}`);
  });

app.use(express.json());
