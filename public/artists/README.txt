BILLEDER OG MAPPER

Hver kunstner har denne struktur:

kunstner-1/
  portrait.jpg
  artworks/
    01-titel-paa-vaerket.jpg
    02-et-andet-vaerk.jpg

Navnet paa kunstnerens mappe skal passe med slug-feltet i data/artists.json.
Portraetbilledets filnavn skal passe med portrait-feltet i data/artists.json.

Understoettede galleriformater:
.jpg, .jpeg, .png, .webp, .avif og .gif

Filnavnet bliver automatisk brugt som titel i galleriet. Eksempel:
01-stille-landskab.jpg bliver vist som "Stille landskab".

Efter nye billeder er tilfoejet, koeres:
npm run build

Cloudflare koerer automatisk denne kommando efter hvert push til GitHub.
