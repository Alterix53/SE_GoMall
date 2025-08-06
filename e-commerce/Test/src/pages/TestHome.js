import React from 'react';

const TestHome = () => {
  return (
    <div className="test-home">
      <h2>Welcome to React Component Test Environment</h2>
      <p>This is a dedicated environment for testing your React components.</p>
      
      <div className="component-showcase">
        <div className="component-card">
          <h3>Component Test</h3>
          <p>Test individual components in isolation</p>
          <ul>
            <li>Drag and drop components here</li>
            <li>Test component props and states</li>
            <li>Check component styling</li>
          </ul>
        </div>
        
        <div className="component-card">
          <h3>Layout Test</h3>
          <p>Test component layouts and arrangements</p>
          <ul>
            <li>Test responsive layouts</li>
            <li>Check component positioning</li>
            <li>Verify spacing and alignment</li>
          </ul>
        </div>
        
        <div className="component-card">
          <h3>Responsive Test</h3>
          <p>Test components across different screen sizes</p>
          <ul>
            <li>Mobile view (375px)</li>
            <li>Tablet view (768px)</li>
            <li>Desktop view (1200px)</li>
          </ul>
        </div>
      </div>
      
      <div className="test-area">
        <p>Drag your components here to start testing!</p>
      </div>
    </div>
  );
};

export default TestHome; 