# Abdelhamid Adel — Data Engineer Portfolio
## Quick start (static — no install)

Open `index.html` in a browser, or serve locally:

```bash
npx serve .
# or: python -m http.server 8080
```

Deploy the repo root to **Vercel**, **Netlify**, or **GitHub Pages** (static).

### GitHub Pages ([AbdelhamidAdel.github.io](https://github.com/AbdelhamidADel/AbdelhamidAdel.github.io))

This portfolio is meant to live at **https://abdelhamidadel.github.io/** — push these paths to the `main` branch of `AbdelhamidADel/AbdelhamidAdel.github.io`:

```
index.html
css/
js/
assets/
```



## Next.js app (optional)

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production build

```bash
npm run build
npm start
```

Deploy to Vercel: connect the repo and use default Next.js settings.

## Structure

```
index.html          # Static cinematic portfolio (primary)
css/temple.css      # Design system & layout
js/temple.js        # Canvas, interactions, motion
index.legacy.html   # Previous version (reference)
src/                # Next.js React app (same content)
```

## Content updates

When CV / case study PDFs are available, update copy in `index.html` and `src/data/content.ts`.
