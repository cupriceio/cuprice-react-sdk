import React, { useState, useEffect, useMemo } from 'react';
import type { CSSProperties } from 'react';
import { TicketPercent } from 'lucide-react';
import type { SharedProject, SharedPlan } from '../types';
import { normalizeHex, normalizeColor, getCurrencySymbol } from '../utils';
import PricingCard from './PricingCard';
import CustomPlanModal from './CustomPlanModal';

const DEFAULT_FONT_FAMILY = "Inter";
const DEFAULT_PRIMARY_COLOR = "#298558";
const DEFAULT_BUTTON_TEXT_COLOR = "#FAFAFA";
const DEFAULT_CUSTOM_PLAN_BUTTON_COLOR = "#298558";
const DEFAULT_CUSTOM_PLAN_BUTTON_TEXT_COLOR = "#FAFAFA";
const DEFAULT_POPULAR_BADGE_COLOR = "#22C55E";
const DEFAULT_POPULAR_BADGE_BORDER_COLOR = "#16A34A";
const DEFAULT_POPULAR_BADGE_TEXT_COLOR = "#FFFFFF";

export interface CupricePricingProps {
  shareId: string;
  apiUrl?: string;
  onPlanSelect?: (plan: SharedPlan) => void;
  onCustomPlanClick?: () => void;
  onCustomPlanSubscribe?: (selectedFeatures: string[], userCount: number, duration: string, featureUsageAmounts?: Record<string, number>) => void;
  className?: string;
}

const CupricePricing: React.FC<CupricePricingProps> = ({
  shareId,
  apiUrl,
  onPlanSelect,
  onCustomPlanClick,
  onCustomPlanSubscribe,
  className = '',
}) => {
  const [project, setProject] = useState<SharedProject | null>(null);
  const [error, setError] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);
  const [isAnnual, setIsAnnual] = useState(false);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);

  useEffect(() => {
    async function fetchProject() {
      setLoading(true);
      setError(null);
      try {
        const baseUrl = apiUrl || (typeof window !== 'undefined' ? window.location.origin : '');
        const res = await fetch(`${baseUrl}/api/share/${shareId}`);
        if (!res.ok) {
          setError(await res.json());
          setProject(null);
        } else {
          setProject(await res.json());
        }
      } catch (err) {
        setError({ message: 'Failed to load shared project.' });
        setProject(null);
      } finally {
        setLoading(false);
      }
    }
    fetchProject();
  }, [shareId, apiUrl]);

  const legacyTheme = useMemo(() => {
    if (!project?.theme) return null;
    try {
      if (typeof project.theme === "string") {
        return JSON.parse(project.theme);
      }
      if (typeof project.theme === "object") {
        return project.theme;
      }
      return null;
    } catch {
      return null;
    }
  }, [project?.theme]);

  const themeSettings = project?.themeSettings ?? null;
  const themeFontFamilySetting = themeSettings?.fontFamily ?? null;
  const legacyFontFamily = legacyTheme?.fontFamily ?? null;
  const themePrimaryColorSetting = themeSettings?.primaryColor ?? null;
  const legacyPrimaryColor = legacyTheme?.primaryColor ?? null;
  const themeHoverColorSetting = themeSettings?.hoverColor ?? null;
  const themeButtonTextColorSetting =
    themeSettings?.buttonTextColor ?? themeSettings?.fontColor ?? null;
  const legacyButtonTextColor =
    legacyTheme?.buttonTextColor ?? legacyTheme?.fontColor ?? null;
  const themeCustomPlanButtonColorSetting =
    themeSettings?.customPlanButtonColor ?? null;
  const legacyCustomPlanButtonColor = legacyTheme?.customPlanButtonColor ?? null;
  const themeCustomPlanButtonTextColorSetting =
    themeSettings?.customPlanButtonTextColor ?? null;
  const legacyCustomPlanButtonTextColor =
    legacyTheme?.customPlanButtonTextColor ?? null;
  const themePopularBadgeColorSetting = themeSettings?.popularBadgeColor ?? null;
  const legacyPopularBadgeColor = legacyTheme?.popularBadgeColor ?? null;
  const themePopularBadgeBorderColorSetting =
    themeSettings?.popularBadgeBorderColor ?? null;
  const legacyPopularBadgeBorderColor =
    legacyTheme?.popularBadgeBorderColor ?? null;
  const themePopularBadgeTextColorSetting =
    themeSettings?.popularBadgeTextColor ?? null;
  const legacyPopularBadgeTextColor =
    legacyTheme?.popularBadgeTextColor ?? null;
  const themeBorderRadiusSetting = themeSettings?.borderRadius ?? null;
  const themePricingBackgroundColorSetting = themeSettings?.pricingBackgroundColor ?? null;
  const themePricingBorderColorSetting = themeSettings?.pricingBorderColor ?? null;
  const themePricingHeaderBackgroundColorSetting = themeSettings?.pricingHeaderBackgroundColor ?? null;
  const themePricingHeaderTextColorSetting = themeSettings?.pricingHeaderTextColor ?? null;
  const themePricingDescriptionColorSetting = themeSettings?.pricingDescriptionColor ?? null;
  const themePricingPriceColorSetting = themeSettings?.pricingPriceColor ?? null;
  const themePricingTextColorSetting = themeSettings?.pricingTextColor ?? null;

  const resolvedFontFamily = (() => {
    if (themeFontFamilySetting && themeFontFamilySetting.trim().length > 0) {
      return themeFontFamilySetting.trim();
    }
    if (legacyFontFamily && legacyFontFamily.trim().length > 0) {
      return legacyFontFamily.trim();
    }
    return DEFAULT_FONT_FAMILY;
  })();

  const resolvedPrimaryColor = normalizeColor(
    themePrimaryColorSetting ?? legacyPrimaryColor ?? null,
    DEFAULT_PRIMARY_COLOR
  );

  const resolvedHoverColor = normalizeColor(
    themeHoverColorSetting ?? null,
    "#1a5a3a" // Default hover color (darker green)
  );

  const resolvedButtonTextColor = normalizeHex(
    themeButtonTextColorSetting ?? legacyButtonTextColor ?? null,
    DEFAULT_BUTTON_TEXT_COLOR
  );

  const resolvedCustomPlanButtonColor = normalizeHex(
    themeCustomPlanButtonColorSetting ?? legacyCustomPlanButtonColor ?? null,
    DEFAULT_CUSTOM_PLAN_BUTTON_COLOR
  );

  const resolvedCustomPlanButtonTextColor = normalizeHex(
    themeCustomPlanButtonTextColorSetting ?? legacyCustomPlanButtonTextColor ?? null,
    DEFAULT_CUSTOM_PLAN_BUTTON_TEXT_COLOR
  );

  const resolvedPopularBadgeColor = normalizeColor(
    themePopularBadgeColorSetting ?? legacyPopularBadgeColor ?? null,
    DEFAULT_POPULAR_BADGE_COLOR
  );

  const resolvedPopularBadgeBorderColor = normalizeColor(
    themePopularBadgeBorderColorSetting ?? legacyPopularBadgeBorderColor ?? null,
    DEFAULT_POPULAR_BADGE_BORDER_COLOR
  );

  const resolvedPopularBadgeTextColor = normalizeHex(
    themePopularBadgeTextColorSetting ?? legacyPopularBadgeTextColor ?? null,
    DEFAULT_POPULAR_BADGE_TEXT_COLOR
  );

  const resolvedBorderRadius = (() => {
    if (themeBorderRadiusSetting && themeBorderRadiusSetting.trim().length > 0) {
      const radius = parseInt(themeBorderRadiusSetting, 10);
      if (!isNaN(radius) && radius >= 0 && radius <= 50) {
        return `${radius}px`;
      }
    }
    return "10px"; // Default border radius
  })();

  const resolvedPricingBackgroundColor = normalizeColor(
    themePricingBackgroundColorSetting ?? null,
    "#FFFFFF" // Default white background
  );

  const resolvedPricingBorderColor = normalizeColor(
    themePricingBorderColorSetting ?? null,
    "#E5E5E5" // Default border color
  );

  const resolvedPricingHeaderBackgroundColor = normalizeColor(
    themePricingHeaderBackgroundColorSetting ?? null,
    "#FFFFFF" // Default white page background
  );

  const resolvedPricingHeaderTextColor = normalizeColor(
    themePricingHeaderTextColorSetting ?? null,
    "#737373" // Default gray for header text
  );

  const resolvedPricingDescriptionColor = normalizeColor(
    themePricingDescriptionColorSetting ?? null,
    "#0A0A0A" // Default dark gray for description
  );

  const resolvedPricingPriceColor = normalizeColor(
    themePricingPriceColorSetting ?? null,
    "#0A0A0A" // Default dark gray for price
  );

  const resolvedPricingTextColor = normalizeColor(
    themePricingTextColorSetting ?? null,
    "#0A0A0A" // Default dark gray for text
  );

  const fontStack = useMemo(() => {
    const sanitized = resolvedFontFamily.replace(/'/g, "\\'");
    return `'${sanitized}', var(--font-sans, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif)`;
  }, [resolvedFontFamily]);

  const rootStyle = useMemo(
    () =>
      ({
        fontFamily: fontStack,
        "--base-primary": resolvedPrimaryColor,
        "--base-primary-hover": resolvedHoverColor,
        "--base-primary-foreground": "#FAFAFA",
        "--pricing-button-text": resolvedButtonTextColor,
        "--custom-plan-button-bg": resolvedCustomPlanButtonColor,
        "--custom-plan-button-text": resolvedCustomPlanButtonTextColor,
        "--popular-badge-border": resolvedPopularBadgeBorderColor,
        "--popular-badge-bg": resolvedPopularBadgeColor,
        "--popular-badge-text": resolvedPopularBadgeTextColor,
        "--pricing-border-radius": resolvedBorderRadius,
        "--base-card": resolvedPricingBackgroundColor,
        "--pricing-card-background": resolvedPricingBackgroundColor,
        "--pricing-border-color": resolvedPricingBorderColor,
        "--pricing-page-background": resolvedPricingHeaderBackgroundColor,
        "--pricing-header-text-color": resolvedPricingHeaderTextColor,
        "--pricing-description-color": resolvedPricingDescriptionColor,
        "--pricing-price-color": resolvedPricingPriceColor,
        "--pricing-text-color": resolvedPricingTextColor,
        "--base-foreground": resolvedPricingTextColor,
        background: resolvedPricingHeaderBackgroundColor,
      } as CSSProperties & Record<string, string>),
    [
      fontStack,
      resolvedPrimaryColor,
      resolvedHoverColor,
      resolvedButtonTextColor,
      resolvedCustomPlanButtonColor,
      resolvedCustomPlanButtonTextColor,
      resolvedPopularBadgeBorderColor,
      resolvedPopularBadgeColor,
      resolvedPopularBadgeTextColor,
      resolvedBorderRadius,
      resolvedPricingBackgroundColor,
      resolvedPricingBorderColor,
      resolvedPricingHeaderBackgroundColor,
      resolvedPricingHeaderTextColor,
      resolvedPricingDescriptionColor,
      resolvedPricingPriceColor,
      resolvedPricingTextColor,
    ]
  );

  useEffect(() => {
    if (project && !project.annualDiscountEnabled) {
      setIsAnnual(false);
    }
  }, [project]);

  const effectiveIsAnnual = isAnnual;

  if (error) {
    return (
      <main
        className={`min-h-screen flex flex-col items-center justify-center py-12 px-4 ${className}`}
        style={rootStyle}
      >
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Project Not Found</h1>
          <p className="text-gray-600">
            The shared project you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
        </div>
      </main>
    );
  }

  if (loading || !project) {
    return (
      <main
        className={`min-h-screen flex flex-col items-center justify-center py-12 px-4 ${className}`}
        style={rootStyle}
      >
        <div className="animate-pulse text-center">
          <h1 className="text-2xl font-bold text-gray-600">Loading...</h1>
        </div>
      </main>
    );
  }

  const annualDiscountPercentage = Math.round(project.annualDiscount * 100);
  const currencySymbol = getCurrencySymbol(project.currency);

  const visiblePlans = project.pricingPlans
    .filter(plan => plan.isVisible)
    .sort((a, b) => a.order - b.order);

  const handleCustomPlanClick = () => {
    setIsCustomModalOpen(true);
    if (onCustomPlanClick) {
      onCustomPlanClick();
    }
  };

  const handleCustomPlanSubscribe = (selectedFeatures: string[], userCount: number, duration: string, featureUsageAmounts?: Record<string, number>) => {
    if (onCustomPlanSubscribe) {
      onCustomPlanSubscribe(selectedFeatures, userCount, duration, featureUsageAmounts);
    }
    setIsCustomModalOpen(false);
  };

  // Scope custom CSS to only affect this pricing container
  const scopeCSS = (css: string): string => {
    if (!css || !css.trim()) return '';
    
    // First, scope all selectors with .cuprice-pricing-container
    let scoped = css
      .replace(/([^@\s][^{]*?)\s*\{/g, (match, selector) => {
        const trimmed = selector.trim();
        // Skip if already scoped, pseudo-selectors, or @rules
        if (
          trimmed.includes('.cuprice-pricing-container') ||
          trimmed.startsWith('&') ||
          trimmed.startsWith(':') ||
          trimmed.startsWith('@') ||
          trimmed.startsWith('/*') ||
          trimmed.startsWith('//')
        ) {
          return match;
        }
        // Add scoping with double class for higher specificity
        return `.cuprice-pricing-container.cuprice-pricing-container ${trimmed} {`;
      });
    
    // Then, add !important to all CSS properties (unless already present)
    const lines = scoped.split('\n');
    let inRule = false;
    let processedLines: string[] = [];
    
    for (const line of lines) {
      const trimmed = line.trim();
      
      if (trimmed.includes('{') && !trimmed.includes('}')) {
        inRule = true;
        processedLines.push(line);
        continue;
      }
      if (trimmed.includes('}')) {
        inRule = false;
        processedLines.push(line);
        continue;
      }
      
      if (inRule && trimmed.includes(':') && !trimmed.includes('/*') && !trimmed.startsWith('//')) {
        if (trimmed.includes('!important')) {
          processedLines.push(line);
          continue;
        }
        
        const propertyMatch = trimmed.match(/^([^:]+):\s*(.+?)(\s*;?\s*)$/);
        if (propertyMatch) {
          const [, property, value, ending] = propertyMatch;
          if (property.trim().startsWith('@') || property.trim().startsWith('/*') || 
              value.trim().startsWith('/*') || value.trim().startsWith('//')) {
            processedLines.push(line);
            continue;
          }
          const newLine = line.replace(
            /([^:]+):\s*([^;!]+?)(\s*)(;?\s*)$/,
            (m, prop, val, space, end) => {
              if (m.includes('!important')) return m;
              return `${prop}: ${val.trim()}${space}!important${end}`;
            }
          );
          processedLines.push(newLine);
          continue;
        }
      }
      
      processedLines.push(line);
    }
    
    scoped = processedLines.join('\n');
    return scoped;
  };

  const scopedCSS = project.themeSettings?.customCSS
    ? scopeCSS(project.themeSettings.customCSS)
    : '';

  return (
    <div className="flex flex-col min-h-screen h-full overflow-hidden cuprice-pricing-container cuprice-pricing-container">
      {scopedCSS && (
        <style dangerouslySetInnerHTML={{ __html: scopedCSS }} />
      )}
      <main
        className={`min-h-screen flex flex-col px-[25px] pt-[42px] ${className}`}
        style={rootStyle}
      >
      {/* Header Section */}
      {(() => {
        const themeSettings = project.themeSettings;
        if (!themeSettings) return true;
        const showProjectName = themeSettings.showProjectName === false ? false : true;
        const showPricingHeader = themeSettings.showPricingHeader === false ? false : true;
        return showProjectName || showPricingHeader;
      })() && (
      <div className="flex flex-col gap-5 pr-[5px] items-start">
        {(() => {
          const themeSettings = project.themeSettings;
          if (!themeSettings) return true;
          return themeSettings.showProjectName !== false;
        })() && (
        <h1 
          className="text-4xl md:text-5xl font-bold"
          style={{ 
            background: 'var(--pricing-header-text-color, #0A0A0A)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
          }}
        >
          {project.name || "Flexible pricing plan for your startup"}
        </h1>
        )}
        {(() => {
          const themeSettings = project.themeSettings;
          if (!themeSettings) return true;
          return themeSettings.showPricingHeader !== false;
        })() && (
        <p
          className="text-2xl font-medium max-w-3xl leading-[100%]"
          style={{ 
            fontFamily: fontStack,
            background: 'var(--pricing-description-color, #556987)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
          }}
        >
          {project.description || "Your customers can select their relevant plan or they can build their own plan based on what they need!"}
        </p>
        )}
      </div>
      )}

      {visiblePlans.length > 0 && (
        <div className="flex justify-center w-full mb-[44px] mt-[60px]">
          {project.annualDiscountEnabled ? (
            <div 
              className="relative rounded-lg p-[3px] w-[400px] h-[36px] flex"
              style={{
                borderRadius: "var(--pricing-border-radius, 10px)",
                background: "var(--base-primary, #298558)",
                boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
              }}
            >
              <div 
                className={`absolute top-[3px] w-[197px] h-[30px] bg-white rounded-md transition-transform duration-300 ease-in-out ${
                  effectiveIsAnnual ? 'translate-x-[197px]' : 'translate-x-0'
                }`}
                style={{
                  borderRadius: "var(--pricing-border-radius, 10px)",
                }}
              />
              
              <button
                onClick={() => setIsAnnual(false)}
                className={`relative z-10 w-[197px] h-[30px] px-2 py-1 text-sm font-medium rounded-md transition-colors duration-300 flex items-center justify-center ${
                  !effectiveIsAnnual
                    ? "text-gray-900"
                    : "text-white hover:text-gray-300"
                }`}
                style={{
                  borderRadius: "var(--pricing-border-radius, 10px)",
                  fontFamily: fontStack,
                }}
              >
                Monthly
              </button>
              <button
                onClick={() => setIsAnnual(true)}
                className={`relative z-10 flex items-center justify-center gap-2 w-[197px] h-[30px] px-2 py-1 text-sm font-medium rounded-md transition-colors duration-300 ${
                  effectiveIsAnnual
                    ? "text-gray-900"
                    : "text-white hover:text-gray-300"
                }`}
                style={{
                  borderRadius: "var(--pricing-border-radius, 10px)",
                  fontFamily: fontStack,
                }}
              >
                <TicketPercent size={16} />
                Annual (SAVE {annualDiscountPercentage}%)
              </button>
            </div>
          ) : (
            <div 
              className="relative rounded-lg p-[3px] w-[200px] h-[36px] flex"
              style={{
                borderRadius: "var(--pricing-border-radius, 10px)",
                background: "var(--base-primary, #298558)",
                boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
              }}
            >
              <button
                className="relative z-10 w-full h-[30px] px-2 py-1 text-sm font-medium rounded-md transition-colors duration-300 flex items-center justify-center text-gray-900 bg-white"
                style={{
                  borderRadius: "var(--pricing-border-radius, 10px)",
                  fontFamily: fontStack,
                }}
              >
                Monthly
              </button>
            </div>
          )}
        </div>
      )}

      {visiblePlans.length > 0 ? (
        <div className={`flex gap-6 items-center ${
          visiblePlans.length >= 4 
            ? "flex-row overflow-x-auto pb-4 px-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100" 
            : "flex-col md:flex-row justify-center"
        }`}>
          {visiblePlans.map((plan) => {
            const totalFeaturePrice = plan.planFeatures.reduce((sum, pf) => {
              return sum + (pf.feature.basePrice || 0);
            }, 0);
            
            const basePrice = plan.basePrice > 0 ? plan.basePrice : totalFeaturePrice;
            const monthlyPrice = (effectiveIsAnnual && project.annualDiscountEnabled) ? basePrice * (1 - project.annualDiscount) : basePrice;
            const annualPrice = monthlyPrice * 12;
            
            const features = plan.planFeatures.map(pf => ({
              name: pf.feature.name,
              description: pf.feature.description || undefined
            }));

            return (
              <div key={plan.id} className={visiblePlans.length >= 4 ? "min-w-[280px] flex-shrink-0" : ""}>
                <PricingCard
                  title={plan.name}
                  price={plan.isFree ? "0" : (effectiveIsAnnual ? annualPrice.toFixed(2) : monthlyPrice.toFixed(2))}
                  period={effectiveIsAnnual ? "year" : "mth"}
                  billed={plan.isFree ? "Free forever" : (effectiveIsAnnual ? `Billed annually (${currencySymbol}${annualPrice.toFixed(2)}/year)` : "Billed monthly")}
                  features={features}
                  buttonText={plan.isFree ? "Get Started" : "Choose Plan"}
                  isPopular={plan.isPopular}
                  currencySymbol={currencySymbol}
                  isFree={plan.isFree}
                  description={plan.description}
                  freemiumDay={plan.freemiumDay}
                  onButtonClick={() => onPlanSelect && onPlanSelect(plan)}
                  isLoading={false}
                />
              </div>
            );
          })}
          <div className={`${visiblePlans.length >= 4 ? "min-w-[295px] flex-shrink-0" : "w-[295px]"} h-[414px] border-2 rounded-2xl p-2 flex flex-col justify-between shadow-lg`} style={{
            borderRadius: "var(--pricing-border-radius, 10px)",
            backgroundColor: project.themeSettings?.customPlanCardBackgroundColor || undefined,
            backgroundImage: project.themeSettings?.customPlanCardBackgroundColor 
              ? `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.4'/%3E%3C/svg%3E")`
              : "linear-gradient(0deg, rgba(0, 0, 0, 0.41) 0%, rgba(0, 0, 0, 0.41) 100%), url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSBiYXNlRnJlcXVlbmN5PSIwLjkiIG51bU9jdGF2ZXM9IjQiIHJlc3VsdD0ibm9pc2UiLz48ZmVDb2xvck1hdHJpeCB0eXBlPSJzYXR1cmF0ZSIgdmFsdWVzPSIwIi8+PC9maWx0ZXI+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNub2lzZSkiIG9wYWNpdHk9IjAuNCIvPjwvc3ZnPg==') center / cover no-repeat",
            backgroundSize: project.themeSettings?.customPlanCardBackgroundColor ? "200px 200px" : "cover",
            backgroundPosition: "center",
            backgroundRepeat: "repeat",
            borderWidth: project.themeSettings?.customPlanCardBorderWidth 
              ? `${project.themeSettings.customPlanCardBorderWidth}px`
              : "2px",
            borderStyle: "solid",
            borderColor: project.themeSettings?.customPlanCardBorderColor || "#FFFFFF",
          }}>
            <div className="border-2 p-3 rounded-2xl h-full flex flex-col justify-between" style={{
              borderRadius: "var(--pricing-border-radius, 10px)",
              borderWidth: project.themeSettings?.customPlanCardBorderWidth 
                ? `${project.themeSettings.customPlanCardBorderWidth}px`
                : "2px",
              borderStyle: "solid",
              borderColor: project.themeSettings?.customPlanCardBorderColor || "#FFFFFF",
            }}>
              <div className="flex justify-between items-center">
                <h2
                  className="text-2xl font-extrabold text-white flex items-center justify-center"
                  style={{
                    fontFamily: project.themeSettings?.customPlanCardFontFamily 
                      ? `'${project.themeSettings.customPlanCardFontFamily}', ${fontStack}`
                      : fontStack,
                    lineHeight: "23px",
                    width: "129px",
                  }}
                >
                  Customize your way
                </h2>
                <div
                  className="w-[75px] h-[20px] bg-white border border-[#E5E5E5] text-black text-xs font-semibold px-2 py-1 rounded-md flex items-center gap-1"
                  style={{
                    fontFamily: project.themeSettings?.customPlanCardFontFamily 
                      ? `'${project.themeSettings.customPlanCardFontFamily}', ${fontStack}`
                      : fontStack,
                    backgroundColor: "var(--base-background, #FFFFFF)",
                    borderColor: "var(--base-border, #E5E5E5)",
                    borderRadius: "var(--pricing-border-radius, 10px)",
                  }}
                >
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginTop: '1px', marginLeft: '1px' }}>
                    <path d="M6 1L7.545 4.13L11 4.635L8.5 7.07L9.09 10.51L6 8.885L2.91 10.51L3.5 7.07L1 4.635L4.455 4.13L6 1Z" stroke="#0A0A0A" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span style={{ color: 'var(--base-foreground, #0A0A0A)' }}>Special</span>
                </div>
              </div>
              <div className="mt-5 space-y-4 text-white w-[212px] h-[165px] flex flex-col items-center justify-center bg-transparent mx-[30px]">
                <p
                  className="text-[17px] font-normal text-white leading-[110%]"
                  style={{ 
                    fontFamily: project.themeSettings?.customPlanCardFontFamily 
                      ? `'${project.themeSettings.customPlanCardFontFamily}', ${fontStack}`
                      : fontStack 
                  }}
                >
                  Pay only for what you actually need
                </p>
                <p
                  className="text-[17px] font-normal text-white leading-[110%]"
                  style={{ 
                    fontFamily: project.themeSettings?.customPlanCardFontFamily 
                      ? `'${project.themeSettings.customPlanCardFontFamily}', ${fontStack}`
                      : fontStack 
                  }}
                >
                  Choose features that match your workflow
                </p>
                <p
                  className="text-[17px] font-normal text-white leading-[110%]"
                  style={{ 
                    fontFamily: project.themeSettings?.customPlanCardFontFamily 
                      ? `'${project.themeSettings.customPlanCardFontFamily}', ${fontStack}`
                      : fontStack 
                  }}
                >
                  Decide how long you want to commit (3-6-9-12 months)
                </p>
                <p
                  className="text-[17px] font-normal text-white leading-[110%] text-center w-full"
                  style={{ 
                    fontFamily: project.themeSettings?.customPlanCardFontFamily 
                      ? `'${project.themeSettings.customPlanCardFontFamily}', ${fontStack}`
                      : fontStack,
                    marginBottom: '-1.6px'
                  }}
                >
                  Click below and create your freedom.
                </p>
                <p
                  className="text-white text-center mt-2 text-[10px] font-light underline"
                  style={{
                    fontFamily: project.themeSettings?.customPlanCardFontFamily 
                      ? `'${project.themeSettings.customPlanCardFontFamily}', ${fontStack}`
                      : fontStack,
                    lineHeight: "100%",
                  }}
                >
                  Powered by <a className="underline hover:no-underline" href="https://cuprice.io/?utm_source=from_plans" target="_blank" rel="noopener noreferrer">CUPRICE</a>
                </p>
              </div>
              <button
                onClick={handleCustomPlanClick}
                className="w-full flex items-center justify-center gap-2 rounded-md font-medium text-sm transition-colors duration-200"
                style={{
                  height: "36px",
                  paddingTop: "var(--spacing-2, 0.5rem)",
                  paddingRight: "var(--spacing-1, 0.25rem)",
                  paddingBottom: "var(--spacing-2, 0.5rem)",
                  paddingLeft: "var(--spacing-1, 0.25rem)",
                  borderRadius: "var(--pricing-border-radius, 10px)",
                  background: project.themeSettings?.customPlanCardButtonColor || "var(--custom-plan-button-bg, #298558)",
                  boxShadow:
                    "var(--shadow-xs-offset-x, 0) var(--shadow-xs-offset-y, 1) var(--shadow-xs-blur-radius, 2) var(--shadow-xs-spread-radius, 0) var(--shadow-xs-color, rgba(0, 0, 0, 0.05))",
                  fontFamily: project.themeSettings?.customPlanCardFontFamily 
                    ? `'${project.themeSettings.customPlanCardFontFamily}', ${fontStack}`
                    : fontStack,
                  fontWeight: "var(--font-weight-medium, 500)",
                  fontSize: "var(--text-sm-font-size, 0.875rem)",
                  lineHeight: "var(--text-sm-line-height, 1.25rem)",
                  letterSpacing: "0%",
                  verticalAlign: "middle",
                  color: project.themeSettings?.customPlanCardButtonTextColor || "var(--custom-plan-button-text, #FAFAFA)",
                  opacity: 1,
                  transform: "rotate(0deg)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--base-primary-hover, #1a5a3a)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = project.themeSettings?.customPlanCardButtonColor || "var(--custom-plan-button-bg, #298558)";
                }}
              >
                Create now
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-600 mb-2">No Plans Available</h2>
          <p className="text-gray-500">This project doesn&apos;t have any visible pricing plans yet.</p>
        </div>
      )}

      <CustomPlanModal 
        isOpen={isCustomModalOpen} 
        onClose={() => setIsCustomModalOpen(false)} 
        project={project}
        onSubscribe={handleCustomPlanSubscribe}
      />
      </main>
    </div>
  );
};

export default CupricePricing;

