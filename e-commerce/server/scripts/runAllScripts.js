#!/usr/bin/env node

/**
 * 🚀 Master Script - Run All Database Scripts
 * 
 * This script runs all database setup scripts in the correct order:
 * 1. Create default admin
 * 2. Seed all data (categories, users, products)
 * 3. Add flash sale data
 * 4. Check final status
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

const log = (message, color = 'reset') => {
  console.log(`${colors[color]}${message}${colors.reset}`);
};

const logStep = (step, description) => {
  log(`\n${colors.cyan}${step}${colors.reset}`, 'bright');
  log(description, 'yellow');
};

const runScript = (scriptName) => {
  return new Promise((resolve, reject) => {
    log(`\n${colors.blue}Running ${scriptName}...${colors.reset}`);
    
    const scriptPath = join(__dirname, scriptName);
    
    // Check if script exists
    if (!fs.existsSync(scriptPath)) {
      log(`❌ Script ${scriptName} not found!`, 'red');
      reject(new Error(`Script ${scriptName} not found`));
      return;
    }

    const child = spawn('node', [scriptPath], {
      stdio: 'inherit',
      cwd: __dirname
    });

    child.on('close', (code) => {
      if (code === 0) {
        log(`✅ ${scriptName} completed successfully`, 'green');
        resolve();
      } else {
        log(`❌ ${scriptName} failed with code ${code}`, 'red');
        reject(new Error(`${scriptName} failed with code ${code}`));
      }
    });

    child.on('error', (error) => {
      log(`❌ Error running ${scriptName}: ${error.message}`, 'red');
      reject(error);
    });
  });
};

const runAllScripts = async () => {
  const startTime = Date.now();
  
  try {
    log('🚀 Starting Database Setup Process...', 'bright');
    log('This will run all scripts in the correct order', 'yellow');
    
    // Step 1: Create default admin
    logStep('STEP 1/4', 'Creating default admin user');
    await runScript('createAdmin.js');
    
    // Step 2: Seed all data
    logStep('STEP 2/4', 'Seeding categories, users, and products');
    await runScript('seedData.js');
    
    // Step 3: Add flash sale data
    logStep('STEP 3/4', 'Adding flash sale data to products');
    await runScript('addFlashSaleToProducts.js');
    
    // Step 4: Check final status
    logStep('STEP 4/4', 'Checking final database status');
    await runScript('checkStatus.js');
    
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    
    log('\n🎉 All scripts completed successfully!', 'green');
    log(`⏱️  Total time: ${duration} seconds`, 'cyan');
    log('\n📋 Summary:', 'bright');
    log('✅ Default admin created (admin/admin123)', 'green');
    log('✅ Categories, users, and products seeded', 'green');
    log('✅ Flash sale data added', 'green');
    log('✅ Database status verified', 'green');
    
    log('\n🚀 Your GoMall database is ready!', 'bright');
    log('You can now start the server and frontend', 'yellow');
    
  } catch (error) {
    log('\n❌ Database setup failed!', 'red');
    log(`Error: ${error.message}`, 'red');
    log('\nPlease check the error above and try again', 'yellow');
    process.exit(1);
  }
};

// Add command line options
const args = process.argv.slice(2);
const options = {
  skipAdmin: args.includes('--skip-admin'),
  skipSeed: args.includes('--skip-seed'),
  skipFlashSale: args.includes('--skip-flash-sale'),
  skipStatus: args.includes('--skip-status'),
  help: args.includes('--help') || args.includes('-h')
};

if (options.help) {
  log('\n📖 GoMall Database Setup Script', 'bright');
  log('Usage: node runAllScripts.js [options]', 'cyan');
  log('\nOptions:', 'yellow');
  log('  --skip-admin      Skip creating default admin', 'reset');
  log('  --skip-seed       Skip seeding data', 'reset');
  log('  --skip-flash-sale Skip adding flash sale data', 'reset');
  log('  --skip-status     Skip status check', 'reset');
  log('  --help, -h        Show this help message', 'reset');
  log('\nExamples:', 'yellow');
  log('  node runAllScripts.js                    # Run all scripts', 'reset');
  log('  node runAllScripts.js --skip-admin       # Skip admin creation', 'reset');
  log('  node runAllScripts.js --skip-flash-sale  # Skip flash sale data', 'reset');
  process.exit(0);
}

// Run the setup
runAllScripts();
