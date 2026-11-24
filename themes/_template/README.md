# Theme-Vorlage

Ausgangspunkt für eigene NULLRADIX-Themes: Farben in `theme.css`, optional eigener Code in `src/main.tsx`
(hier eine Beispiel-Shell für den Slot `Shell`). Vite baut daraus `dist/`, `nullradix theme pack` macht daraus
eine installierbare `.nullradix`-Datei.

## Schritte

1. **Kopieren**: den Ordner nach `themes/<id>` kopieren (oder an einen beliebigen Ort, siehe unten).
2. **id ändern**: `my-theme` an allen drei Stellen durch die eigene id ersetzen (`^[a-z0-9-]{2,40}$`):
   - `manifest.json` → `id` (dazu `name`, `author`, `version`, `startColor`)
   - `src/main.tsx` → `id` der `ThemeDefinition`
   - `theme.css` → Selektor `[data-theme='my-theme']`
3. **Abhängigkeiten**: `npm install`
4. **Bauen**: `npm run build` → `dist/` mit `main.js`, `manifest.json`, `theme.css` und `assets/`
5. **Packen**: `nullradix theme pack dist` → `<id>-<version>.nullradix` (oder beides auf einmal: `npm run pack`)
6. **Installieren**: in NULLRADIX unter Einstellungen → Darstellung „Theme hochladen“, die `.nullradix`-Datei wählen,
   den Hinweis auf Code bestätigen und das Theme auswählen.

Außerhalb dieses Repos `@nullradix/theme-sdk` in `package.json` von `file:../../sdk` auf einen Pfad
zu einem NULLRADIX-Checkout ändern und in `tsconfig.json` den Eintrag `paths` entfernen bzw. anpassen. Das SDK wird
nur für Typen und den Build gebraucht; zur Laufzeit liefert NULLRADIX React und das SDK selbst (Import-Map).

## Was ein Theme darf

- **Slots**: ersetzt wird nur, was in `slots` der `ThemeDefinition` steht und im Manifest unter `slots` genannt
  ist (z. B. `Shell`, `Button`, `Card`, `page:dashboard`); alles andere bleibt Standard. Die Bausteine
  (`SearchButton`, `BoardSwitcher`, `UsageMeter`, `NavLink`, `Outlet`) und Hooks kommen aus `@nullradix/theme-sdk`.
- **sdkVersion**: semver-Bereich der SDK-Version, gegen die gebaut wurde (z. B. `^1.1`). Passt er nicht zur
  SDK-Version von NULLRADIX, wird das Theme nicht geladen.
- **Fehler**: jeder Slot läuft in einer Error Boundary; bei einem Fehler gilt die Standard-Komponente.
  Mit `?safe-theme` in der Adresse startet NULLRADIX ohne Theme-Code.
- **Netz**: fremde Ressourcen nur über den Proxy `/api/themes/<id>/fetch` (im SDK: `useThemeAsset`,
  `themeAssetUrl`); jede Domain muss in `permissions.network` im Manifest stehen, z. B.
  `"permissions": { "network": ["fonts.example.com"] }`. In `theme.css` keine `@import` oder `url(http…)`.

## Reines CSS-Theme

Ohne Code: in `manifest.json` `slots` weglassen, `manifest.json`, `theme.css` (und ggf. `assets/`) in einen
eigenen Ordner legen und diesen packen: `nullradix theme pack <ordner>`. Der Ordner darf nur Paketdateien
enthalten – `README.md`, `.gitignore` oder `src/` würden beim Packen abgelehnt.
