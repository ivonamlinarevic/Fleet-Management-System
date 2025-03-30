# Fleet-Management-System

Aplikacija za upravljanje voznim parkom. Sustav omogućava zaposlenicima da putem web sučelja zatraže korištenje službenih vozila za određene periode i svrhe, dok administratori voznog parka imaju uvid u sve zahtjeve, upravljaju resursima i odobravaju ili odbijaju rezervacije.

U skorije vrijeme biti će dostupne osnovne funkcionalnosti, kao i dodatne.

## Pokretanje aplikacije

```sh
cd frontend
npm run dev
cd backend
npm run start
```

## Uloge u sustavu

### Zaposlenik

- Može podnijeti zahtjev za rezervaciju vozila (ili tipa vozila) za određeni vremenski period i svrhu.
- Ima uvid u svoje prethodne i aktivne rezervacije (i u kojem su statusu).
- Može otkazati svoju rezervaciju sve dok ne započne rezervirani period korištenja.
- Ima mogućnost prijave problema ili štete na vozilu. (Prijava se vrši putem posebne forme/post zahtjeva.)
- Nakon početka rezerviranog termina, zaposlenik više ne može mijenjati/uređivati rezervaciju.

### Administrator voznog parka

- Pregledava i upravlja svim zahtjevima za rezervaciju (odobravanje ili odbijanje).
- Dodjeljuje konkretno vozilo (automobil, kombi, drugo) određenom zahtjevu, ovisno o raspoloživosti.
- Ima uvid u cjelokupni vozni park te može uređivati informacije o dostupnosti, statusu vozila i drugim relevantnim podacima.
- Može pregledavati prijave štete, kvarova i drugih problema.

## Osnovne funkcionalnosti

### Za Zaposlenike

- Kreiranje zahtjeva za rezervaciju: Unos željenog vremena korištenja, svrhe putovanja i preferiranog tipa vozila.
- Pregled rezervacija: Pregled prethodnih i aktualnih zahtjeva te njihovih statusa.
- Otkazivanje rezervacija: Mogućnost otkazivanja dok rezervirani period još nije započeo.
- Prijava problema/štete: Jednostavan obrazac za prijavu bilo kakvih poteškoća s vozilom.

### Za Administratore

- Upravljanje zahtjevima: Odobravanje ili odbijanje rezervacija.
- Dodjeljivanje vozila: Dodjela konkretnog vozila uzimajući u obzir raspoloživost i potrebe.
- Upravljanje voznim parkom: Pregled, uređivanje i promjena statusa vozila (npr. označavanje vozila nedostupnim, vrijeme tehničkog pregleda, sl.).
- Pregled prijava šteta/kvarova: Evidencija i rješavanje prijavljenih problema.

## Dodatne funkcionalnosti

- Prikazi u obliku kalendara: Omogućiti lakši pregled zauzeća vozila po datumima.
- Filteri po vozilu: Omogućiti filtriranje zahtjeva i rezervacija po određenom vozilu.
- Dodatne administratorske izmjene: Omogućiti masovne promjene, dodavanje novih vozila, podešavanje podsjetnika.
- Statusi vozila i nedostupnost: Administrativne oznake vozila koja su trenutačno nedostupna zbog servisa ili drugog razloga.
- Podsjetnici za tehničke preglede: Notifikacije administratorima kada se bliži termin tehničkog pregleda određenog vozila.
