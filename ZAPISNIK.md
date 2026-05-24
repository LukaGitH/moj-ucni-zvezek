# Zapisnik projekta: Moj učni zvezek

## Cilj

Narediti mirno, jasno in otroku razumljivo spletno aplikacijo za vaje iz slovenščine in matematike za prvošolce.

Aplikacija naj deluje kot interaktiven delovni zvezek:

- ena naloga naenkrat,
- jasna navodila v slovenščini,
- naloge po vzoru fotografij iz zvezkov,
- samostojni sklopi vaj in naključne mešane vaje,
- brez osredotočanja na mobilno aplikacijo v tej fazi.

## Trenutna tehnologija

Projekt je trenutno statična spletna aplikacija:

- `index.html` - struktura zaslonov
- `index.css` - videz aplikacije
- `app.js` - logika aplikacije, meniji, naloge, preverjanje odgovorov
- `data.js` - podatki za naloge
- `assets/` - slike in grafični viri aplikacije

Referenčne fotografije zvezkov niso vključene v javni repozitorij.

Za osnovni deploy ni potreben backend.

## Kaj je že narejeno

- Aplikacija je preimenovana v `Moj učni zvezek`.
- Dodana sta glavna predmeta:
  - Slovenščina
  - Matematika
- Meni je razdeljen po zvezkovnih sklopih.
- Dodane so samostojne vaje in mešane vaje.
- Mešane vaje uporabljajo iste naloge kot samostojni sklopi.
- Dodana je zaščita, da se v mešanih vajah isti tip naloge ne ponovi takoj zaporedoma, kadar je to mogoče.
- Pravilni odgovor samodejno prestavi na naslednjo nalogo po 1.5 sekunde.
- Naloga se po pravilnem odgovoru zaklene, da ne dodeli več zvezdic za isti odgovor.
- Dodan je `.gitignore`, da se lokalne referenčne fotografije ne naložijo po nesreči.

## Podprti tipi nalog

Slovenščina:

- premeči črke in sestavi besedo,
- dopolni manjkajočo črko,
- poveži pare,
- poveži sliko z besedo,
- poveži začetek in konec povedi,
- izberi pravo besedo ob sliki,
- poišči črko v besedah,
- uredi besede v poved,
- določi mesto glasu v besedi,
- preštej zloge.

Matematika:

- preštej in izračunaj,
- primerjaj količine,
- dopolni vzorec,
- dopolni številsko zaporedje,
- poišči par do 10,
- reši računsko zgodbo,
- primerjaj dolžino poti,
- primerjaj težo škatel,
- poveži število s količino,
- številska pot.

## Pregledane vsebine iz fotografij

Pregledane so bile lokalne referenčne fotografije zvezkov.

Iz njih so bili povzeti tipi nalog, ki se pojavljajo v zvezkih. V aplikacijo so bili najprej dodani tipi, ki jih je mogoče dobro preverjati digitalno.

Težje oziroma kasnejše naloge:

- prosti pisni odgovori,
- pripovedovanje ob slikah,
- praktične dejavnosti z realnimi predmeti,
- kompleksne tabele/grafi,
- daljše bralno razumevanje.

## Popravki kakovosti podatkov

Opravljeni so bili popravki dvoumnih ali napačnih primerov:

- `MEČ` je bil popravljen v `MEČA`, ker emoji prikazuje dva meča.
- `UHAN` je bil popravljen v `UHO`, ker emoji prikazuje uho.
- dvoumni pari, kot so `URAR`, `EMU`, `MURI`, `SRNA`, so bili zamenjani z jasnejšimi besedami.
- narečne ali pretežke sopomenke so bile zamenjane z bolj razumljivimi pari.
- popravljena je bila slovnica v računskih zgodbah.
- popravljena je bila napaka pri manjkajoči črki v besedi `DINOZAVER`.
- merjenje je omejeno na tri jasne tipe:
  - najdaljša pot,
  - najkrajša pot,
  - najtežja škatla.

## Preverjanje

Redno uporabljeni preverjanji:

```bash
node --check app.js
node --check data.js
```

Dodatno je bila uporabljena ročna validacija podatkov za:

- manjkajoče črke,
- pravilne odgovore med možnostmi,
- položaje glasov v besedah,
- račune,
- računske zgodbe,
- številska zaporedja.

## Deploy načrt

Ker je aplikacija statična, je najpreprostejši deploy prek GitHub Pages.

Predlagan GitHub repo:

```text
moj-ucni-zvezek
```

Za deploy naj bodo v repozitoriju:

- `index.html`
- `index.css`
- `app.js`
- `data.js`
- `assets/`
- `README.md`
- `ZAPISNIK.md`

Referenčnih fotografij zvezkov ni treba naložiti, ker niso potrebne za delovanje aplikacije.

Predlagani GitHub topics:

```text
slovenian
education
learning-app
kids
first-grade
math
slovenscina
matematika
github-pages
javascript
```

## Naslednji smiselni koraki

- Inicializirati Git repo.
- Ustvariti GitHub repo `moj-ucni-zvezek`.
- Naložiti aplikacijo na GitHub.
- Vklopiti GitHub Pages.
- Nadaljevati z dodajanjem preverjenih nalog v `data.js`.
- Po potrebi kasneje dodati profile otrok in shranjevanje napredka na server.
