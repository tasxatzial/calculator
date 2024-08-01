# Calculator

A simple calculator that supports the 4 basic operations on decimal numbers and grouping of terms using parentheses.

## Features

* Dark & light theme. The selected theme is restored when the page reloads.
* If the user has not selected a theme, the applied theme is always synchronized with the system theme.
* Calculations are saved in history and can be reloaded.
* History is restored when the page reloads.
* Keyboard input is supported.
* Arbitrary precision calculations with [decimal.js](https://github.com/MikeMcl/decimal.js).

## Implementation

* Accessible + screen reader friendly.
* Variation of the [MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller) pattern (only for inputting expressions, performing calculations, and displaying the results).
* Expressions are calculated with the [Shunting yard algorithm](https://en.wikipedia.org/wiki/Shunting_yard_algorithm).

## Dependencies

The project is written in HTML, CSS, JavaScript.

The following dependencies will be installed via `npm install`:

* [:focus-visible](https://github.com/WICG/focus-visible) polyfill.
* [decimal.js](https://github.com/MikeMcl/decimal.js).

## Run locally

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

## Tests

Vitest is used for testing.

Currently, only a basic set of tests has been written for the basic model operations, such as inputting and calculating expressions.

Run the tests:

```bash
npm run test
```

or, if you prefer access to the browser UI:

```bash
npm run test:ui
```

## Screenshots

See [screenshots](screenshots/).
