# Moj učni zvezek

Statična učna aplikacija za prvošolce z vajami iz slovenščine in matematike.

Trenutna smer je "delovni zvezek, ki je interaktiven": jasna navodila, ena naloga naenkrat, mirnejši videz in vaje po vzoru fotografij iz zvezka.

## Spletna verzija

Aplikacija je objavljena prek GitHub Pages:

https://lukagith.github.io/moj-ucni-zvezek/

## Zagon

Odpri `index.html` v brskalniku ali zaženi preprost lokalni strežnik:

```bash
python3 -m http.server 8000
```

Nato odpri:

```text
http://localhost:8000
```

## Struktura

- `index.html` - osnovna stran in zasloni aplikacije
- `index.css` - videz aplikacije
- `data.js` - besede, pari, glasovi in matematične naloge
- `app.js` - logika menijev, nalog, preverjanja in točkovanja
- `assets/` - javne slike in grafični viri aplikacije
- `PRIVACY.md` - kratek opis zasebnosti

Fotografije zvezkov niso vključene v javni repozitorij.

## Preverjanje

Pred objavo preveri sintakso:

```bash
node --check app.js
node --check data.js
```

Ker je aplikacija statična, za osnovno delovanje ni potreben build korak.

## Dodajanje vaj

Najprej dodaj vsebino v `data.js`, nato jo uporabi v ustreznem rendererju v `app.js`.

Primeri vaj iz zvezka, ki jih aplikacija že podpira ali jih je smiselno širiti:

- poveži besede z enakim pomenom
- poveži sliko z besedo
- poveži zapis črk z zlogom
- označi pravo besedo ob sliki
- poišči besede, kjer nastopa določena črka
- premeči črke in sestavi besedo
- označi, kje v besedi slišiš določen glas
- dopolni manjkajočo črko
- preštej, primerjaj in nadaljuj vzorec

Mešane vaje uporabljajo isti seznam nalog kot samostojne vaje, zato se nove samostojne vaje samodejno pojavijo tudi v naključnem načinu.
