import React, { useState } from 'react';

const ResponsiveTestPage = () => {
  const [selectedViewport, setSelectedViewport] = useState('desktop');
  const [components, setComponents] = useState([]);

  const viewports = [
    { id: 'mobile', name: 'Mobile', width: 375, height: 667 },
    { id: 'tablet', name: 'Tablet', width: 768, height: 1024 },
    { id: 'desktop', name: 'Desktop', width: 1200, height: 800 }
  ];

  const addComponent = () => {
    const newComponent = {
      id: Date.now(),
      name: `Component ${components.length + 1}`,
      content: `This is a responsive component ${components.length + 1}`,
      type: 'responsive'
    };
    setComponents([...components, newComponent]);
  };

  const removeComponent = (id) => {
    setComponents(components.filter(comp => comp.id !== id));
  };

  const getViewportStyles = () => {
    const viewport = viewports.find(v => v.id === selectedViewport);
    return {
      width: viewport.width,
      height: viewport.height,
      border: '2px solid #333',
      borderRadius: '8px',
      overflow: 'hidden',
      backgroundColor: 'white',
      position: 'relative'
    };
  };

  return (
    <div className="responsive-test-page">
      <h2>Responsive Test Page</h2>
      <p>Test your components across different screen sizes</p>
      
      <div className="viewport-controls" style={{ marginBottom: '20px' }}>
        <h3>Select Viewport:</h3>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          {viewports.map(viewport => (
            <button
              key={viewport.id}
              onClick={() => setSelectedViewport(viewport.id)}
              style={{
                padding: '10px 20px',
                border: selectedViewport === viewport.id ? '2px solid #007bff' : '1px solid #ddd',
                borderRadius: '4px',
                backgroundColor: selectedViewport === viewport.id ? '#007bff' : 'white',
                color: selectedViewport === viewport.id ? 'white' : '#333',
                cursor: 'pointer'
              }}
            >
              {viewport.name} ({viewport.width}×{viewport.height})
            </button>
          ))}
        </div>
        
        <button
          onClick={addComponent}
          style={{
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Add Component
        </button>
      </div>

      <div className="responsive-test-container">
        <div className="viewport-preview" style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <div style={getViewportStyles()}>
            <div
              style={{
                background: '#f8f9fa',
                padding: '10px',
                borderBottom: '1px solid #ddd',
                textAlign: 'center',
                fontSize: '12px',
                color: '#666'
              }}
            >
              {viewports.find(v => v.id === selectedViewport)?.name} View
            </div>
            <div
              style={{
                padding: '15px',
                height: 'calc(100% - 40px)',
                overflow: 'auto'
              }}
            >
              {components.length === 0 ? (
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  height: '100%',
                  color: '#666',
                  textAlign: 'center'
                }}>
                  <p>Click "Add Component" to add components to this viewport</p>
                </div>
              ) : (
                <div className="responsive-components">
                  {components.map(component => (
                    <div
                      key={component.id}
                      className="responsive-component"
                      style={{
                        backgroundColor: 'white',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        padding: '15px',
                        margin: '10px 0',
                        position: 'relative',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }}
                    >
                      <button
                        onClick={() => removeComponent(component.id)}
                        style={{
                          position: 'absolute',
                          top: '5px',
                          right: '5px',
                          background: '#dc3545',
                          color: 'white',
                          border: 'none',
                          borderRadius: '50%',
                          width: '20px',
                          height: '20px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        ×
                      </button>
                      <h4 style={{ marginTop: 0, fontSize: selectedViewport === 'mobile' ? '14px' : '16px' }}>
                        {component.name}
                      </h4>
                      <p style={{ fontSize: selectedViewport === 'mobile' ? '12px' : '14px' }}>
                        {component.content}
                      </p>
                      <div style={{ 
                        fontSize: '10px', 
                        color: '#666',
                        marginTop: '10px',
                        padding: '5px',
                        backgroundColor: '#f8f9fa',
                        borderRadius: '4px'
                      }}>
                        <strong>Responsive Info:</strong><br/>
                        Viewport: {viewports.find(v => v.id === selectedViewport)?.name}<br/>
                        Size: {viewports.find(v => v.id === selectedViewport)?.width}×{viewports.find(v => v.id === selectedViewport)?.height}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="responsive-info" style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e9ecef', borderRadius: '8px' }}>
        <h4>Responsive Testing Information:</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          {viewports.map(viewport => (
            <div key={viewport.id} style={{ padding: '10px', backgroundColor: 'white', borderRadius: '4px' }}>
              <h5>{viewport.name}</h5>
              <p><strong>Dimensions:</strong> {viewport.width}×{viewport.height}</p>
              <p><strong>Use case:</strong> {viewport.id === 'mobile' ? 'Smartphones' : viewport.id === 'tablet' ? 'Tablets & Small laptops' : 'Desktop & Large screens'}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResponsiveTestPage; 