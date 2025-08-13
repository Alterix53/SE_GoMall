import React from 'react';
import AutoComponentLoader from '../components/AutoComponentLoader';

const AutoTestPage = () => {
  return (
    <div className="auto-test-page">
      <div className="test-header" style={{ 
        background: '#28a745', 
        color: 'white', 
        padding: '15px', 
        marginBottom: '20px', 
        borderRadius: '8px' 
      }}>
        <h1>🔄 Auto Component Test</h1>
        <p>Components are automatically loaded and displayed here. Just add your component to the registry!</p>
      </div>
      
      <AutoComponentLoader />
      
      <div style={{ 
        marginTop: '30px', 
        padding: '20px', 
        backgroundColor: '#f8f9fa', 
        borderRadius: '8px',
        border: '1px solid #dee2e6'
      }}>
        <h3>📋 How to Add Your Component:</h3>
        <ol>
          <li><strong>Copy your component</strong> to <code>Test/src/components/</code></li>
          <li><strong>Import it</strong> in <code>ComponentRegistry.js</code></li>
          <li><strong>Register it</strong> in the <code>componentRegistry</code> object</li>
          <li><strong>Refresh the page</strong> - your component will appear automatically!</li>
        </ol>
        
        <h4>Example Registration:</h4>
        <pre style={{ 
          backgroundColor: '#e9ecef', 
          padding: '15px', 
          borderRadius: '4px',
          fontSize: '12px',
          overflow: 'auto'
        }}>
{`// In ComponentRegistry.js
import YourComponent from './YourComponent';

export const componentRegistry = {
  // ... existing components
  'YourComponent': {
    component: YourComponent,
    name: 'Your Component Name',
    description: 'Description of your component',
    category: 'Your Category',
    defaultProps: {
      // your default props
    },
    variants: [
      { name: 'Variant 1', props: { /* props */ } },
      { name: 'Variant 2', props: { /* props */ } }
    ]
  }
};`}
        </pre>
      </div>
    </div>
  );
};

export default AutoTestPage; 