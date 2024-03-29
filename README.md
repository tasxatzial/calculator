# Calculator

A simple calculator that supports the 4 basic operations on decimal numbers and grouping of terms using parentheses.

## Features

* Dark & light theme. The selected theme is restored when the page reloads.
* If the user has not selected a theme, the applied theme is always synchronized with the system theme.
* Calculations are saved in history and can be reloaded.
* History is restored when the page reloads.

## Implementation

* Responsive.
* Accessible + screen reader friendly.
* Variation of the [MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller) pattern.

## Dependencies

The project is written in HTML, CSS, JavaScript.

The following dependencies will be installed via `npm install`:

* [:focus-visible](https://github.com/WICG/focus-visible) polyfill.
* [decimal.js](https://github.com/MikeMcl/decimal.js).

## Run locally

Install the required dependencies:

```bash
npm install
```

Run the development version:

```bash
npm run dev
```

Build the project:

```bash
npm run build
```

Build & serve the production version:

```bash
npm run serve
```

## Screenshots

See [screenshots](screenshots/).
