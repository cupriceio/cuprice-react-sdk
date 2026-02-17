import React, { useState, useEffect, useRef } from 'react';
import type { CSSProperties } from 'react';

interface Feature {
  name: string;
  description?: string;
}

interface PricingCardProps {
  title: string;
  price: string;
  period: string;
  billed: string;
  features: string[] | Feature[];
  buttonText: string;
  isPopular?: boolean;
  currencySymbol?: string;
  isFree?: boolean;
  description?: string;
  freemiumDay?: number | null;
  onButtonClick?: () => void;
  isLoading?: boolean;
}

const PricingCard: React.FC<PricingCardProps> = ({
  title,
  price,
  period,
  features,
  buttonText,
  isPopular = false,
  currencySymbol = '$',
  isFree = false,
  freemiumDay,
  onButtonClick,
  isLoading = false,
}) => {
  const [hoveredFeatureIndex, setHoveredFeatureIndex] = useState<number | null>(null);
  const [badgeTextColor, setBadgeTextColor] = useState<string>('#FFFFFF');
  const badgeRef = useRef<HTMLDivElement>(null);
  const prevPriceRef = useRef<string>(price);
  const prevPeriodRef = useRef<string>(period);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down');
  
  // Track price/period changes to determine scroll direction
  useEffect(() => {
    if (prevPriceRef.current !== price || prevPeriodRef.current !== period) {
      const prevPriceNum = parseFloat(prevPriceRef.current) || 0;
      const currentPriceNum = parseFloat(price) || 0;
      setScrollDirection(currentPriceNum > prevPriceNum ? 'up' : 'down');
      prevPriceRef.current = price;
      prevPeriodRef.current = period;
    }
  }, [price, period]);
  
  // Calculate contrasting text color for the badge based on background
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const updateTextColor = () => {
      if (!badgeRef.current) return;
      
      void badgeRef.current.offsetHeight;
      
      const computedBg = window.getComputedStyle(badgeRef.current).backgroundColor;
      const rgbMatch = computedBg.match(/\d+/g);
      if (rgbMatch && rgbMatch.length >= 3) {
        const r = parseInt(rgbMatch[0], 10);
        const g = parseInt(rgbMatch[1], 10);
        const b = parseInt(rgbMatch[2], 10);
        
        const normalize = (val: number) => {
          val = val / 255;
          return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
        };
        
        const luminance = 0.2126 * normalize(r) + 0.7152 * normalize(g) + 0.0722 * normalize(b);
        setBadgeTextColor(luminance > 0.5 ? '#000000' : '#FFFFFF');
      } else {
        const rootStyle = getComputedStyle(document.documentElement);
        const primaryColor = rootStyle.getPropertyValue('--base-primary').trim();
        
        if (primaryColor && primaryColor.startsWith('#')) {
          const hex = primaryColor.replace('#', '');
          if (hex.length === 6) {
            const r = parseInt(hex.substring(0, 2), 16);
            const g = parseInt(hex.substring(2, 4), 16);
            const b = parseInt(hex.substring(4, 6), 16);
            const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
            setBadgeTextColor(luminance > 0.5 ? '#000000' : '#FFFFFF');
            return;
          }
        }
        
        setBadgeTextColor('#FFFFFF');
      }
    };
    
    const attemptUpdate = () => {
      if (badgeRef.current) {
        updateTextColor();
      } else {
        setTimeout(attemptUpdate, 10);
      }
    };
    
    setTimeout(attemptUpdate, 50);
    setTimeout(updateTextColor, 100);
    setTimeout(updateTextColor, 200);
    
    const observer = new MutationObserver(() => {
      setTimeout(updateTextColor, 10);
    });
    
    if (document.documentElement) {
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['style', 'class'],
        subtree: true,
      });
    }
    
    const interval = setInterval(updateTextColor, 300);
    
    return () => {
      observer.disconnect();
      clearInterval(interval);
    };
  }, []);

  // Check if border is gradient for wrapper approach
  const [borderColorValue, setBorderColorValue] = useState<string>('#E5E5E5');
  const [isBorderGradient, setIsBorderGradient] = useState(false);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const checkBorder = () => {
        const color = getComputedStyle(document.documentElement).getPropertyValue('--pricing-border-color').trim() || '#E5E5E5';
        setBorderColorValue(color);
        setIsBorderGradient(/^linear-gradient\([^)]+\)$/i.test(color));
      };
      checkBorder();
      const observer = new MutationObserver(checkBorder);
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['style'],
      });
      return () => observer.disconnect();
    }
  }, []);

  const cardStyle: CSSProperties = {
    height: '100%',
    borderRadius: "var(--pricing-border-radius, 10px)",
    background: "var(--base-card, #FFFFFF)",
    ...(isPopular
      ? ({
          "--tw-ring-color": "var(--base-primary, var(--popular-badge-border, #16A34A))",
          borderColor: "var(--base-primary, var(--popular-badge-border, #16A34A))",
        } as CSSProperties)
      : {}),
  };

  // If border is gradient, use wrapper div approach
  if (isBorderGradient) {
    return (
      <div
        className={`cuprice-pricing-card ${isPopular ? "cuprice-pricing-card--popular" : ""} shadow-lg w-[295px] h-full relative ${
          isPopular ? "ring-2" : ""
        }`}
        style={{
          padding: '1px',
          borderRadius: "var(--pricing-border-radius, 10px)",
          background: borderColorValue,
        }}
      >
        <div
          className="cuprice-pricing-card__inner flex flex-col p-5 h-full gap-4 relative"
          style={cardStyle}
        >
          {isPopular && (
            <div
              ref={badgeRef}
              className="absolute -top-3 left-1/2 -translate-x-1/2 transform px-4 py-1 text-sm font-medium"
              style={{
                background: "var(--base-primary, var(--popular-badge-bg, #22C55E))",
                color: badgeTextColor,
                border: "1px solid var(--base-primary, var(--popular-badge-border, #16A34A))",
                borderRadius: "var(--pricing-border-radius, 10px)",
              }}
            >
              Most Popular
            </div>
          )}
          
          {/* Content that can grow */}
          <div className="flex-1 flex flex-col w-full items-center text-center min-h-0">
            <div className="flex justify-between items-center mb-4 w-full flex-shrink-0">
              <h3 className="text-2xl font-extrabold" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif', background: 'var(--pricing-header-text-color, #737373)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>{title}</h3>
              <div className="w-[42px] h-[20px] bg-white border border-[#E5E5E5] text-gray-600 text-xs font-medium px-2 py-1 rounded-md flex items-center justify-center">
                {isFree ? 'Free' : 'Paid'}
              </div>
            </div>
            
            {/* Pricing Display */}
            <div className="mb-6 w-full text-left flex-shrink-0">
              {freemiumDay && freemiumDay > 0 ? (
                <div className="flex flex-col">
                  <div className="mb-1 relative overflow-hidden" style={{ height: '28px' }}>
                    <div
                      key={`${price}-${period}`}
                      className="absolute inset-0 transition-all duration-300 ease-in-out"
                      style={{
                        transform: 'translateY(0)',
                        opacity: 1,
                      }}
                    >
                      <span className="text-2xl font-bold" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif', lineHeight: '100%', background: 'var(--pricing-price-color, #0A0A0A)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>{currencySymbol}0</span>
                      <span className="text-2xl font-normal ml-1" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif', lineHeight: '100%', background: 'var(--pricing-price-color, #0A0A0A)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>| {period === 'mth' ? 'Month' : 'Year'}</span>
                    </div>
                  </div>
                  <div className="text-sm font-normal" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif', background: 'var(--pricing-description-color, var(--pricing-text-color, var(--base-foreground, #0A0A0A)))', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
                    Get {freemiumDay} {freemiumDay === 1 ? 'day' : 'days'} free access to all premium features
                  </div>
                </div>
              ) : isFree ? (
                <div className="mb-2 relative overflow-hidden" style={{ height: '28px' }}>
                  <div
                    key={`${price}-${period}`}
                    className="absolute inset-0 transition-all duration-300 ease-in-out"
                    style={{
                      transform: 'translateY(0)',
                      opacity: 1,
                    }}
                  >
                    <span className="text-2xl font-bold" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif', lineHeight: '100%', background: 'var(--pricing-price-color, #0A0A0A)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>{currencySymbol}0</span>
                    <span className="text-2xl font-normal ml-1" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif', lineHeight: '100%', background: 'var(--pricing-price-color, #0A0A0A)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>| {period === 'mth' ? 'Month' : 'Year'}</span>
                  </div>
                </div>
              ) : (
                <div className="mb-2 relative overflow-hidden" style={{ height: '28px' }}>
                  <div
                    key={`${price}-${period}`}
                    className="absolute inset-0 transition-all duration-300 ease-in-out"
                    style={{
                      transform: 'translateY(0)',
                      opacity: 1,
                    }}
                  >
                    <span className="text-2xl font-bold" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif', lineHeight: '100%', background: 'var(--pricing-price-color, #0A0A0A)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
                      {currencySymbol}{price}
                    </span>
                    <span className="text-2xl font-normal ml-1" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif', lineHeight: '100%', background: 'var(--pricing-price-color, #0A0A0A)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>| {period === 'mth' ? 'Month' : 'Year'}</span>
                  </div>
                </div>
              )}
            </div>

            <ul className="space-y-[10px] w-full">
              {features.map((feature, i) => {
                const featureName = typeof feature === 'string' ? feature : feature.name;
                const featureDescription = typeof feature === 'string' ? undefined : feature.description;
                const hasDescription = featureDescription && featureDescription.trim() !== '';
                
                return (
                  <li key={i} className="flex items-center gap-1 h-[22px] px-2 py-1 relative flex-shrink-0">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
                      <path d="M10 3L4.5 8.5L2 6" stroke="#0A0A0A" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="text-lg font-medium text-left" style={{ fontFamily: 'font/font-sans', lineHeight: '100%', background: 'var(--pricing-text-color, var(--base-foreground, #0A0A0A))', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>{featureName}</span>
                    {hasDescription && (
                      <div className="relative">
                        <svg 
                          width="12" 
                          height="12" 
                          viewBox="0 0 12 12" 
                          fill="none" 
                          xmlns="http://www.w3.org/2000/svg"
                          className="flex-shrink-0 cursor-help"
                          onMouseEnter={() => setHoveredFeatureIndex(i)}
                          onMouseLeave={() => setHoveredFeatureIndex(null)}
                        >
                          <path d="M4.54492 4.50004C4.66247 4.16587 4.8945 3.88409 5.1999 3.70461C5.5053 3.52512 5.86437 3.45951 6.21351 3.5194C6.56265 3.57928 6.87933 3.7608 7.10746 4.0318C7.33559 4.30281 7.46045 4.6458 7.45992 5.00004C7.45992 6.00004 5.95992 6.50004 5.95992 6.50004M6 8.5H6.005M11 6C11 8.76142 8.76142 11 6 11C3.23858 11 1 8.76142 1 6C1 3.23858 3.23858 1 6 1C8.76142 1 11 3.23858 11 6Z" stroke="#0A0A0A" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        {hoveredFeatureIndex === i && (
                          <div className="absolute bottom-full right-0 mb-2 w-64 p-3 bg-gray-900 text-white text-sm rounded-lg shadow-lg z-50">
                            <div>{featureDescription}</div>
                            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                          </div>
                        )}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Button always at bottom */}
          <div className="relative flex-shrink-0 mt-auto">
            <button
              onClick={onButtonClick}
              disabled={isLoading}
              className="w-[253px] h-[36px] px-4 py-2 font-medium text-sm transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
              style={{
                fontFamily:
                  'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                background: "var(--base-primary, #298558)",
                color: "var(--pricing-button-text, #FAFAFA)",
                borderRadius: "var(--pricing-border-radius, 10px)",
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.background = "var(--base-primary-hover, #1a5a3a)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--base-primary, #298558)";
              }}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Processing...
                </span>
              ) : (
                buttonText
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // For solid border colors, use normal border
  return (
    <div
      className={`cuprice-pricing-card ${isPopular ? "cuprice-pricing-card--popular" : ""} shadow-lg flex flex-col p-5 w-[295px] h-[414px] gap-4 relative ${
        isPopular ? "ring-2" : ""
      }`}
      style={{
        ...cardStyle,
        borderTop: `1px solid var(--pricing-border-color, #E5E5E5)`,
      }}
    >
      {isPopular && (
        <div
          ref={badgeRef}
          className="absolute -top-3 left-1/2 -translate-x-1/2 transform px-4 py-1 text-sm font-medium"
          style={{
            background: "var(--base-primary, var(--popular-badge-bg, #22C55E))",
            color: badgeTextColor,
            border: "1px solid var(--base-primary, var(--popular-badge-border, #16A34A))",
            borderRadius: "var(--pricing-border-radius, 10px)",
          }}
        >
          Most Popular
        </div>
      )}
      
      {/* Content that can grow */}
      <div className="flex-1 flex flex-col w-full items-center text-center min-h-0">
        <div className="flex justify-between items-center mb-4 w-full flex-shrink-0">
          <h3 className="text-2xl font-extrabold" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif', background: 'var(--pricing-header-text-color, #737373)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>{title}</h3>
          <div className="w-[42px] h-[20px] bg-white border border-[#E5E5E5] text-gray-600 text-xs font-medium px-2 py-1 rounded-md flex items-center justify-center">
            {isFree ? 'Free' : 'Paid'}
          </div>
        </div>
        
        {/* Pricing Display */}
        <div className="mb-6 w-full text-left flex-shrink-0">
          {freemiumDay && freemiumDay > 0 ? (
            <div className="flex flex-col">
              <div className="mb-1 relative overflow-hidden" style={{ height: '28px' }}>
                <div
                  key={`${price}-${period}`}
                  className="absolute inset-0 transition-all duration-300 ease-in-out"
                  style={{
                    transform: 'translateY(0)',
                    opacity: 1,
                  }}
                >
                  <span className="text-2xl font-bold" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif', lineHeight: '100%', background: 'var(--pricing-price-color, #0A0A0A)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>{currencySymbol}0</span>
                  <span className="text-2xl font-normal ml-1" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif', lineHeight: '100%', background: 'var(--pricing-price-color, #0A0A0A)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>| {period === 'mth' ? 'Month' : 'Year'}</span>
                </div>
              </div>
              <div className="text-sm font-normal" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif', background: 'var(--pricing-description-color, var(--pricing-text-color, var(--base-foreground, #0A0A0A)))', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
                Get {freemiumDay} {freemiumDay === 1 ? 'day' : 'days'} free access to all premium features
              </div>
            </div>
          ) : isFree ? (
            <div className="mb-2 relative overflow-hidden" style={{ height: '28px' }}>
              <div
                key={`${price}-${period}`}
                className="absolute inset-0 transition-all duration-300 ease-in-out"
                style={{
                  transform: 'translateY(0)',
                  opacity: 1,
                }}
              >
                <span className="text-2xl font-bold" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif', lineHeight: '100%', background: 'var(--pricing-price-color, #0A0A0A)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>{currencySymbol}0</span>
                <span className="text-2xl font-normal ml-1" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif', lineHeight: '100%', background: 'var(--pricing-price-color, #0A0A0A)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>| {period === 'mth' ? 'Month' : 'Year'}</span>
              </div>
            </div>
          ) : (
            <div className="mb-2 relative overflow-hidden" style={{ height: '28px' }}>
              <div
                key={`${price}-${period}`}
                className="absolute inset-0 transition-all duration-300 ease-in-out"
                style={{
                  transform: 'translateY(0)',
                  opacity: 1,
                }}
              >
                <span className="text-2xl font-bold" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif', lineHeight: '100%', background: 'var(--pricing-price-color, #0A0A0A)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
                  {currencySymbol}{price}
                </span>
                <span className="text-2xl font-normal ml-1" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif', lineHeight: '100%', background: 'var(--pricing-price-color, #0A0A0A)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>| {period === 'mth' ? 'Month' : 'Year'}</span>
              </div>
            </div>
          )}
        </div>

        <ul className="space-y-[10px] w-full">
          {features.map((feature, i) => {
            const featureName = typeof feature === 'string' ? feature : feature.name;
            const featureDescription = typeof feature === 'string' ? undefined : feature.description;
            const hasDescription = featureDescription && featureDescription.trim() !== '';
            
            return (
              <li key={i} className="flex items-center gap-1 h-[22px] px-2 py-1 relative flex-shrink-0">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
                  <path d="M10 3L4.5 8.5L2 6" stroke="#0A0A0A" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-lg font-medium text-left" style={{ fontFamily: 'font/font-sans', lineHeight: '100%', background: 'var(--pricing-text-color, var(--base-foreground, #0A0A0A))', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>{featureName}</span>
                {hasDescription && (
                  <div className="relative">
                    <svg 
                      width="12" 
                      height="12" 
                      viewBox="0 0 12 12" 
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg"
                      className="flex-shrink-0 cursor-help"
                      onMouseEnter={() => setHoveredFeatureIndex(i)}
                      onMouseLeave={() => setHoveredFeatureIndex(null)}
                    >
                      <path d="M4.54492 4.50004C4.66247 4.16587 4.8945 3.88409 5.1999 3.70461C5.5053 3.52512 5.86437 3.45951 6.21351 3.5194C6.56265 3.57928 6.87933 3.7608 7.10746 4.0318C7.33559 4.30281 7.46045 4.6458 7.45992 5.00004C7.45992 6.00004 5.95992 6.50004 5.95992 6.50004M6 8.5H6.005M11 6C11 8.76142 8.76142 11 6 11C3.23858 11 1 8.76142 1 6C1 3.23858 3.23858 1 6 1C8.76142 1 11 3.23858 11 6Z" stroke="#0A0A0A" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {hoveredFeatureIndex === i && (
                      <div className="absolute bottom-full right-0 mb-2 w-64 p-3 bg-gray-900 text-white text-sm rounded-lg shadow-lg z-50">
                        <div>{featureDescription}</div>
                        <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                      </div>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {/* Button always at bottom */}
      <div className="relative flex-shrink-0 mt-auto">
        <button
          onClick={onButtonClick}
          disabled={isLoading}
          className="cuprice-pricing-button w-[253px] h-[36px] px-4 py-2 font-medium text-sm transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
          style={{
            fontFamily:
              'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
            background: "var(--base-primary, #298558)",
            color: "var(--pricing-button-text, #FAFAFA)",
            borderRadius: "var(--pricing-border-radius, 10px)",
          }}
          onMouseEnter={(e) => {
            if (!isLoading) {
              e.currentTarget.style.background = "var(--base-primary-hover, #1a5a3a)";
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "var(--base-primary, #298558)";
          }}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Processing...
            </span>
          ) : (
            buttonText
          )}
        </button>
      </div>
    </div>
  );
};

export default PricingCard;

