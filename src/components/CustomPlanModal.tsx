import React, { useEffect, useRef, useState } from 'react';
import { Plus, X, User, Calendar } from 'lucide-react';
import type { SharedProject } from '../types';
import { formatPrice } from '../utils';

interface CustomPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  project?: SharedProject;
  onSubscribe?: (selectedFeatures: string[], userCount: number, duration: string) => void;
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
  const allFeatures = project?.features 
    ? [...new Set(project.features.map(f => f.name))] 
    : [];

  const [selected, setSelected] = useState<string[]>([]);
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

  const handleAdd = (feature: string) => {
    setSelected((prev) => (prev.includes(feature) ? prev : [...prev, feature]));
  };

  const handleRemove = (feature: string) => {
    setSelected((prev) => prev.filter((f) => f !== feature));
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

  const calculateTotalPrice = (): number => {
    if (!project?.features || selected.length === 0) return 0;
    
    const selectedFeatureObjects = project.features.filter(f => selected.includes(f.name));
    const basePrice = selectedFeatureObjects.reduce((total, feature) => {
      return total + feature.basePrice;
    }, 0);
    
    const monthlyPrice = basePrice * userCount;

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

  if (!mounted) return null;

  const renderCategoryTabs = (
    activeCategory: "Countable" | "Standard" | "AI",
    onSelect: (category: "Countable" | "Standard" | "AI") => void,
    extraClasses = ""
  ) => (
    <div
      className={`relative flex items-center gap-2 rounded-lg p-[3px] ${extraClasses}`}
      style={{ width: "194px", height: "36px", backgroundColor: "#FBFAF9" }}
    >
      <div
        className={`absolute top-[3px] left-[3px] w-[84px] h-[28px] bg-white rounded-md transition-transform duration-300 ease-in-out border border-t-white ${
          activeCategory === "Countable"
            ? "translate-x-0"
            : activeCategory === "Standard"
            ? "translate-x-[92px]"
            : "translate-x-[184px]"
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
          className={`relative z-10 rounded-md text-sm font-medium font-sans text-center transition-colors duration-300 py-1 px-2 flex items-center justify-center flex-shrink-0 ${
            activeCategory === name ? "text-[#0A0A0A]" : "text-black"
          } w-[84px] h-[28px]`}
          style={{
            minWidth: "84px",
            letterSpacing: "0%",
            lineHeight: "1.25rem",
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
      onSubscribe(selected, userCount, subscriptionDuration);
    }
  };

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
        <div className="flex flex-1 max-h-[631px] flex-col md:flex-row overflow-hidden rounded-[18px]">
          <section 
            className="md:w-[295px] border-b md:border-b-0 md:border-r p-4 flex flex-col bg-[#F8FAFC] rounded-[18px]" 
            aria-labelledby="features-heading"
          >
            <h3 id="features-heading" className="text-base font-medium mb-1">Features</h3>
            <p className="text-xs text-gray-500 mb-4">You can choose your relevant features that you will use.</p>
            
            {renderCategoryTabs(featureCategory, setFeatureCategory, "mb-4")}

            <div className="flex justify-between text-xs text-gray-700 mb-2" aria-live="polite">
              <span>Features</span> 
              <span>{allFeatures.length}</span>
            </div>

            <ul className="space-y-2 overflow-y-auto pr-1" role="list">
              {allFeatures.map((feature, idx) => (
                <li key={idx} className="flex justify-between items-center bg-white border rounded-md h-[64px] px-3 py-2">
                  <span className="text-sm">{feature}</span>
                  <button
                    onClick={() => handleAdd(feature)}
                    className="h-9 w-9 flex justify-center items-center bg-emerald-600 hover:bg-emerald-700 text-white rounded-[8px]"
                    aria-label={`Add ${feature}`}
                  >
                    <Plus size={18} />
                  </button>
                </li>
              ))}
            </ul>
          </section>

          <section 
            className="md:w-3/4 p-4 flex flex-col bg-[#F8FAFC] rounded-[18px]" 
            aria-labelledby="selected-plan-heading"
          >
            <h3
              className="font-sans font-semibold text-base leading-tight tracking-tight mb-4"
              style={{ color: "var(--base-card-foreground, #0A0A0A)" }}
            >
              Your Custom Plan
            </h3>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
              {renderCategoryTabs(summaryCategory, setSummaryCategory)}
              <div className="flex items-center gap-2 text-gray-500 max-w-[214px]">
                <span>Total Features</span>
                <span>{allFeatures.length}</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-600 max-w-[214px]">
                <span>Added Features</span>
                <span>{selected.length}</span>
              </div>
            </div>

            <h3 id="selected-plan-heading" className="sr-only">Selected features</h3>

            <div className="flex-1 border rounded-md p-4 mb-4 overflow-y-auto">
              {selected.length === 0 ? (
                <p className="text-gray-400 text-sm">No features added yet</p>
              ) : (
                <div className="space-y-4">
                  <ul className="grid items-center grid-cols-2 gap-y-4">
                    {selected.map((feature, idx) => {
                      const featureObj = project?.features?.find(f => f.name === feature);
                      return (
                        <li key={idx} className="flex justify-between items-center bg-gray-50 border rounded-[10px] px-3 py-2 h-[64px] w-[355px]">
                          <div className="flex flex-col">
                            <span className="font-medium">{feature}</span>
                            {featureObj && (
                              <span className="text-xs text-gray-500">
                                {formatPrice(featureObj.basePrice, project?.currency || 'USD')} per user/month
                              </span>
                            )}
                          </div>
                          <button
                            onClick={() => handleRemove(feature)}
                            className="w-9 h-9 flex justify-center items-center rounded-[8px] shadow-md text-black hover:text-gray-700 border focus:outline-none"
                            aria-label={`Remove ${feature}`}
                          >
                            <X size={18} />
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                  
                  {selected.length > 0 && (
                    <div className="border-t pt-4 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Monthly price ({userCount} users):</span>
                        <span>{formatPrice(
                          (() => {
                            if (subscriptionDuration === "month") return calculateTotalPrice();
                            const months = subscriptionDuration === "3months" ? 3 : subscriptionDuration === "6months" ? 6 : subscriptionDuration === "9months" ? 9 : 12;
                            return calculateTotalPrice() / months;
                          })(),
                          project?.currency || 'USD'
                        )}</span>
                      </div>
                      {(subscriptionDuration === "3months" || subscriptionDuration === "6months" || subscriptionDuration === "9months") && (
                        <div className="flex justify-between text-gray-600">
                          <span>Duration ({subscriptionDuration.replace("months"," months")}):</span>
                          <span>× {subscriptionDuration === "3months" ? 3 : subscriptionDuration === "6months" ? 6 : 9}</span>
                        </div>
                      )}
                      {subscriptionDuration === "12months" && (
                        <div className="flex justify-between text-gray-600">
                          <span>Duration (12 months):</span>
                          <span>× 12</span>
                        </div>
                      )}
                      {(subscriptionDuration === "3months" || subscriptionDuration === "6months" || subscriptionDuration === "9months") && (
                        <div className="flex justify-between text-emerald-600">
                          <span>Group discount:</span>
                          <span>
                            -{(() => {
                              const mg = project?.monthGroupDiscounts || {};
                              const months = subscriptionDuration === "3months" ? 3 : subscriptionDuration === "6months" ? 6 : 9;
                              const discount = mg[String(months)] ?? 0;
                              const monthly = calculateTotalPrice() / months;
                              return formatPrice(monthly * months * discount, project?.currency || 'USD');
                            })()}
                          </span>
                        </div>
                      )}
                      {subscriptionDuration === "12months" && project?.annualDiscountEnabled && (
                        <div className="flex justify-between text-emerald-600">
                          <span>Annual discount:</span>
                          <span>
                            -{(() => {
                              const discount = project?.annualDiscount ?? 0;
                              const monthly = calculateTotalPrice() / 12;
                              return formatPrice(monthly * 12 * discount, project?.currency || 'USD');
                            })()}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between font-medium border-t pt-2">
                        <span>Total price:</span>
                        <span>{formatPrice(calculateTotalPrice(), project?.currency || 'USD')}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t pt-3 mb-4">
              <label className="flex items-center gap-2">
                <User size={18} aria-hidden="true" />
                <span className="sr-only">Number of users</span>
                <select 
                  value={userCount}
                  onChange={(e) => setUserCount(Number(e.target.value))}
                  className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  <option value={1}>1</option>
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </label>
              <label className="flex items-center gap-2">
                <Calendar size={18} aria-hidden="true" />
                <span className="sr-only">Subscription duration</span>
                <select 
                  value={subscriptionDuration}
                  onChange={(e) => setSubscriptionDuration(e.target.value as "month" | "3months" | "6months" | "9months" | "12months")}
                  className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
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
              </label>
              <div className="text-right">
                <span className="text-gray-500 text-sm">Total Price</span>
                <div className="font-semibold text-lg">
                  {selected.length > 0 ? formatPrice(calculateTotalPrice(), project?.currency || 'USD') : "-"}
                </div>
                {selected.length > 0 && (
                  <div className="text-xs text-gray-500">
                    {subscriptionDuration === "month" ? "per month" :
                     subscriptionDuration === "3months" ? "for 3 months" :
                     subscriptionDuration === "6months" ? "for 6 months" :
                     subscriptionDuration === "9months" ? "for 9 months" : "for 12 months"}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3 p-0">
              <button
                onClick={handleSubscribe}
                className={`flex-1 bg-emerald-600 text-white py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-300 transition-colors ${
                  canSubscribe ? 'hover:bg-emerald-700' : 'opacity-50 cursor-not-allowed'
                }`}
                disabled={!canSubscribe}
              >
                Subscribe now
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-300"
              >
                Cancel
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CustomPlanModal;

