export type Currency = 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD';

export interface Feature {
  id: number;
  name: string;
  description?: string;
  featureType: string;
  basePrice: number;
  projectId: number;
  createdAt?: string;
}

export interface PlanFeature {
  id: number;
  planId: number;
  featureId: number;
  multiplier: number;
  feature: Feature;
}

export interface SharedPlan {
  id: number;
  name: string;
  description?: string;
  projectId: number;
  order: number;
  isPopular: boolean;
  isCustomized: boolean;
  isVisible: boolean;
  stripeProductId?: string;
  isPerUserPricing: boolean;
  perUserMultiplier: number;
  basePrice: number;
  isFree: boolean;
  freemiumDay?: number | null;
  createdAt?: string;
  planFeatures: PlanFeature[];
}

export interface ThemeSettings {
  fontFamily?: string | null;
  primaryColor?: string | null;
  buttonTextColor?: string | null;
  customPlanButtonColor?: string | null;
  customPlanButtonTextColor?: string | null;
  popularBadgeBorderColor?: string | null;
  popularBadgeColor?: string | null;
  popularBadgeTextColor?: string | null;
  fontColor?: string | null;
}

export interface SharedProject {
  id: number;
  name: string;
  description?: string;
  userId: number;
  projectType?: string;
  capacity?: string;
  currency: Currency;
  logo?: string;
  shareId?: string;
  annualDiscount: number;
  annualDiscountEnabled?: boolean;
  monthGroupDiscounts?: Record<string, number>;
  theme?: string;
  themeSettings?: ThemeSettings | null;
  createdAt?: string;
  updatedAt?: string;
  features: Feature[];
  pricingPlans: SharedPlan[];
}

export interface CupricePricingProps {
  shareId: string;
  apiUrl?: string;
  onPlanSelect?: (plan: SharedPlan) => void;
  onCustomPlanClick?: () => void;
  className?: string;
}

