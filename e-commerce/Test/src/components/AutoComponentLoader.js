import React, { useState, useEffect } from 'react';
import { getAllComponents, getComponent } from './ComponentRegistry';

const AutoComponentLoader = () => {
  const [components, setComponents] = useState([]);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(0);

  useEffect(() => {
    // Tự động load tất cả components từ registry
    const allComponents = getAllComponents();
    setComponents(allComponents);
    if (allComponents.length > 0) {
      setSelectedComponent(allComponents[0]);
    }
  }, []);

  const handleComponentSelect = (component) => {
    setSelectedComponent(component);
    setSelectedVariant(0);
  };

  const handleVariantSelect = (variantIndex) => {
    setSelectedVariant(variantIndex);
  };

  const renderComponentPreview = () => {
    if (!selectedComponent) return null;

    const Component = selectedComponent.component;
    const variant = selectedComponent.variants[selectedVariant];
    const props = variant ? variant.props : selectedComponent.defaultProps;

    return (
      <div style={{ 
        padding: '20px', 
        border: '1px solid #ddd', 
        borderRadius: '8px',
        backgroundColor: 'white',
        marginTop: '20px'
      }}>
        <h4>Component Preview: {selectedComponent.name}</h4>
        <div style={{ marginBottom: '10px' }}>
          <strong>Variant:</strong> {variant ? variant.name : 'Default'}
        </div>
        <div style={{ 
          padding: '20px', 
          border: '1px solid #eee', 
          borderRadius: '4px',
          backgroundColor: '#f9f9f9'
        }}>
          <Component {...props} />
        </div>
        <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
          <strong>Props:</strong>
          <pre style={{ 
            backgroundColor: '#f5f5f5', 
            padding: '10px', 
            borderRadius: '4px',
            fontSize: '11px',
            overflow: 'auto'
          }}>
            {JSON.stringify(props, null, 2)}
          </pre>
        </div>
      </div>
    );
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Auto Component Loader</h2>
      <p>Components are automatically loaded and displayed here</p>
      
      <div style={{ display: 'flex', gap: '20px' }}>
        {/* Component List */}
        <div style={{ flex: '1', maxWidth: '300px' }}>
          <h3>Available Components</h3>
          <div style={{ 
            border: '1px solid #ddd', 
            borderRadius: '8px',
            maxHeight: '400px',
            overflow: 'auto'
          }}>
            {components.map((component) => (
              <div
                key={component.key}
                onClick={() => handleComponentSelect(component)}
                style={{
                  padding: '10px',
                  borderBottom: '1px solid #eee',
                  cursor: 'pointer',
                  backgroundColor: selectedComponent?.key === component.key ? '#e3f2fd' : 'white',
                  transition: 'background-color 0.2s'
                }}
              >
                <div style={{ fontWeight: 'bold' }}>{component.name}</div>
                <div style={{ fontSize: '12px', color: '#666' }}>{component.description}</div>
                <div style={{ fontSize: '11px', color: '#999' }}>Category: {component.category}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Component Preview */}
        <div style={{ flex: '2' }}>
          {selectedComponent && (
            <div>
              <h3>{selectedComponent.name}</h3>
              <p>{selectedComponent.description}</p>
              
              {/* Variant Selector */}
              {selectedComponent.variants && selectedComponent.variants.length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                  <h4>Variants:</h4>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {selectedComponent.variants.map((variant, index) => (
                      <button
                        key={index}
                        onClick={() => handleVariantSelect(index)}
                        style={{
                          padding: '8px 16px',
                          border: selectedVariant === index ? '2px solid #007bff' : '1px solid #ddd',
                          borderRadius: '4px',
                          backgroundColor: selectedVariant === index ? '#007bff' : 'white',
                          color: selectedVariant === index ? 'white' : '#333',
                          cursor: 'pointer'
                        }}
                      >
                        {variant.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {renderComponentPreview()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AutoComponentLoader; 