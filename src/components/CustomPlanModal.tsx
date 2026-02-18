import React, { useEffect, useRef, useState } from 'react';
import { CheckCircle2, ChevronDown, Plus, Stamp, X, User, Calendar } from 'lucide-react';
import type { SharedProject } from '../types';
import { formatPrice } from '../utils';

interface CustomPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  project?: SharedProject;
  onSubscribe?: (selectedFeatures: string[], userCount: number, duration: string, featureUsageAmounts?: Record<string, number>) => void;
}

function getFocusable(container: HTMLElement | null): HTMLElement[] {
  if (!container) return [];
  const selectors = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ];
  return Array.from(
    container.querySelectorAll<HTMLElement>(selectors.join(','))
  ).filter((el) => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden'));
}

const CustomPlanModal: React.FC<CustomPlanModalProps> = ({
  isOpen, 
  onClose, 
  project,
  onSubscribe 
}) => {
  const allFeatures = project?.features || [];

  const [selected, setSelected] = useState<string[]>([]);
  const [featureUsageAmounts, setFeatureUsageAmounts] = useState<Record<string, number>>({});
  const [featureCategory, setFeatureCategory] = useState<"Countable" | "Standard" | "AI">("Countable");
  const [summaryCategory, setSummaryCategory] = useState<"Countable" | "Standard" | "AI">("Countable");
  const [userCount, setUserCount] = useState<number>(1);
  const [subscriptionDuration, setSubscriptionDuration] = useState<"month" | "3months" | "6months" | "9months" | "12months">("month");

  const [mounted, setMounted] = useState(isOpen);
  const [visible, setVisible] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
      const t = setTimeout(() => setMounted(false), 200);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!mounted) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mounted, onClose]);

  const panelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!mounted) return;
    const nodes = getFocusable(panelRef.current);
    if (nodes.length > 0) {
      nodes[0]?.focus();
    }
    const handler = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const nodes = getFocusable(panelRef.current);
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    const currentPanel = panelRef.current;
    currentPanel?.addEventListener('keydown', handler as EventListener);
    return () => currentPanel?.removeEventListener('keydown', handler as EventListener);
  }, [mounted]);

  const handleAdd = (featureName: string) => {
    setSelected((prev) => {
      if (prev.includes(featureName)) return prev;
      
      // Set default usage amount for Limits features
      const featureObj = project?.features?.find(f => f.name === featureName);
      if (featureObj?.featureType === "Limits" && featureObj.countableData) {
        setFeatureUsageAmounts(prevAmounts => ({
          ...prevAmounts,
          [featureName]: featureObj.countableData!.usageCount
        }));
      }
      
      return [...prev, featureName];
    });
  };

  const handleRemove = (feature: string) => {
    setSelected((prev) => prev.filter((f) => f !== feature));
    // Remove usage amount when feature is removed
    setFeatureUsageAmounts(prev => {
      const updated = { ...prev };
      delete updated[feature];
      return updated;
    });
  };

  const handleUsageAmountChange = (featureName: string, amount: number) => {
    setFeatureUsageAmounts(prev => ({
      ...prev,
      [featureName]: Math.max(0, amount) // Ensure non-negative
    }));
  };

  useEffect(() => {
    const mg = project?.monthGroupDiscounts || {};
    if (subscriptionDuration === "3months" && (!mg["3"] || mg["3"] <= 0)) {
      setSubscriptionDuration("month");
    } else if (subscriptionDuration === "6months" && (!mg["6"] || mg["6"] <= 0)) {
      setSubscriptionDuration("month");
    } else if (subscriptionDuration === "9months" && (!mg["9"] || mg["9"] <= 0)) {
      setSubscriptionDuration("month");
    } else if (subscriptionDuration === "12months" && (!project?.annualDiscountEnabled || !project?.annualDiscount || project.annualDiscount <= 0)) {
      setSubscriptionDuration("month");
    }
  }, [project, subscriptionDuration]);

  // Calculate base monthly price (before discount)
  const calculateBaseMonthlyPrice = (): number => {
    if (!project?.features || selected.length === 0) return 0;
    const selectedFeatureObjects = project.features.filter(f => selected.includes(f.name));
    const basePrice = selectedFeatureObjects.reduce((total, feature) => {
      // For Usage Based features, calculate based on usage amount
      if (feature.featureType === "Usage Based" && feature.countableData) {
        const usageAmount = featureUsageAmounts[feature.name] || 0;
        return total + (feature.countableData.countPrice * usageAmount);
      }
      // For Limits features, calculate based on limit amount
      if (feature.featureType === "Limits" && feature.countableData) {
        const limitAmount = featureUsageAmounts[feature.name] || feature.countableData.usageCount || 0;
        return total + (feature.countableData.countPrice * limitAmount);
      }
      // For Standard features, use basePrice
      return total + feature.basePrice;
    }, 0);
    return basePrice * userCount;
  };

  const calculateTotalPrice = (): number => {
    if (!project?.features || selected.length === 0) return 0;
    
    const monthlyPrice = calculateBaseMonthlyPrice();

    const mg = project?.monthGroupDiscounts || {};
    let months = 1;
    let discount = 0;
    if (subscriptionDuration === "3months") { months = 3; discount = mg["3"] ?? 0; }
    else if (subscriptionDuration === "6months") { months = 6; discount = mg["6"] ?? 0; }
    else if (subscriptionDuration === "9months") { months = 9; discount = mg["9"] ?? 0; }
    else if (subscriptionDuration === "12months") { 
      months = 12; 
      discount = project?.annualDiscountEnabled ? (project?.annualDiscount ?? 0) : 0; 
    }

    return monthlyPrice * months * (1 - discount);
  };

  const renderCategoryTabs = (
    activeCategory: "Countable" | "Standard" | "AI",
    onSelect: (category: "Countable" | "Standard" | "AI") => void,
    extraClasses = ""
  ) => (
    <div
      className={`relative flex items-center gap-1 rounded-lg p-[3px] ${extraClasses}`}
      style={{ height: "32px", backgroundColor: "#FBFAF9", width: "fit-content" }}
    >
      <div
        className={`absolute top-[3px] h-[26px] bg-white rounded-md transition-all duration-300 ease-in-out border border-t-white ${
          activeCategory === "Countable"
            ? "left-[3px] w-[70px]"
            : activeCategory === "Standard"
            ? "left-[76px] w-[65px]"
            : "left-[144px] w-[50px]"
        }`}
        style={{
          boxShadow: "0px 1px 2px 0px rgba(0, 0, 0, 0.05), 0px 1px 3px 0px rgba(0, 0, 0, 0.1)",
        }}
      />
      {(["Countable", "Standard", "AI"] as const).map((name) => (
        <button
          key={name}
          type="button"
          onClick={() => onSelect(name)}
          className={`relative z-10 rounded-md text-xs font-medium font-sans text-center transition-colors duration-300 py-1 px-2 flex items-center justify-center flex-shrink-0 ${
            activeCategory === name ? "text-[#0A0A0A]" : "text-black"
          }`}
          style={{
            width: name === "Countable" ? "70px" : name === "Standard" ? "65px" : "50px",
            height: "26px",
            letterSpacing: "0%",
            lineHeight: "1rem",
          }}
        >
          {name}
        </button>
      ))}
    </div>
  );

  const canSubscribe = selected.length > 0;

  const handleSubscribe = () => {
    if (canSubscribe && onSubscribe) {
      onSubscribe(selected, userCount, subscriptionDuration, featureUsageAmounts);
    }
  };

  if (!mounted) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${visible ? 'bg-black/50' : 'bg-black/0'} transition-colors duration-200`}
      aria-hidden={!visible}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        ref={panelRef}
        className={`w-full max-w-6xl rounded-[18px] shadow-xl ring-1 ring-black/5 flex flex-col transform transition-all duration-200 ${
          visible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 sm:translate-y-0 sm:scale-95'
        }`}
      >
        <div className="flex flex-1 max-h-[631px] flex-col md:flex-row overflow-hidden rounded-[18px] bg-[#F8FAFC]">
          <section 
            className="md:w-[295px] border-b md:border-b-0 md:border-r p-4 flex flex-col bg-[#F8FAFC]"
            aria-labelledby="features-heading"
          >
            <h3 id="features-heading" className="text-base font-medium mb-1">Your Custom Plan</h3>
            <p className="text-xs text-gray-500 mb-4">You can select your relevant features that you will use.</p>
            
            {renderCategoryTabs(featureCategory, setFeatureCategory, "mb-4")}

            <div className="flex justify-between text-xs text-gray-700 mb-2" aria-live="polite">
              <span>Total features</span>
              <span>{Array.isArray(allFeatures) ? allFeatures.length : 0}</span>
            </div>

            <ul className="space-y-2 overflow-y-auto pr-1" role="list">
              {allFeatures.map((feature, idx) => {
                const featureName = typeof feature === 'string' ? feature : feature.name;
                const featureObj = project?.features?.find(f => f.name === featureName);
                const isSelected = selected.includes(featureName);
                const isUsageBased = featureObj?.featureType === "Usage Based";
                const isLimits = featureObj?.featureType === "Limits";
                const countableData = featureObj?.countableData;
                
                return (
                  <li key={idx} className="flex flex-col bg-white border rounded-md px-3 py-2 min-h-[64px]">
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col gap-1 flex-1 min-w-0">
                        <span className="text-sm font-medium truncate">{featureName}</span>
                      {featureObj && (
                        <div className="text-xs text-gray-500">
                          {isUsageBased || isLimits ? (
                            countableData ? (
                              <span>
                                {formatPrice(countableData.countPrice, project?.currency || 'USD')} per {countableData.condition}
                              </span>
                            ) : (
                              <span>{formatPrice(featureObj.basePrice, project?.currency || 'USD')}</span>
                            )
                          ) : (
                            <span>{formatPrice(featureObj.basePrice, project?.currency || 'USD')} per user/month</span>
                          )}
                        </div>
                      )}
                      </div>

                      <button
                        onClick={() => isSelected ? handleRemove(featureName) : handleAdd(featureName)}
                        className={`h-9 w-9 flex justify-center items-center rounded-[8px] flex-shrink-0 ${
                          isSelected
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                            : 'bg-white border border-gray-300 hover:border-emerald-600 text-emerald-600'
                        }`}
                        aria-label={isSelected ? `Remove ${featureName}` : `Add ${featureName}`}
                      >
                        {isSelected ? <CheckCircle2 size={18} className="text-white" /> : <Plus size={18} />}
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>

          {/* Middle: Selected plan (dashboard web style) */}
          <section
            className="md:w-1/2 md:border-b-0 md:border-r border-b p-4 flex flex-col bg-[#F8FAFC]"
            aria-labelledby="selected-plan-heading"
          >
            <h3
              className="font-sans font-semibold text-base leading-tight tracking-tight mb-4"
              style={{ color: "var(--base-card-foreground, #0A0A0A)" }}
            >
              Your Custom Plan
            </h3>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
              {renderCategoryTabs(summaryCategory, setSummaryCategory)}
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <span>Total Features</span>
                <span>{Array.isArray(allFeatures) ? allFeatures.length : 0}</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-600 text-sm">
                <span>Added Features</span>
                <span>{selected.length}</span>
              </div>
            </div>

            <h3 id="selected-plan-heading" className="sr-only">Selected features</h3>

            <div className="flex-1 border rounded-md p-4 overflow-y-auto bg-white">
              {selected.length === 0 ? (
                <p className="text-gray-400 text-sm">No features added yet</p>
              ) : (
                <ul className="grid grid-cols-2 xs-320:grid-cols-1 xs-360:grid-cols-1 xs-375:grid-cols-2 gap-2">
                  {selected.map((feature, idx) => {
                    const featureObj = project?.features?.find(f => f.name === feature);
                    const isUsageBased = featureObj?.featureType === "Usage Based";
                    const isLimits = featureObj?.featureType === "Limits";
                    const countableData = featureObj?.countableData;

                    const getAggregationLabel = (method: string | null | undefined) => {
                      if (!method || method === "-") return "";
                      const labels: Record<string, string> = { sum: "Total usage", max: "Peak usage", avg: "Average usage" };
                      return labels[method] || method;
                    };

                    return (
                      <li key={idx} className="group relative bg-white border border-gray-200 rounded-lg p-2.5 hover:border-emerald-300 transition-all duration-200">
                        <div className="flex justify-between items-start gap-2">
                          <div className="flex flex-col flex-1 gap-2 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="font-medium text-xs text-gray-900 leading-tight">{feature}</h4>
                              <button
                                onClick={() => handleRemove(feature)}
                                className="opacity-0 group-hover:opacity-100 w-5 h-5 flex justify-center items-center rounded text-gray-400 hover:text-red-500 transition-all duration-200 flex-shrink-0"
                                aria-label={`Remove ${feature}`}
                              >
                                <X size={12} />
                              </button>
                            </div>

                            {featureObj && (
                              <div className="space-y-2">
                                {(isUsageBased || isLimits) ? (
                                  <>
                                    {countableData && (
                                      <>
                                        <div className="flex items-baseline gap-1">
                                          <span className="text-sm font-semibold text-gray-900">
                                            {formatPrice(countableData?.countPrice ?? 0, project?.currency || 'USD')}
                                          </span>
                                          <span className="text-[10px] text-gray-500">
                                            /{countableData?.condition || ''}
                                          </span>
                                        </div>

                                        <div className="flex items-center">
                                          <div className="flex-1 relative">
                                            <input
                                              type="text"
                                              inputMode="decimal"
                                              value={featureUsageAmounts[feature] !== undefined
                                                ? (featureUsageAmounts[feature] === 0 ? '' : String(featureUsageAmounts[feature]))
                                                : (isLimits ? String(countableData.usageCount) : '')}
                                              onChange={(e) => {
                                                const value = e.target.value;
                                                if (value === '' || /^\d*\.?\d*$/.test(value)) {
                                                  handleUsageAmountChange(feature, parseFloat(value) || 0);
                                                }
                                              }}
                                              placeholder={isLimits ? String(countableData.usageCount) : "0"}
                                              className="w-full px-2 py-1.5 pr-16 text-xs border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white transition-all"
                                            />
                                            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 pointer-events-none">
                                              {countableData.condition}
                                            </span>
                                          </div>
                                        </div>

                                        {(() => {
                                          const usageAmount = featureUsageAmounts[feature] !== undefined
                                            ? featureUsageAmounts[feature]
                                            : (isLimits ? (countableData?.usageCount ?? 0) : 0);
                                          const countPrice = countableData?.countPrice ?? 0;
                                          const calculatedPrice = usageAmount > 0 && countPrice > 0
                                            ? (countPrice * usageAmount) * userCount
                                            : 0;

                                          return calculatedPrice > 0 ? (
                                            <div className="flex items-center justify-between pt-1.5 border-t border-gray-100">
                                              <span className="text-[9px] text-gray-500">
                                                {isUsageBased && countableData.eventAggregationMethod && (
                                                  <>{getAggregationLabel(countableData.eventAggregationMethod)} • </>
                                                )}
                                                Monthly
                                              </span>
                                              <span className="text-xs font-semibold text-emerald-600">
                                                {formatPrice(calculatedPrice, project?.currency || 'USD')}
                                              </span>
                                            </div>
                                          ) : (
                                            <div className="pt-0.5">
                                              <span className="text-[9px] text-gray-400">
                                                {isUsageBased && countableData.eventAggregationMethod && (
                                                  <>{getAggregationLabel(countableData.eventAggregationMethod)} • </>
                                                )}
                                                Enter amount
                                              </span>
                                            </div>
                                          );
                                        })()}
                                      </>
                                    )}
                                  </>
                                ) : (
                                  <div className="flex items-baseline gap-1">
                                    <span className="text-sm font-semibold text-gray-900">
                                      {formatPrice(featureObj.basePrice, project?.currency || 'USD')}
                                    </span>
                                    <span className="text-[10px] text-gray-500">/user/month</span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </section>

          {/* Right: Pricing & Subscribe (dashboard web style) */}
          <section
            className="md:w-[295px] p-4 flex flex-col bg-[#F8FAFC]"
            style={{
              borderTopRightRadius: '18px',
              borderBottomRightRadius: '18px',
              borderTopLeftRadius: '0px',
              borderBottomLeftRadius: '0px',
            }}
            aria-labelledby="pricing-heading"
          >
            <h3 id="pricing-heading" className="text-base font-medium mb-1">Features</h3>
            <p className="text-xs text-gray-500 mb-4">You can choose seat and month group.</p>

            <div className="p-4">
              <div className="flex gap-3 mb-4">
                <div className="flex-1">
                  <label className="block text-sm text-gray-700 mb-2">Users</label>
                  <div className="relative">
                    <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 z-10 pointer-events-none" aria-hidden="true" />
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 z-10 pointer-events-none" aria-hidden="true" />
                    <select
                      value={userCount}
                      onChange={(e) => setUserCount(Number(e.target.value))}
                      className="w-full border rounded-md pl-10 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 appearance-none bg-white"
                    >
                      <option value={1}>1</option>
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                  </div>
                </div>

                <div className="flex-1">
                  <label className="block text-sm text-gray-700 mb-2">Select months</label>
                  <div className="relative">
                    <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 z-10 pointer-events-none" aria-hidden="true" />
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 z-10 pointer-events-none" aria-hidden="true" />
                    <select
                      value={subscriptionDuration}
                      onChange={(e) => setSubscriptionDuration(e.target.value as "month" | "3months" | "6months" | "9months" | "12months")}
                      className="w-full border rounded-md pl-10 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 appearance-none bg-white"
                    >
                      <option value="month">Monthly</option>
                      {project?.monthGroupDiscounts?.["3"] && project.monthGroupDiscounts["3"] > 0 && (
                        <option value="3months">3 Months ({Math.round(project.monthGroupDiscounts["3"] * 100)}%)</option>
                      )}
                      {project?.monthGroupDiscounts?.["6"] && project.monthGroupDiscounts["6"] > 0 && (
                        <option value="6months">6 Months ({Math.round(project.monthGroupDiscounts["6"] * 100)}%)</option>
                      )}
                      {project?.monthGroupDiscounts?.["9"] && project.monthGroupDiscounts["9"] > 0 && (
                        <option value="9months">9 Months ({Math.round(project.monthGroupDiscounts["9"] * 100)}%)</option>
                      )}
                      {project?.annualDiscountEnabled && project?.annualDiscount && project.annualDiscount > 0 && (
                        <option value="12months">12 Months ({Math.round(project.annualDiscount * 100)}%)</option>
                      )}
                    </select>
                  </div>
                </div>
              </div>

              {(() => {
                const baseMonthlyPrice = calculateBaseMonthlyPrice();
                const mg = project?.monthGroupDiscounts || {};
                let months = 1;
                let discount = 0;
                if (subscriptionDuration === "3months") { months = 3; discount = mg["3"] ?? 0; }
                else if (subscriptionDuration === "6months") { months = 6; discount = mg["6"] ?? 0; }
                else if (subscriptionDuration === "9months") { months = 9; discount = mg["9"] ?? 0; }
                else if (subscriptionDuration === "12months") { months = 12; discount = project?.annualDiscountEnabled ? (project?.annualDiscount ?? 0) : 0; }
                const totalBeforeDiscount = baseMonthlyPrice * months;
                const discountAmount = totalBeforeDiscount * discount;
                const totalPrice = calculateTotalPrice();

                return (
                  <div className="space-y-2 mb-4" style={{ fontSize: '14px' }}>
                    <div className="flex justify-between items-center">
                      <span>Monthly Price</span>
                      <span>{formatPrice(baseMonthlyPrice, project?.currency || 'USD')}/month</span>
                    </div>
                    <div className="flex justify-between items-center text-gray-600">
                      <span>Month duration({months} Months)</span>
                      <span>x{months}= {formatPrice(totalBeforeDiscount, project?.currency || 'USD')}</span>
                    </div>
                    <div className="flex justify-between items-center text-emerald-600">
                      <span>Total Discount({Math.round(discount * 100)}%)</span>
                      <span>-{formatPrice(discountAmount, project?.currency || 'USD')}</span>
                    </div>
                    <div className="flex justify-between items-center font-semibold text-emerald-600 border-t pt-2 mt-2" style={{ fontSize: '14px' }}>
                      <span>Total Price</span>
                      <span>{formatPrice(totalPrice, project?.currency || 'USD')}</span>
                    </div>
                  </div>
                );
              })()}

              <div className="flex flex-col gap-3">
                <button
                  onClick={handleSubscribe}
                  className={`w-full text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 transition-colors flex items-center justify-center gap-2 ${
                    canSubscribe ? '' : 'opacity-50 cursor-not-allowed'
                  }`}
                  style={{
                    background: project?.themeSettings?.customPlanButtonColor || project?.themeSettings?.customPlanCardButtonColor || '#298558',
                    color: project?.themeSettings?.customPlanButtonTextColor || '#FAFAFA',
                  }}
                  onMouseEnter={(e) => {
                    if (canSubscribe) {
                      e.currentTarget.style.background = project?.themeSettings?.hoverColor || '#3E9D70';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (canSubscribe) {
                      e.currentTarget.style.background = project?.themeSettings?.customPlanButtonColor || project?.themeSettings?.customPlanCardButtonColor || '#298558';
                    }
                  }}
                  disabled={!canSubscribe}
                >
                  <Stamp size={18} />
                  <span>Subscribe now</span>
                </button>
                <button
                  onClick={onClose}
                  className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-red-300 flex items-center justify-center gap-2"
                >
                  <X size={18} />
                  <span>Cancel</span>
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CustomPlanModal;

