const express = require("express");
const app = express();
const bcrypt = require('bcrypt');
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const cookieParser = require("cookie-parser");
const vrijemeLog = require('./infoVrijeme');
const tipLog = require('./infoTip');
const adresaLog = require('./infoAdresa');
const korisniciRouter = require('./korisnici');

require("dotenv").config();

app.use(cookieParser())
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use('/korisnici', korisniciRouter);

app.use((err, req, res, next) => {
  const odgovor =
  process.env.NODE_ENV === "production" ? "Dogodila se pogreška" : err.stack;
  res.status(500).send(odgovor);
 });
 

//Spajanje na bazu
mongoose.connect('mongodb://127.0.0.1:27017/testBaza', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
 

app.use(vrijemeLog);
app.use(tipLog);
app.use(adresaLog);

/* const infoMid = (req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next(); // Pass control to the next middleware function
 };

 const provjeraMid = (req, res, next) => {
  if (req.body.podatak) {
  next(); // Validacija uspješna, nastavi
  } else {
  res.status(400).send('Zahtjev mora sadržavati "podatak"');
  }
 }; 

 app.use(infoMid); */
 
// Instanca konekcije na bazu
const db = mongoose.connection;

const { Schema } = mongoose;

const korisnikShema = new Schema({
  username: String,
  email: { type: String, unique: true },
  password: String,
  products: [{ type: Schema.Types.ObjectId, ref: 'Proizvod' }]
 });
 


const proizvodSchema = new Schema({
  name: String,
  description: String,
  price: Number,
  owner: { type: Schema.Types.ObjectId, ref: 'Korisnik' }
 });
 
 const Proizvod = mongoose.model('Proizvod', proizvodSchema, "proizvodi");
 
 
const Korisnik = mongoose.model('Korisnik', korisnikShema, "korisnici");

 
const provjeriToken = (req, res, next) => {
  const authZaglavlje = req.headers['authorization'];
  if (!authZaglavlje) return res.status(403).send('Ne postoji autorizacijsko zaglavlje');
 
  const token = authZaglavlje.split(' ')[1];
  if (!token) return res.status(403).send('Bearer token nije pronađen');
 
  try {
  const dekodiraniToken = jwt.verify(token, 'tajniKljuc');
  req.korisnik = dekodiraniToken;
  } catch (err) {
  return res.status(401).send('Neispravni Token');
  }
  return next();
 };
 

 const provjeriUlogu = (uloga) => (req, res, next) => {
  if (req.korisnik && req.korisnik.uloga === uloga) {
  next();
  } else {
  res.status(403).send(`Zabranjen pristup - vaša uloga je ${req.korisnik.uloga} `);
  }
 };
 
 const provjeriCookie = (cookieName) => (req, res, next) => {
  // Provjera postoji li cookie i odgovara li trazenom imenu
  if (req.cookies && req.cookies[cookieName]) {
  // Ako postoji idemo na iduci middleware
  next();
  } else {
  res.status(401).json({ error: 'Unauthorized' });
  }
  };

  
// Upravljanje događajima
db.on('error', (error) => {
    console.error('Greška pri spajanju:', error);
});
db.once('open', function() {
  console.log('Spojeni smo na MongoDB bazu');
});


app.post('/proizvodi', provjeriToken, async (req, res) => {

  const id = req.korisnik.id
  const novi = new Proizvod({
  name: "Test",
  description: "Test proizvod",
  price: 34,
  owner: id
  })
  try{
 
  const korisnik = await Korisnik.findById(id);
  if (!korisnik) {
  return res.status(404).json({ error: 'Ne postoji korisnik' });
  }
 
  const rez = await novi.save()
  console.log(rez)
 
  korisnik.products.push(rez._id); 
  await korisnik.save();
  res.status(201).json({ message: 'Proizvod stvoren', novi });
 
  }catch (error) {
  console.error(error);
  res.status(500).json({ error: 'Server error' });
  }
 
 })
 

app.get('/proizvodi', async (req, res) => {

  const proizvodi = await Proizvod.find({}).populate('owner', {username: 1, email: 1})
  res.json(proizvodi)
 
 })
 
 
 

app.get("/", (req, res) => {
    res.send("Pozdrav od Express poslužitelja!");
   });

   app.get('/zasticena-ruta', provjeriToken, (req, res) => {
    res.send('Odgovor iz zasticene rute')
  });

  app.get('/samo-admin', provjeriToken, provjeriUlogu('admin'), (req, res) => {
    res.send('Ovo je podatak samo za admina');
   });
   
   app.get('/ruta2', provjeriCookie('accessToken'), (req, res) => {
    // Ako je prosao middleware, cookie je ispravan
    res.status(200).json({ message: 'Dozvoljen pristup podatku' });
    });
   
/* app.get("/korisnici", (req, res) => {
    res.send("Popis svih korisnika");
   }); */

/*    app.get('/korisnici', async (req, res) => {
    try {
    const sviKorisnici = await Korisnik.find();
    res.json(sviKorisnici);
    } catch (error) {
    res.status(500).send(error.message);
    }
   }); */

   app.get('/korisnici', async (req, res) => {

    const proizvodi = await Korisnik.find({}).populate('products')
    res.json(proizvodi)
   
   })
   
   
   
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

/*    app.post("/korisnici", async (req, res) => {
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
   }); */
   
   const saltRunde = 10;
 
app.post('/registracija', async (req, res) => {
  try {
    const hashLozinka = await bcrypt.hash(req.body.password, saltRunde);
    const noviKorisnik = new Korisnik({ ...req.body, password: hashLozinka });
    await noviKorisnik.save();
    res.status(201).send('Korisnik uspješno registriran');
  } catch (error) {
    res.status(500).send(error.message);
  }
});
   
/* app.post("/prijava", async (req, res) => {
  try {
  const korisnikBaza = await Korisnik.findOne({ email: req.body.email });
  if (korisnikBaza && await bcrypt.compare(req.body.password, korisnikBaza.password)) {
  const token = jwt.sign(
  { idKorisnika: korisnikBaza.username, uloga: korisnikBaza.role },
  "tajniKljuc",
  { expiresIn: "1h" }
  );
  res.json({ token });
  } else {
  res.status(401).send("Neispravni podaci za prijavu");
  }
  } catch (error) {
  res.status(500).send(error.message);
  }
 }); */

 app.post('/prijava', async (req, res) => {
  try {
  const korisnikBaza = await Korisnik.findOne({ email: req.body.email });
  if (korisnikBaza && await bcrypt.compare(req.body.password, korisnikBaza.password)) {
  const token = jwt.sign({ username: korisnikBaza.username, id: korisnikBaza._id }, 'tajniKljuc', { expiresIn: '1h' });
  res.json({ token });
  } else {
  res.status(401).send('Neispravni podaci za prijavu');
  }
  } catch (error) {
  res.status(500).send(error.message);
  }
 });
 
 
 app.post('/prijavaCookie', async (req, res) => {
  try {
  const korisnikBaza = await Korisnik.findOne({ email: req.body.email });
  if (korisnikBaza && await bcrypt.compare(req.body.password, korisnikBaza.password)) {
  const token = jwt.sign({ idKorisnika: korisnikBaza.username }, 'tajniKljuc', { expiresIn: '1h' });
  
  // Postavljamo JWT token kao cookie u odgovoru
  res.cookie('accessToken', token, {
  httpOnly: true,
  maxAge: 3600000, // 1 sat
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
   
 
   app.get('/ruta', (req, res, next) => {
    try {
    // Dio rute koji može uzrokovati pogrešku
    } catch (err) {
    next(err); // Šaljemo pogrešku na middleware za obradu
    }
   });
   app.get('/async-ruta', async (req, res, next) => {
    try {
    await asinkronaFunkcija() // Asinkroni kôd
    } catch (err) {
    next(err); // Obrada async pogreške
    }
   });
         
   
const PORT = 3000;
  app.listen(PORT, () => {
   console.log(`Server sluša zahtjeve na portu ${PORT}`);
  });

app.use(express.json());
