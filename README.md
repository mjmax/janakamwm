# Janaka Madhusankha — Engineering Biography

A biography-first static portfolio for **https://mjmax.github.io/janakamwm/**. The opening follows the supplied white-and-navy reference: identity and education, portrait, four engineering specialties, and five navigation cards. Background and education appear before the detailed engineering work.

## View locally

Open `index.html` in Chrome, or run `npm start` and open http://127.0.0.1:4173/janakamwm/. Refresh with Ctrl+Shift+R after changes. No package installation is required; the server and build use Node.js built-in modules.

## Edit the site

- `index.html`: all biography, education, experience, project, publication, and contact content.
- `biography.css`: reference-style opening and the white-and-navy visual theme.
- `styles.css`: underlying layouts, case studies, galleries, responsive rules, and image viewer.
- `galleries.js`: 63 original images and captions organized by project.
- `app.js`: mobile navigation, image viewer, keyboard controls, and active section indication.
- `assets/original-1.jpg`: existing personal portrait used in the introduction. A formal headshot can replace this reference in the hero image. The image is displayed with CSS cropping; the original bytes are unchanged.

The full Rinstrum section includes T720, X320 Bluetooth, battery management, OPTO22 I/O, production tester updates, and the tilt sensor. Research, robotics, hybrid energy storage, industrial electrical work, internships, academic subjects, publications, and the résumé are included within the page. The T720 aerospace reference and professional/social profiles retain external links.

Original Drive/YouTube videos and documents are embedded. They need internet access and remain subject to the original owners' access settings and host availability. Photographs and diagrams are stored locally. Google Fonts is optional; local fallback fonts are provided.

## Template switch

In `config.js`, set `const PORTFOLIO_TEMPLATE = 1;` for the reference-style horizontal navigation or `4` for the sidebar alternative. Content is shared. Both use compact navigation on smaller screens.

## Check and build

```powershell
npm run check
npm run build
```

The build writes the deployable files to `dist/`. Assets use relative paths for the `/janakamwm/` GitHub Pages project URL.

## Publish

1. Commit and push the files to `master` or `main` in `https://github.com/mjmax/janakamwm.git`.
2. In GitHub, choose **Settings → Pages → Source → GitHub Actions**.
3. The included **Deploy portfolio to GitHub Pages** workflow builds and publishes the site. Rerun it from Actions if Pages was enabled after the first run.
4. The deployment URL is **https://mjmax.github.io/janakamwm/**.

## Sources

Content and original project graphics were taken from the owner's Google Site at https://sites.google.com/view/janakamwm, including its professional experience, research, robotics, undergraduate project, publications, academic standings, and résumé pages. Grammar and spelling were corrected, and content was reorganized for the new layout. The education navigation card uses a photograph of SIU Carbondale’s Altgeld Hall by Devout1145, licensed CC BY-SA 4.0. Attribution and source links appear in the education section and assets/siu-campus-credit.txt.
