#!/usr/bin/env node

/**
 * 🔄 Auto Setup Script - Run on Server Startup
 * 
 * This script checks if database is properly set up and runs setup if needed.
 * It can be called from server startup or as a standalone script.
 */

import mongoose from 'mongoose';
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
  cyan: '\x1b[36m'
};

const log = (message, color = 'reset') => {
  console.log(`${colors[color]}${message}${colors.reset}`);
};

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/GoMall';

// Check if database has data
const checkDatabaseStatus = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    
    // Import models
    const Category = (await import('../models/Category.js')).default;
    const User = (await import('../models/User.js')).default;
    const Product = (await import('../models/Product.js')).default;
    const Admin = (await import('../models/Admin.js')).default;
    
    // Check counts
    const categoryCount = await Category.countDocuments();
    const userCount = await User.countDocuments();
    const productCount = await Product.countDocuments();
    const adminCount = await Admin.countDocuments();
    
    await mongoose.disconnect();
    
    return {
      hasCategories: categoryCount > 0,
      hasUsers: userCount > 0,
      hasProducts: productCount > 0,
      hasAdmin: adminCount > 0,
      categoryCount,
      userCount,
      productCount,
      adminCount
    };
  } catch (error) {
    log(`❌ Error checking database: ${error.message}`, 'red');
    return null;
  }
};

// Run setup script
const runSetup = () => {
  return new Promise((resolve, reject) => {
    log('🔄 Running database setup...', 'yellow');
    
    const setupScript = join(__dirname, 'runAllScripts.js');
    
    if (!fs.existsSync(setupScript)) {
      reject(new Error('runAllScripts.js not found'));
      return;
    }
    
    const child = spawn('node', [setupScript], {
      stdio: 'inherit',
      cwd: __dirname
    });
    
    child.on('close', (code) => {
      if (code === 0) {
        log('✅ Database setup completed successfully', 'green');
        resolve();
      } else {
        reject(new Error(`Setup failed with code ${code}`));
      }
    });
    
    child.on('error', (error) => {
      reject(error);
    });
  });
};

// Main auto setup function
const autoSetup = async () => {
  try {
    log('🔍 Checking database status...', 'blue');
    
    const status = await checkDatabaseStatus();
    
    if (!status) {
      log('❌ Cannot connect to database', 'red');
      return false;
    }
    
    log('📊 Current database status:', 'cyan');
    log(`   Categories: ${status.categoryCount}`, 'reset');
    log(`   Users: ${status.userCount}`, 'reset');
    log(`   Products: ${status.productCount}`, 'reset');
    log(`   Admins: ${status.adminCount}`, 'reset');
    
    // Check if setup is needed
    const needsSetup = !status.hasCategories || !status.hasUsers || !status.hasProducts || !status.hasAdmin;
    
    if (needsSetup) {
      log('\n⚠️  Database setup needed!', 'yellow');
      log('Some required data is missing.', 'yellow');
      
      if (process.argv.includes('--force')) {
        log('🔄 Force setup mode - running setup...', 'yellow');
        await runSetup();
        return true;
      } else {
        log('\n💡 To run setup automatically, use:', 'cyan');
        log('   node autoSetup.js --force', 'bright');
        log('\n💡 Or run manually:', 'cyan');
        log('   node runAllScripts.js', 'bright');
        return false;
      }
    } else {
      log('\n✅ Database is properly set up!', 'green');
      log('No setup needed.', 'cyan');
      return true;
    }
    
  } catch (error) {
    log(`❌ Auto setup failed: ${error.message}`, 'red');
    return false;
  }
};

// Export for use in server
export { autoSetup };

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  autoSetup().then((success) => {
    process.exit(success ? 0 : 1);
  });
}
