# EJS Partial Builder

A minimal Node.js + TypeScript project that uses EJS to compile small template partials into HTML fragments — designed to be consumed by Vite (or any other bundler).

## Project Structure

```
_ejs/
├── ejs.ts                 ← Builder script + view definitions
├── src/
│   ├── templates/
│   │   ├── partials/          ← Small reusable EJS snippets
│   │   │   ├── nav.ejs           (accepts: links[])
│   │   │   ├── hero.ejs          (accepts: heading, subheading?)
│   │   │   ├── card.ejs          (accepts: title, description, tags?)
│   │   │   ├── card-grid.ejs     (accepts: sectionTitle, items[] — includes card.ejs)
│   │   │   └── footer.ejs        (accepts: siteName)
│   │   └── sections/          ← Section templates that compose partials
│   │       ├── home.ejs          → center.html
│   │       ├── about.ejs         → up.html
│   │       ├── projects.ejs      → right.html
│   │       ├── contact.ejs       → down.html
│   │       └── services.ejs      → left.html
│   └── views/                 ← Output: HTML partials for Vite
│       ├── center.html
│       ├── up.html
│       ├── right.html
│       ├── down.html
│       └── left.html
├── tsconfig.json
└── package.json
```

## How It Works

1. **Partials** (`src/templates/partials/`) — tiny EJS snippets that each do one thing. They accept data via EJS variables.

2. **Sections** (`src/templates/sections/`) — compose partials using `<%- include('../partials/name', data) %>`. Each section becomes one HTML output file.

3. **Config** — view definitions live at the top of `ejs.ts`: which template, what data to pass, and the output filename.

4. **Builder** — the bottom half of `ejs.ts` loops through the config, renders each view, and writes HTML to `src/views/`.

## Setup

```bash
npm install
```

## Scripts

| Script        | Command          | What it does                              |
| ------------- | ---------------- | ----------------------------------------- |
| `npm run ejs` | `npx tsx ejs.ts` | Renders EJS templates → HTML in src/views |

## EJS Syntax Reference

| Syntax                       | Purpose                           | Example                                    |
| ---------------------------- | --------------------------------- | ------------------------------------------ |
| `<%- include(path, data) %>` | Compose partials (unescaped HTML) | `<%- include('../partials/card', item) %>` |
| `<%= variable %>`            | Output escaped text               | `<%= title %>`                             |
| `<%- variable %>`            | Output unescaped HTML             | `<%- content %>`                           |
| `<% code %>`                 | Run JS (loops, conditionals)      | `<% items.forEach(...) %>`                 |
| `typeof x !== 'undefined'`   | Optional variables                | `<% if (typeof tags !== 'undefined') %>`   |
| `{ filename }` option        | Required for `include()` to work  | Set in `ejs.render()` options              |

## Adding a New View

1. Create partials in `src/templates/partials/` if needed
2. Create a section in `src/templates/sections/` that composes them with `<%- include() %>`
3. Add an entry to the `views` array in `ejs.ts` with the template name, output filename, and data
4. Run `npm run ejs`

---

## Integrating into an Existing Vite Project

EJS runs as a **standalone Node script** that reads `.ejs` templates and writes `.html` files. Vite never touches EJS — it just consumes the generated HTML as static assets. They share a filesystem, not a process.

### Steps

#### 1. Install dependencies

```bash
npm install -D ejs @types/ejs
```

`tsx` is called via `npx` so it resolves from the global cache or local install.

#### 2. Create the builder script

Copy `views.ejs.ts` into your project root (or an `_ejs/` subfolder). Adapt the two path constants to match your project layout:

```ts
const viewsTemplateDir = path.join(__dirname, "src", "views");        // where your .ejs sections live
const outputDir        = path.join(__dirname, "src", "views", "out"); // where generated .html lands
```

#### 3. Define your views array

Populate the `views` config with entries matching your EJS sections:

```ts
const views: ViewDefinition[] = [
  { template: "center.ejs", output: "center.html", data: { sectionTitle: "CenterStage" } },
  { template: "up.ejs",     output: "up.html",     data: { sectionTitle: "UpStage" } },
  { template: "right.ejs",  output: "right.html",  data: { sectionTitle: "StageRight", items: [...] } },
  { template: "down.ejs",   output: "down.html",   data: { sectionTitle: "DownStage" } },
  { template: "left.ejs",   output: "left.html",   data: { sectionTitle: "StageLeft" } },
];
```

#### 4. Add npm scripts

```json
"scripts": {
  "ejs": "npx tsx views.ejs.ts",
  "dev": "vite",
  "build": "npm run ejs && tsc && vite build"
}
```

- `npm run ejs` — runs EJS independently, any time you edit templates
- `npm run build` — chains EJS → TypeScript → Vite so production builds always get fresh HTML
- `npm run dev` — Vite dev server stays untouched

#### 5. Consume the generated HTML from Vite

Import the compiled HTML as raw strings:

```ts
import center from "./views/out/center.html?raw";
import up     from "./views/out/up.html?raw";
// ...
document.querySelector("main")!.innerHTML = center;
```

Or use custom Vite plugins to inject the generated HTML — either way, Vite just reads the `.html` files the EJS script already wrote.

#### 6. Gitignore the output (optional but recommended)

Add the generated HTML directory to `.gitignore` since they're build artifacts:

```
src/views/out/
```

#### 7. Workflow

| Task           | Command         | What runs                      |
| -------------- | --------------- | ------------------------------ |
| Edit templates | `npm run ejs`   | EJS only — regenerates HTML    |
| Dev server     | `npm run dev`   | Vite only — serves the app     |
| Full build     | `npm run build` | EJS → tsc → Vite (chained)    |

