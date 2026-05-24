# Navodila za prihodnje delo

Ta projekt je `Moj učni zvezek`, statična spletna aplikacija za vaje iz slovenščine in matematike za prvošolce.

## Lokacije

Glavna lokalna mapa:

```text
/home/luka/Projects/random/Antigravity/Desoldering controller/Učenje za male
```

Javna git kopija za GitHub:

```text
/tmp/ucni-zvezek-public
```

GitHub repozitorij:

```text
https://github.com/LukaGitH/moj-ucni-zvezek
```

GitHub Pages stran:

```text
https://lukagith.github.io/moj-ucni-zvezek/
```

## Pomembno

- Vsako spremembo naredi v glavni lokalni mapi in jo sinhroniziraj tudi v `/tmp/ucni-zvezek-public`.
- Git commit in push delaj iz `/tmp/ucni-zvezek-public`.
- Originalnih fotografij zvezkov iz mape `Slike/` ne nalagaj na GitHub.
- Javna kopija sme vsebovati aplikacijske datoteke, dokumentacijo in javne assete iz `assets/`.
- Če dodaš novo datoteko, preveri, ali mora biti tudi v javni kopiji.

## Tipičen postopek za spremembo

1. Uredi datoteke v glavni lokalni mapi.
2. Kopiraj spremenjene javne datoteke v `/tmp/ucni-zvezek-public`.
3. Preveri sintakso:

```bash
node --check app.js
node --check data.js
```

4. V `/tmp/ucni-zvezek-public` preveri stanje:

```bash
git status --short
git diff
```

5. Commit in push:

```bash
git add .
git commit -m "Kratek opis spremembe"
git push
```

6. Preveri GitHub Pages build:

```bash
gh api repos/LukaGitH/moj-ucni-zvezek/pages/builds/latest
```

## Dokumentacija

Pred večjimi spremembami preberi:

- `README.md`
- `ZAPISNIK.md`
- `PRIVACY.md`

Če sprememba vpliva na uporabo, deploy, zasebnost ali nadaljnji razvoj, posodobi tudi ustrezen `.md`.
