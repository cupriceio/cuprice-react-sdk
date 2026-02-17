import React from 'react';
import { CupricePricing } from '../src/components/CupricePricing';

function App() {
  return (
    <div className="App">
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
          // featureUsageAmounts contains usage amounts like: { "API Calls": 10000, "Storage": 500 }
        }}
      />
    </div>
  );
}

export default App;

