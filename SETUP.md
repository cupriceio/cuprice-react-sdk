# Setup Guide

This guide will help you set up and build the Cuprice React SDK.

## Prerequisites

- Node.js 16+ 
- npm, yarn, or pnpm

## Installation

1. Install dependencies:

```bash
npm install
```

## Development

To build the SDK:

```bash
npm run build
```

This will create the `dist` folder with:
- `index.js` (CommonJS)
- `index.esm.js` (ES Modules)
- `index.d.ts` (TypeScript definitions)
- `index.css` (Styles)

To watch for changes during development:

```bash
npm run dev
```

## Publishing to npm

1. **Log in to npm** (if needed):
   ```bash
   npm login
   ```
   Use your npm account with permission to publish under the `@cuprice` scope.

2. **Bump version** in `package.json` (e.g. `1.2.0` → `1.3.0` for changes).

3. **Build**:
   ```bash
   npm run build
   ```

4. **Publish** (scoped package requires `--access public`):
   ```bash
   npm publish --access public
   ```

5. Consumers install with: `npm install @cuprice/react-sdk`

## Project Structure

```
cuprice-react-sdk/
├── src/
│   ├── components/
│   │   ├── CupricePricing.tsx    # Main component
│   │   ├── PricingCard.tsx        # Individual plan card
│   │   └── CustomPlanModal.tsx    # Custom plan builder modal
│   ├── types.ts                   # TypeScript type definitions
│   ├── utils.ts                   # Utility functions
│   ├── styles.css                 # Component styles
│   └── index.ts                   # Main export file
├── example/
│   └── App.tsx                    # Example usage
├── dist/                          # Build output (generated)
├── package.json
├── tsconfig.json
├── rollup.config.js
└── README.md
```

## Testing Locally

To test the SDK in another project before publishing:

1. Build the SDK: `npm run build`
2. In your test project, install the local package:
   ```bash
   npm install /path/to/cuprice-react-sdk
   ```
3. Import and use:
   ```tsx
   import { CupricePricing } from '@cuprice/react-sdk';
   ```

## Notes

- The SDK uses React 16.8+ (hooks)
- CSS is automatically included via PostCSS
- All styles use CSS variables for theming
- The component is fully self-contained and doesn't require external CSS frameworks

