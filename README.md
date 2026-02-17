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

