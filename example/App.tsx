import React from 'react';
import { CupricePricing } from '../src/components/CupricePricing';

function App() {
  return (
    <div className="App">
      <CupricePricing 
        shareId="your-share-id-here"
        onPlanSelect={(plan) => {
          console.log('Plan selected:', plan);
        }}
        onCustomPlanClick={() => {
          console.log('Custom plan clicked');
        }}
        onCustomPlanSubscribe={(features, userCount, duration) => {
          console.log('Custom plan subscribe:', { features, userCount, duration });
        }}
      />
    </div>
  );
}

export default App;

