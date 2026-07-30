# Udskift version 1 med version 2 uden at miste GitHub-forbindelsen

Den skjulte mappe `.git` i dit nuvaerende projekt forbinder mappen med GitHub. Den skal bevares.

## Sikker metode paa Windows

1. Stop den lokale server med `Ctrl + C`.
2. Lav en kopi af din nuvaerende projektmappe som backup.
3. Pak version 2 ud i en ny, midlertidig mappe.
4. Aabn det nuvaerende repository via GitHub Desktop: Repository -> Show in Explorer.
5. Kopier alt indhold fra version 2 ind i den nuvaerende projektmappe og overskriv filer.
6. Slet ikke den skjulte `.git`-mappe i det nuvaerende repository.
7. Slet disse gamle, genererede elementer, hvis de findes:

```text
node_modules
.next
out
package-lock.json
```

8. Aabn PowerShell i projektmappen og koer:

```powershell
npm install
npm run build
npm run dev
```

9. Naar siden virker, gaa til GitHub Desktop, skriv en commit-besked som `Opgrader til version 2`, klik Commit og derefter Push origin.

Cloudflare skal foerst forbindes efter denne opdatering er pushet til GitHub.
