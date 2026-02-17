import React from 'react';
import { CupricePricing } from '../src/components/CupricePricing';
import type { SharedPlan } from '../src/types';

function App() {
  const handlePlanSelect = (plan: SharedPlan) => {
    console.log('Plan selected:', plan);
    // Handle plan selection (e.g., redirect to checkout)
    // Example: window.location.href = `/checkout?planId=${plan.id}`;
  };

  const handleCustomPlanClick = () => {
    console.log('Custom plan clicked');
    // Handle custom plan modal open (optional)
  };

  const handleCustomPlanSubscribe = (
    features: string[], 
    userCount: number, 
    duration: string,
    featureUsageAmounts?: Record<string, number>
  ) => {
    console.log('Custom plan subscribe:', { 
      features, 
      userCount, 
      duration,
      featureUsageAmounts // Usage amounts for usage-based/limits features
    });
    
    // Handle custom plan subscription
    // featureUsageAmounts contains usage amounts like: 
    // { "API Calls": 10000, "Storage": 500, "Requests": 50000 }
    
    // Example: Send to your backend API
    // fetch('/api/subscribe', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     features,
    //     userCount,
    //     duration,
    //     featureUsageAmounts,
    //   }),
    // });
  };

  return (
    <div className="App">
      <CupricePricing 
        shareId="your-share-id-here"
        apiUrl="https://your-api-domain.com" // Optional: defaults to current origin
        onPlanSelect={handlePlanSelect}
        onCustomPlanClick={handleCustomPlanClick}
        onCustomPlanSubscribe={handleCustomPlanSubscribe}
        className="my-custom-class" // Optional: additional CSS classes
      />
    </div>
  );
}

export default App;

