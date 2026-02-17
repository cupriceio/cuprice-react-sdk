# @cuprice/react-sdk

A React SDK for embedding Cuprice pricing tables in your application. This SDK provides a seamless way to display your pricing plans without using iframes, with full support for all Cuprice dashboard features including usage-based pricing, limits, custom themes, and more.

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
      onCustomPlanSubscribe={(features, userCount, duration, featureUsageAmounts) => {
        console.log('Custom plan subscribe:', { 
          features, 
          userCount, 
          duration,
          featureUsageAmounts // Usage amounts for usage-based/limits features
        });
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
| `onCustomPlanSubscribe` | `(features: string[], userCount: number, duration: string, featureUsageAmounts?: Record<string, number>) => void` | No | Callback when user subscribes to a custom plan. Includes usage amounts for usage-based/limits features |
| `className` | `string` | No | Additional CSS classes to apply to the root element |

## Features

- ✅ **No iframe required** - Direct React component integration
- ✅ **Fully customizable** - Supports all theme settings from your Cuprice dashboard
- ✅ **TypeScript support** - Full type definitions included
- ✅ **Responsive design** - Works on all screen sizes
- ✅ **Annual/Monthly toggle** - Automatic discount calculations with smooth animations
- ✅ **Custom plan builder** - Built-in modal for custom plan creation
- ✅ **Usage-based pricing** - Support for usage-based and limits feature types
- ✅ **Real-time price calculation** - Dynamic pricing updates as users adjust usage amounts
- ✅ **Custom CSS support** - Inject custom CSS with automatic scoping
- ✅ **Theme customization** - 20+ theme settings including colors, fonts, borders, and more
- ✅ **Loading states** - Built-in loading indicators for better UX
- ✅ **Accessible** - WCAG compliant with proper ARIA labels and keyboard navigation
- ✅ **Price animations** - Smooth transitions when switching between monthly/annual pricing

## Theme Settings

The SDK supports all theme settings from your Cuprice dashboard. These are automatically applied when configured in your dashboard:

### Color Settings

- `primaryColor` - Primary brand color (buttons, badges, etc.)
- `hoverColor` - Hover state color for buttons
- `buttonTextColor` - Text color for buttons
- `pricingBackgroundColor` - Background color for pricing cards
- `pricingBorderColor` - Border color for pricing cards (supports gradients)
- `pricingHeaderBackgroundColor` - Page background color
- `pricingHeaderTextColor` - Project name text color
- `pricingDescriptionColor` - Description text color
- `pricingPriceColor` - Price text color
- `pricingTextColor` - General text color
- `popularBadgeColor` - Popular badge background color
- `popularBadgeBorderColor` - Popular badge border color
- `popularBadgeTextColor` - Popular badge text color
- `customPlanButtonColor` - Custom plan button background color
- `customPlanButtonTextColor` - Custom plan button text color
- `customPlanCardButtonColor` - Custom plan card button color
- `customPlanCardButtonTextColor` - Custom plan card button text color
- `customPlanCardBackgroundColor` - Custom plan card background color
- `customPlanCardBorderColor` - Custom plan card border color
- `customPlanCardBorderWidth` - Custom plan card border width

### Other Settings

- `fontFamily` - Custom font family
- `customPlanCardFontFamily` - Font family for custom plan card
- `borderRadius` - Border radius for cards and buttons (0-50px)
- `customCSS` - Custom CSS code (automatically scoped to prevent conflicts)
- `showProjectName` - Show/hide project name (boolean)
- `showPricingHeader` - Show/hide pricing header/description (boolean)

### Example Theme Configuration

Theme settings are configured in your Cuprice dashboard and automatically applied. The SDK respects all settings including:

```typescript
{
  fontFamily: "Inter",
  primaryColor: "#298558",
  hoverColor: "#1a5a3a",
  borderRadius: "10",
  pricingBackgroundColor: "#FFFFFF",
  pricingBorderColor: "#E5E5E5",
  customCSS: ".cuprice-pricing-card { box-shadow: 0 4px 6px rgba(0,0,0,0.1); }",
  showProjectName: true,
  showPricingHeader: true,
  // ... and more
}
```

## Styling

The SDK uses CSS variables for theming. You can override these variables in your application:

```css
.cuprice-pricing-container {
  --base-primary: #298558;
  --base-primary-hover: #1a5a3a;
  --base-primary-foreground: #FAFAFA;
  --pricing-button-text: #FAFAFA;
  --custom-plan-button-bg: #298558;
  --custom-plan-button-text: #FAFAFA;
  --popular-badge-border: #16A34A;
  --popular-badge-bg: #22C55E;
  --popular-badge-text: #FFFFFF;
  --pricing-border-radius: 10px;
  --base-card: #FFFFFF;
  --pricing-card-background: #FFFFFF;
  --pricing-border-color: #E5E5E5;
  --pricing-page-background: #FFFFFF;
  --pricing-header-text-color: #737373;
  --pricing-description-color: #0A0A0A;
  --pricing-price-color: #0A0A0A;
  --pricing-text-color: #0A0A0A;
  --base-foreground: #0A0A0A;
}
```

Theme settings from your Cuprice dashboard will automatically be applied and override these defaults.

### Custom CSS

You can inject custom CSS through the dashboard's theme settings. The SDK automatically:
- Scopes all CSS rules to `.cuprice-pricing-container` to prevent conflicts
- Adds `!important` to all properties to ensure they override inline styles
- Preserves `@media` queries and other CSS features

Example custom CSS:
```css
.cuprice-pricing-card {
  transform: scale(1.02);
  transition: transform 0.2s ease;
}

.cuprice-pricing-card:hover {
  transform: scale(1.05);
}
```

## Feature Types

The SDK supports three feature types:

### Standard Features
Standard per-user pricing features with a fixed base price.

### Usage-Based Features
Features priced based on usage amount. Users can specify their expected usage, and pricing is calculated dynamically:
- `countPrice` - Price per unit
- `condition` - Unit name (e.g., "API call", "GB", "request")
- `eventAggregationMethod` - Aggregation method (sum, max, avg)

### Limits Features
Features with usage limits. Users can set their desired limit:
- `usageCount` - Default limit amount
- `countPrice` - Price per unit
- `condition` - Unit name

## API Requirements

The SDK expects your API to have an endpoint at:

```
GET /api/share/{shareId}
```

This endpoint should return a JSON object matching the `SharedProject` type. See the types section for details.

### Expected Response Format

```typescript
{
  id: number;
  name: string;
  description?: string;
  currency: "USD" | "EUR" | "GBP" | "CAD" | "AUD";
  shareId: string;
  annualDiscount: number;
  annualDiscountEnabled: boolean;
  monthGroupDiscounts?: {
    "3"?: number;
    "6"?: number;
    "9"?: number;
  };
  themeSettings?: ThemeSettings;
  features: Feature[];
  pricingPlans: SharedPlan[];
}
```

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

// Utility functions
import {
  getCurrencySymbol,
  formatPrice,
  normalizeHex,
  normalizeColor,
  hexToRgba,
  getColorWithOpacity,
} from '@cuprice/react-sdk';
```

### Type Definitions

#### `SharedProject`
```typescript
interface SharedProject {
  id: number;
  name: string;
  description?: string;
  currency: Currency;
  shareId?: string;
  annualDiscount: number;
  annualDiscountEnabled?: boolean;
  monthGroupDiscounts?: Record<string, number>;
  themeSettings?: ThemeSettings | null;
  features: Feature[];
  pricingPlans: SharedPlan[];
}
```

#### `SharedPlan`
```typescript
interface SharedPlan {
  id: number;
  name: string;
  description?: string;
  order: number;
  isPopular: boolean;
  isVisible: boolean;
  basePrice: number;
  isFree: boolean;
  freemiumDay?: number | null;
  planFeatures: PlanFeature[];
}
```

#### `Feature`
```typescript
interface Feature {
  id: number;
  name: string;
  description?: string;
  featureType: "Standard" | "Usage Based" | "Limits";
  basePrice: number;
  countableData?: {
    id: number;
    usageCount: number;
    condition: string;
    countPrice: number;
    eventAggregationMethod?: string | null;
  } | null;
}
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

  const handleCustomSubscribe = (
    features, 
    userCount, 
    duration, 
    featureUsageAmounts
  ) => {
    // Create custom plan with usage amounts
    const params = new URLSearchParams({
      custom: 'true',
      features: features.join(','),
      userCount: userCount.toString(),
      duration,
    });
    
    // Add usage amounts for usage-based/limits features
    if (featureUsageAmounts) {
      Object.entries(featureUsageAmounts).forEach(([feature, amount]) => {
        params.append(`usage[${feature}]`, amount.toString());
      });
    }
    
    router.push(`/checkout?${params.toString()}`);
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

### Handling Usage-Based Features

```tsx
import { CupricePricing } from '@cuprice/react-sdk';

function PricingPage() {
  const handleCustomSubscribe = (
    features, 
    userCount, 
    duration, 
    featureUsageAmounts
  ) => {
    console.log('Selected features:', features);
    console.log('User count:', userCount);
    console.log('Duration:', duration);
    
    // featureUsageAmounts contains usage amounts for usage-based/limits features
    // Example: { "API Calls": 10000, "Storage": 500 }
    if (featureUsageAmounts) {
      console.log('Usage amounts:', featureUsageAmounts);
      
      // Send to your backend API
      fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          features,
          userCount,
          duration,
          featureUsageAmounts,
        }),
      });
    }
  };

  return (
    <CupricePricing
      shareId="abc123"
      onCustomPlanSubscribe={handleCustomSubscribe}
    />
  );
}
```

### Using Utility Functions

```tsx
import { 
  CupricePricing, 
  getCurrencySymbol, 
  formatPrice 
} from '@cuprice/react-sdk';

function PricingPage() {
  const currency = 'USD';
  const price = 29.99;
  
  return (
    <div>
      <p>Price: {getCurrencySymbol(currency)}{formatPrice(price, currency)}</p>
      <CupricePricing shareId="abc123" />
    </div>
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

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT

## Support

For issues and questions, please visit [https://cuprice.io](https://cuprice.io) or open an issue on GitHub.

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for a list of changes and updates.
