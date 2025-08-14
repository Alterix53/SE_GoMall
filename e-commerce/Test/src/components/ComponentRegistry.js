import React from 'react';

// Import tất cả components có sẵn
import TestButton from './TestButton';
import TestCard from './TestCard';
import TestInput from './TestInput';
import TestNavbar from './TestNavbar';

// Component Registry - tự động quản lý tất cả components
export const componentRegistry = {
  // Components mặc định
  'TestButton': {
    component: TestButton,
    name: 'Test Button',
    description: 'A customizable button component',
    category: 'Basic',
    defaultProps: {
      variant: 'primary',
      children: 'Click me',
      size: 'medium'
    },
    variants: [
      { name: 'Primary', props: { variant: 'primary', children: 'Primary Button' } },
      { name: 'Secondary', props: { variant: 'secondary', children: 'Secondary Button' } },
      { name: 'Success', props: { variant: 'success', children: 'Success Button' } },
      { name: 'Danger', props: { variant: 'danger', children: 'Danger Button' } },
      { name: 'Outline', props: { variant: 'outline', children: 'Outline Button' } }
    ]
  },
  'TestCard': {
    component: TestCard,
    name: 'Test Card',
    description: 'A card component for displaying content',
    category: 'Layout',
    defaultProps: {
      title: 'Sample Card',
      content: 'This is a sample card component',
      size: 'medium'
    },
    variants: [
      { name: 'Default', props: { title: 'Default Card', content: 'Default card content' } },
      { name: 'Elevated', props: { title: 'Elevated Card', content: 'Elevated card content', variant: 'elevated' } },
      { name: 'Outlined', props: { title: 'Outlined Card', content: 'Outlined card content', variant: 'outlined' } }
    ]
  },
  'TestInput': {
    component: TestInput,
    name: 'Test Input',
    description: 'An input field component',
    category: 'Form',
    defaultProps: {
      placeholder: 'Enter text...',
      type: 'text',
      size: 'medium'
    },
    variants: [
      { name: 'Text Input', props: { placeholder: 'Enter text...', type: 'text' } },
      { name: 'Email Input', props: { placeholder: 'Enter email...', type: 'email', label: 'Email' } },
      { name: 'Password Input', props: { placeholder: 'Enter password...', type: 'password', label: 'Password' } },
      { name: 'With Label', props: { placeholder: 'Enter text...', label: 'Input Label', required: true } }
    ]
  },
  'TestNavbar': {
    component: TestNavbar,
    name: 'Test Navbar',
    description: 'A navigation bar component',
    category: 'Navigation',
    defaultProps: {
      brand: 'GoMall',
      showSearch: true,
      showCart: true,
      showUser: true,
      variant: 'light'
    },
    variants: [
      { name: 'Light Theme', props: { brand: 'GoMall', variant: 'light' } },
      { name: 'Dark Theme', props: { brand: 'GoMall', variant: 'dark' } },
      { name: 'Primary Theme', props: { brand: 'GoMall', variant: 'primary' } },
      { name: 'Minimal', props: { brand: 'GoMall', showSearch: false, showCart: false, showUser: false } },
      { name: 'Custom Brand', props: { brand: 'MyApp', variant: 'primary' } }
    ]
  }
};

// Hàm để thêm component mới vào registry
export const registerComponent = (name, componentConfig) => {
  componentRegistry[name] = componentConfig;
};

// Hàm để lấy tất cả components theo category
export const getComponentsByCategory = () => {
  const categories = {};
  Object.keys(componentRegistry).forEach(key => {
    const component = componentRegistry[key];
    if (!categories[component.category]) {
      categories[component.category] = [];
    }
    categories[component.category].push({
      key,
      ...component
    });
  });
  return categories;
};

// Hàm để lấy component theo key
export const getComponent = (key) => {
  return componentRegistry[key];
};

// Hàm để lấy tất cả components
export const getAllComponents = () => {
  return Object.keys(componentRegistry).map(key => ({
    key,
    ...componentRegistry[key]
  }));
}; 