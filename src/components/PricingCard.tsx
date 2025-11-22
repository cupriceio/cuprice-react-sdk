import React, { useState } from 'react';
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
}) => {
  const [hoveredFeatureIndex, setHoveredFeatureIndex] = useState<number | null>(null);
  
  return (
    <div
      className={`cuprice-pricing-card shadow-lg rounded-2xl flex flex-col p-5 w-[295px] h-[414px] gap-4 relative border-t border-[#E5E5E5] ${
        isPopular ? "ring-2" : ""
      }`}
      style={{
        background:
          "linear-gradient(0deg, var(--base-card, #FFFFFF), var(--base-card, #FFFFFF)), linear-gradient(180deg, rgba(23, 23, 23, 0) 0%, rgba(41, 133, 88, 0.05) 100%)",
        ...(isPopular
          ? ({
              "--tw-ring-color": "var(--popular-badge-border, #16A34A)",
              borderColor: "var(--popular-badge-border, #16A34A)",
            } as CSSProperties)
          : {}),
      }}
    >
      {isPopular && (
        <div
          className="absolute -top-3 left-1/2 -translate-x-1/2 transform px-4 py-1 rounded-full text-sm font-medium"
          style={{
            backgroundColor: "var(--popular-badge-bg, #22C55E)",
            color: "var(--popular-badge-text, #FFFFFF)",
            border: "1px solid var(--popular-badge-border, #16A34A)",
          }}
        >
          Most Popular
        </div>
      )}
      
      <div className="flex-1 flex flex-col w-full items-center text-center">
        <div className="flex justify-between items-center mb-4 w-full">
          <h3 className="text-2xl font-extrabold text-[#737373]" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>{title}</h3>
          <div className="w-[42px] h-[20px] bg-white border border-[#E5E5E5] text-gray-600 text-xs font-medium px-2 py-1 rounded-md flex items-center justify-center">
            {isFree ? 'Free' : 'Paid'}
          </div>
        </div>
        
        <div className="mb-6 w-full text-left">
          {freemiumDay && freemiumDay > 0 ? (
            <div className="flex flex-col">
              <div className="mb-1">
                <span className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif', lineHeight: '100%' }}>{currencySymbol}0</span>
                <span className="text-2xl font-normal text-gray-900 ml-1" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif', lineHeight: '100%' }}>| {period === 'mth' ? 'Month' : 'Year'}</span>
              </div>
              <div className="text-sm font-normal text-gray-900" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
                Get {freemiumDay} {freemiumDay === 1 ? 'day' : 'days'} free access to all premium features
              </div>
            </div>
          ) : isFree ? (
            <div className="mb-2">
              <span className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif', lineHeight: '100%' }}>{currencySymbol}0</span>
              <span className="text-2xl font-normal text-gray-900 ml-1" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif', lineHeight: '100%' }}>| {period === 'mth' ? 'Month' : 'Year'}</span>
            </div>
          ) : (
            <div className="mb-2">
              <span className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif', lineHeight: '100%' }}>
                {currencySymbol}{price}
              </span>
              <span className="text-2xl font-normal text-gray-900 ml-1" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif', lineHeight: '100%' }}>| {period === 'mth' ? 'Month' : 'Year'}</span>
            </div>
          )}
        </div>

        <ul className="space-y-[10px] flex-1 w-full">
          {features.map((feature, i) => {
            const featureName = typeof feature === 'string' ? feature : feature.name;
            const featureDescription = typeof feature === 'string' ? undefined : feature.description;
            const hasDescription = featureDescription && featureDescription.trim() !== '';
            
            return (
              <li key={i} className="flex items-center gap-1 h-[22px] px-2 py-1 relative" style={{ backgroundColor: 'var(--base-background, #FFFFFF)' }}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
                  <path d="M10 3L4.5 8.5L2 6" stroke="#0A0A0A" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-lg font-medium text-left" style={{ fontFamily: 'font/font-sans', lineHeight: '100%', color: 'var(--base-foreground, #0A0A0A)' }}>{featureName}</span>
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
                        <div className="text-xs font-medium mb-1">Description:</div>
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

      <div className="relative">
        <button
          onClick={onButtonClick}
          className="w-[253px] h-[36px] px-4 py-2 rounded-md font-medium text-sm transition hover:brightness-95"
          style={{
            fontFamily:
              'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
            backgroundColor: "var(--base-primary, #298558)",
            color: "var(--pricing-button-text, #FAFAFA)",
          }}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default PricingCard;

