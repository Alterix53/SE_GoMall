#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Script để copy component từ gomallclient sang Test
function copyComponent(componentName) {
  const sourceDir = path.join(__dirname, '../../gomallclient/src/Component');
  const targetDir = path.join(__dirname, '../src/components');
  
  // Tìm component trong gomallclient
  const componentPath = path.join(sourceDir, componentName);
  
  if (!fs.existsSync(componentPath)) {
    console.error(`❌ Component "${componentName}" not found in gomallclient`);
    console.log('Available components:');
    const components = fs.readdirSync(sourceDir);
    components.forEach(comp => {
      console.log(`  - ${comp}`);
    });
    return;
  }

  // Copy component files
  const files = fs.readdirSync(componentPath);
  files.forEach(file => {
    const sourceFile = path.join(componentPath, file);
    const targetFile = path.join(targetDir, file);
    
    if (fs.statSync(sourceFile).isFile()) {
      fs.copyFileSync(sourceFile, targetFile);
      console.log(`✅ Copied: ${file}`);
    }
  });

  // Update ComponentRegistry.js
  updateComponentRegistry(componentName);
  
  console.log(`\n🎉 Component "${componentName}" copied successfully!`);
  console.log('📝 Next steps:');
  console.log('1. Check the copied files in Test/src/components/');
  console.log('2. Update imports if needed');
  console.log('3. Refresh the Auto Test page to see your component');
}

function updateComponentRegistry(componentName) {
  const registryPath = path.join(__dirname, '../src/components/ComponentRegistry.js');
  
  if (!fs.existsSync(registryPath)) {
    console.log('⚠️  ComponentRegistry.js not found, skipping registry update');
    return;
  }

  let content = fs.readFileSync(registryPath, 'utf8');
  
  // Add import
  const importMatch = content.match(/import.*from.*';/g);
  if (importMatch) {
    const lastImport = importMatch[importMatch.length - 1];
    const newImport = `import ${componentName} from './${componentName}';`;
    content = content.replace(lastImport, `${lastImport}\nimport ${componentName} from './${componentName}';`);
  }

  // Add to registry
  const registryMatch = content.match(/};$/);
  if (registryMatch) {
    const newEntry = `
  '${componentName}': {
    component: ${componentName},
    name: '${componentName}',
    description: 'A ${componentName.toLowerCase()} component',
    category: 'Custom',
    defaultProps: {
      // Add your default props here
    },
    variants: [
      { name: 'Default', props: { /* Add props here */ } }
    ]
  }`;
    
    content = content.replace(/};$/, `${newEntry}\n};`);
  }

  fs.writeFileSync(registryPath, content);
  console.log('📝 Updated ComponentRegistry.js');
}

// CLI usage
if (require.main === module) {
  const componentName = process.argv[2];
  
  if (!componentName) {
    console.log('Usage: node copy-component.js <component-name>');
    console.log('Example: node copy-component.js Navbar');
    process.exit(1);
  }

  copyComponent(componentName);
}

module.exports = { copyComponent }; 