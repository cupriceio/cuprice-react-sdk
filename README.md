# @cuprice/react-sdk

A React SDK for embedding Cuprice pricing tables in your application. This SDK provides a seamless way to display your pricing plans without using iframes.

## Installation

```bash
npm install @cuprice/react-sdk
# or
yarn add @cuprice/react-sdk
# or
pnpm add @cuprice/react-sdk
```

## Quick Start

```tsx
import { CupricePricing } from '@cuprice/react-sdk';
// Styles are automatically included, but you can import them explicitly if needed:
// import '@cuprice/react-sdk/dist/index.css';

function App() {
  return (
    <CupricePricing 
      shareId="your-share-id-here"
      apiUrl="https://your-api-domain.com" // Optional: defaults to current origin
      onPlanSelect={(plan) => {
        console.log('Plan selected:', plan);
        // Handle plan selection (e.g., redirect to checkout)
      }}
      onCustomPlanClick={() => {
        console.log('Custom plan clicked');
        // Handle custom plan modal open
      }}
      onCustomPlanSubscribe={(features, userCount, duration) => {
        console.log('Custom plan subscribe:', { features, userCount, duration });
        // Handle custom plan subscription
      }}
    />
  );
}
```

## Props

### `CupricePricing`

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `shareId` | `string` | Yes | The share ID of your pricing project |
| `apiUrl` | `string` | No | Base URL for the API. Defaults to `window.location.origin` |
| `onPlanSelect` | `(plan: SharedPlan) => void` | No | Callback when a pricing plan is selected |
| `onCustomPlanClick` | `() => void` | No | Callback when the custom plan button is clicked |
| `onCustomPlanSubscribe` | `(features: string[], userCount: number, duration: string) => void` | No | Callback when user subscribes to a custom plan |
| `className` | `string` | No | Additional CSS classes to apply to the root element |

## Features

- ✅ **No iframe required** - Direct React component integration
- ✅ **Fully customizable** - Supports theme settings from your Cuprice dashboard
- ✅ **TypeScript support** - Full type definitions included
- ✅ **Responsive design** - Works on all screen sizes
- ✅ **Annual/Monthly toggle** - Automatic discount calculations
- ✅ **Custom plan builder** - Built-in modal for custom plan creation
- ✅ **Accessible** - WCAG compliant with proper ARIA labels

## Styling

The SDK uses CSS variables for theming. You can override these variables in your application:

```css
.cuprice-pricing {
  --base-primary: #298558;
  --base-primary-foreground: #FAFAFA;
  --pricing-button-text: #FAFAFA;
  --custom-plan-button-bg: #298558;
  --custom-plan-button-text: #FAFAFA;
  --popular-badge-border: #16A34A;
  --popular-badge-bg: #22C55E;
  --popular-badge-text: #FFFFFF;
}
```

Theme settings from your Cuprice dashboard will automatically be applied.

## API Requirements

The SDK expects your API to have an endpoint at:

```
GET /api/share/{shareId}
```

This endpoint should return a JSON object matching the `SharedProject` type. See the types section for details.

## Types

The SDK exports the following TypeScript types:

```typescript
import type {
  SharedProject,
  SharedPlan,
  Feature,
  PlanFeature,
  Currency,
  ThemeSettings,
  CupricePricingProps,
} from '@cuprice/react-sdk';
```

## Examples

### Basic Usage

```tsx
import { CupricePricing } from '@cuprice/react-sdk';

function PricingPage() {
  return <CupricePricing shareId="abc123" />;
}
```

### With Custom Handlers

```tsx
import { CupricePricing } from '@cuprice/react-sdk';
import { useRouter } from 'next/router';

function PricingPage() {
  const router = useRouter();

  const handlePlanSelect = (plan) => {
    // Redirect to checkout with plan ID
    router.push(`/checkout?planId=${plan.id}`);
  };

  const handleCustomSubscribe = (features, userCount, duration) => {
    // Create custom plan and redirect
    router.push(`/checkout?custom=true&features=${features.join(',')}`);
  };

  return (
    <CupricePricing
      shareId="abc123"
      onPlanSelect={handlePlanSelect}
      onCustomPlanSubscribe={handleCustomSubscribe}
    />
  );
}
```

### With Custom API URL

```tsx
import { CupricePricing } from '@cuprice/react-sdk';

function PricingPage() {
  return (
    <CupricePricing
      shareId="abc123"
      apiUrl="https://api.example.com"
    />
  );
}
```

## Development

To build the SDK locally:

```bash
npm install
npm run build
```

To watch for changes during development:

```bash
npm run dev
```

## License

MIT

## Support

For issues and questions, please visit [https://cuprice.io](https://cuprice.io) or open an issue on GitHub.

