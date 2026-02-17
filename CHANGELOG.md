# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2025-02-17

### Added
- **Usage-Based Features Support**: Full support for usage-based pricing features with dynamic price calculation
- **Limits Features Support**: Support for features with usage limits and customizable limit amounts
- **Enhanced Theme Settings**: Added 20+ new theme settings including:
  - `hoverColor` - Custom hover color for buttons
  - `borderRadius` - Customizable border radius (0-50px)
  - `pricingBackgroundColor` - Pricing card background color
  - `pricingBorderColor` - Pricing card border color (supports gradients)
  - `pricingHeaderBackgroundColor` - Page background color
  - `pricingHeaderTextColor` - Project name text color
  - `pricingDescriptionColor` - Description text color
  - `pricingPriceColor` - Price text color
  - `pricingTextColor` - General text color
  - `customPlanCardButtonColor` - Custom plan card button color
  - `customPlanCardButtonTextColor` - Custom plan card button text color
  - `customPlanCardBackgroundColor` - Custom plan card background color
  - `customPlanCardFontFamily` - Custom plan card font family
  - `customPlanCardBorderColor` - Custom plan card border color
  - `customPlanCardBorderWidth` - Custom plan card border width
  - `customCSS` - Custom CSS injection with automatic scoping
  - `showProjectName` - Toggle to show/hide project name
  - `showPricingHeader` - Toggle to show/hide pricing header/description
- **Custom CSS Support**: Inject custom CSS with automatic scoping to prevent conflicts
- **Price Animations**: Smooth animations when switching between monthly/annual pricing
- **Loading States**: Built-in loading indicators for buttons and actions
- **Badge Text Color Auto-Calculation**: Automatic text color calculation for popular badges based on background color
- **Gradient Border Support**: Support for gradient borders on pricing cards
- **Enhanced Utility Functions**: 
  - `normalizeColor()` - Support for hex, rgba, and gradient colors
  - `hexToRgba()` - Convert hex colors to rgba
  - `getColorWithOpacity()` - Apply opacity to colors
- **Feature Usage Amounts**: `onCustomPlanSubscribe` callback now includes `featureUsageAmounts` parameter for usage-based/limits features
- **Real-time Price Calculation**: Dynamic price updates in custom plan modal as users adjust usage amounts
- **Improved Responsive Design**: Better mobile and tablet support

### Changed
- Updated `onCustomPlanSubscribe` callback signature to include optional `featureUsageAmounts` parameter
- Enhanced theme color normalization to support rgba and gradient colors
- Improved popular badge color handling to use `normalizeColor` instead of `normalizeHex`
- Annual toggle button now uses theme colors instead of hardcoded values
- Better CSS variable organization and naming

### Fixed
- Fixed badge text color contrast calculation
- Improved border gradient detection and rendering
- Enhanced theme settings fallback handling

## [1.0.0] - 2024-01-XX

### Added
- Initial release of @cuprice/react-sdk
- `CupricePricing` component for embedding pricing tables
- Support for annual/monthly pricing toggle
- Custom plan builder modal
- Basic theme customization support
- TypeScript type definitions
- Full accessibility support (ARIA labels, keyboard navigation)
- Responsive design support
