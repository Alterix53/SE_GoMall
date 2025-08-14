import React, { useState } from 'react';

const ComponentTestPage = () => {
  const [components, setComponents] = useState([]);
  const [draggedComponent, setDraggedComponent] = useState(null);

  const handleDragStart = (e, component) => {
    setDraggedComponent(component);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetArea) => {
    e.preventDefault();
    if (draggedComponent) {
      setComponents([...components, { ...draggedComponent, id: Date.now() }]);
      setDraggedComponent(null);
    }
  };

  const removeComponent = (id) => {
    setComponents(components.filter(comp => comp.id !== id));
  };

  const sampleComponents = [
    { name: 'Button', type: 'button', props: { variant: 'primary', children: 'Click me' } },
    { name: 'Card', type: 'card', props: { title: 'Sample Card', content: 'This is a sample card component' } },
    { name: 'Input', type: 'input', props: { placeholder: 'Enter text...', type: 'text' } },
    { name: 'Modal', type: 'modal', props: { title: 'Sample Modal', content: 'This is a modal component' } }
  ];

  return (
    <div className="component-test-page">
      <h2>Component Test Page</h2>
      <p>Drag components from the left panel to the test area on the right</p>
      
      <div style={{ display: 'flex', gap: '20px' }}>
        {/* Component Library */}
        <div className="component-library" style={{ flex: '1', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
          <h3>Component Library</h3>
          <div className="component-list">
            {sampleComponents.map((component, index) => (
              <div
                key={index}
                className="component-item"
                draggable
                onDragStart={(e) => handleDragStart(e, component)}
                style={{
                  padding: '10px',
                  margin: '5px 0',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  cursor: 'grab',
                  backgroundColor: '#f8f9fa'
                }}
              >
                <strong>{component.name}</strong>
                <small style={{ display: 'block', color: '#666' }}>
                  Type: {component.type}
                </small>
              </div>
            ))}
          </div>
        </div>

        {/* Test Area */}
        <div className="test-area-container" style={{ flex: '2' }}>
          <h3>Test Area</h3>
          <div
            className="test-area"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'main')}
            style={{ minHeight: '400px' }}
          >
            {components.length === 0 ? (
              <p>Drag components here to test them</p>
            ) : (
              <div className="tested-components">
                {components.map((component) => (
                  <div
                    key={component.id}
                    className="tested-component"
                    style={{
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      padding: '10px',
                      margin: '10px 0',
                      backgroundColor: 'white',
                      position: 'relative'
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
                    <p>Type: {component.type}</p>
                    <pre style={{ fontSize: '12px', color: '#666' }}>
                      {JSON.stringify(component.props, null, 2)}
                    </pre>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComponentTestPage; 