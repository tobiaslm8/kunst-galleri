# Udgiv Version 2.2 på Cloudflare Pages

Denne guide tager udgangspunkt i, at du allerede har:

- en GitHub-konto
- GitHub Desktop
- et GitHub-repository med navnet `kunst-galleri`
- adgang til Cloudflare Pages

## 1. Test den nye mappe lokalt

Åbn Version 2.2-mappen i VS Code.

Åbn **Terminal → New Terminal**, og kør:

```powershell
npm run dev
```

Åbn:

```text
http://localhost:3000
```

Stop serveren med `Ctrl + C`, og test derefter produktionsbuildet:

```powershell
npm run build
```

Fortsæt kun, hvis der står:

```text
Kunstgalleriet er bygget uden fejl.
```

## 2. Kopiér Version 2.2 ind i GitHub-mappen

GitHub Desktop overvåger din eksisterende mappe `kunst-galleri`.

1. Luk den lokale server med `Ctrl + C`.
2. Åbn Version 2.2-mappen i Stifinder.
3. Markér alt med `Ctrl + A` og kopiér med `Ctrl + C`.
4. Åbn den mappe, GitHub Desktop overvåger via **Repository → Show in Explorer**.
5. Slet det gamle projektindhold, men slet **ikke** den skjulte mappe `.git`.
6. Indsæt Version 2.2-filerne med `Ctrl + V`.

## 3. Commit og push

Åbn GitHub Desktop.

Skriv som Summary:

```text
Opgrader til Version 2.2
```

Klik derefter:

1. **Commit to main**
2. **Push origin**

## 4. Cloudflare Pages-indstillinger

Gå til dit Pages-projekt og vælg **Settings → Builds & deployments**.

Brug præcis disse værdier:

```text
Framework preset: None
Production branch: main
Build command: npm run build
Build output directory: out
Root directory: lad feltet være tomt
```

Der skal ikke stå `Next.js`, `Next.js (Static HTML Export)` eller `.next`.

## 5. Hjemmesideadressen

Projektet bruger som standard:

```text
https://kunst-galleri.pages.dev
```

Hvis Cloudflare har givet projektet en anden adresse, kan du enten:

- rette feltet `url` i `data/site.json`, eller
- oprette build-variablen `SITE_URL` i Cloudflare med den rigtige adresse.

Eksempel:

```text
SITE_URL=https://din-rigtige-adresse.pages.dev
```

Ved eget domæne bruges:

```text
SITE_URL=https://ditdomaene.dk
```

## 6. Start et nyt deployment

Et nyt push til GitHub starter normalt deployment automatisk.

Ellers vælger du det seneste deployment og klikker **Retry deployment**.

Et vellykket build viser blandt andet:

```text
Kunstgalleriet er bygget uden fejl.
```

og Cloudflare udgiver mappen `out`.

## Fremtidige ændringer

Arbejdsgangen er fremover:

1. Rediger `data/artists.json`, `data/site.json` eller billederne.
2. Test med `npm run dev`.
3. Test med `npm run build`.
4. Commit i GitHub Desktop.
5. Push origin.
6. Cloudflare opdaterer hjemmesiden automatisk.
