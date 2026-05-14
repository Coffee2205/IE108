# IE108

Static frontend for the football pitch booking and match-making project.

## Structure

- `static/index.html` - component shell
- `static/components/` - HTML partials for each UI section
- `static/assets/css/` - base and component CSS files
- `static/assets/js/script.js` - component loader and interactions

## Run locally

- `npm run start` - serve the `static/` folder locally
- `npm run check` - syntax-check the JavaScript

If you want a quick one-off server without npm scripts, you can also use:

```bash
npx http-server static
```

## Notes for contributors

- The project is HTML, CSS and vanilla JavaScript only.
- No React, Vue, Angular, backend, or database is used.
- The UI is split into reusable partials to keep sections maintainable.
- Use GitHub SSH for cloning and pushing:

```bash
git clone git@github.com:Coffee2205/IE108.git
```

Node.js 18+ is recommended.
