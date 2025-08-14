import React, { useState } from 'react';

const LayoutTestPage = () => {
  const [selectedLayout, setSelectedLayout] = useState('grid');
  const [components, setComponents] = useState([]);

  const layouts = [
    { id: 'grid', name: 'Grid Layout', className: 'grid-layout' },
    { id: 'flex', name: 'Flexbox Layout', className: 'flex-layout' },
    { id: 'sidebar', name: 'Sidebar Layout', className: 'sidebar-layout' },
    { id: 'card', name: 'Card Layout', className: 'card-layout' }
  ];

  const addComponent = () => {
    const newComponent = {
      id: Date.now(),
      name: `Component ${components.length + 1}`,
      content: `This is component ${components.length + 1}`
    };
    setComponents([...components, newComponent]);
  };

  const removeComponent = (id) => {
    setComponents(components.filter(comp => comp.id !== id));
  };

  const getLayoutStyles = () => {
    switch (selectedLayout) {
      case 'grid':
        return {
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          padding: '20px'
        };
      case 'flex':
        return {
          display: 'flex',
          flexWrap: 'wrap',
          gap: '20px',
          padding: '20px'
        };
      case 'sidebar':
        return {
          display: 'flex',
          gap: '20px',
          padding: '20px'
        };
      case 'card':
        return {
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
          padding: '20px'
        };
      default:
        return {};
    }
  };

  return (
    <div className="layout-test-page">
      <h2>Layout Test Page</h2>
      <p>Test different layout arrangements for your components</p>
      
      <div className="layout-controls" style={{ marginBottom: '20px' }}>
        <h3>Select Layout:</h3>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          {layouts.map(layout => (
            <button
              key={layout.id}
              onClick={() => setSelectedLayout(layout.id)}
              style={{
                padding: '10px 20px',
                border: selectedLayout === layout.id ? '2px solid #007bff' : '1px solid #ddd',
                borderRadius: '4px',
                backgroundColor: selectedLayout === layout.id ? '#007bff' : 'white',
                color: selectedLayout === layout.id ? 'white' : '#333',
                cursor: 'pointer'
              }}
            >
              {layout.name}
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

      <div className="layout-preview">
        <h3>Layout Preview: {layouts.find(l => l.id === selectedLayout)?.name}</h3>
        
        <div
          className={`layout-container ${selectedLayout}`}
          style={{
            border: '2px solid #ddd',
            borderRadius: '8px',
            minHeight: '400px',
            backgroundColor: '#f8f9fa',
            ...getLayoutStyles()
          }}
        >
          {components.length === 0 ? (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              height: '100%',
              color: '#666'
            }}>
              <p>Click "Add Component" to add components to this layout</p>
            </div>
          ) : (
            components.map(component => (
              <div
                key={component.id}
                className="layout-component"
                style={{
                  backgroundColor: 'white',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  padding: '15px',
                  position: 'relative',
                  minHeight: selectedLayout === 'sidebar' && components.indexOf(component) === 0 ? '100%' : 'auto'
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
                    cursor: 'pointer'
                  }}
                >
                  ×
                </button>
                <h4>{component.name}</h4>
                <p>{component.content}</p>
                {selectedLayout === 'sidebar' && components.indexOf(component) === 0 && (
                  <div style={{ flex: 1 }}>
                    <h5>Sidebar Content</h5>
                    <p>This is the sidebar area. Other components will appear in the main content area.</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="layout-info" style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e9ecef', borderRadius: '8px' }}>
        <h4>Layout Information:</h4>
        <ul>
          <li><strong>Grid Layout:</strong> Responsive grid with auto-fit columns</li>
          <li><strong>Flexbox Layout:</strong> Flexible box layout with wrapping</li>
          <li><strong>Sidebar Layout:</strong> Sidebar + main content layout</li>
          <li><strong>Card Layout:</strong> Card-based grid layout</li>
        </ul>
      </div>
    </div>
  );
};

export default LayoutTestPage; 