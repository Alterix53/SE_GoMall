import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

import User from '../models/User.js';
import Seller from '../models/Seller.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/GoMall';
const USERS_JSON_PATH = path.join(__dirname, '../../data/users.json');

function isBcryptHash(value) {
  return typeof value === 'string' && value.startsWith('$2') && value.length >= 50;
}

async function upsertUserFromJson(jsonUser) {
  const username = jsonUser.username?.trim();
  const email = jsonUser.email?.trim()?.toLowerCase();
  const rawPassword = jsonUser.password || 'DefaultPass123';

  const roleFromJson = jsonUser.role;
  const rolesArray = Array.isArray(roleFromJson)
    ? roleFromJson
    : (roleFromJson ? [roleFromJson] : ['user']);

  const hasSellerRole = rolesArray.includes('seller');
  // User model no longer supports 'admin' as a role; keep only 'user'
  const normalizedRoles = rolesArray.filter(r => r === 'user');
  const finalRoles = normalizedRoles.length ? normalizedRoles : ['user'];

  const passwordToStore = isBcryptHash(rawPassword)
    ? rawPassword
    : await bcrypt.hash(rawPassword, 10);

  const userDoc = {
    username,
    email,
    password: passwordToStore,
    role: finalRoles,
    fullName: jsonUser.fullName || '',
    phoneNumber: jsonUser.phoneNumber || '',
    address: jsonUser.address || '',
    isActive: jsonUser.isActive !== false,
  };

  // Upsert by email/username
  const existing = await User.findOne({ $or: [{ email }, { username }] });
  let user;
  if (existing) {
    existing.set(userDoc);
    user = await existing.save();
  } else {
    user = await new User(userDoc).save();
  }

  // If seller role existed in JSON, ensure a Seller record exists
  if (hasSellerRole) {
    const existingSeller = await Seller.findOne({ userID: user._id });
    if (!existingSeller) {
      const seller = new Seller({
        userID: user._id,
        businessName: jsonUser.shop?.name || user.fullName || `${user.username}'s Store`,
        businessLicense: jsonUser.shop?.businessLicense || `IMPORTED_${Date.now()}`,
        businessAddress: jsonUser.shop?.address || user.address || '',
        businessPhone: user.phoneNumber || '',
        businessEmail: user.email,
        verificationDocs: [],
        status: 'approved',
        isActive: true,
      });
      await seller.save();
    }
  }

  return user;
}

async function importUsers() {
  try {
    console.log('Connecting to MongoDB:', MONGODB_URI);
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    if (!fs.existsSync(USERS_JSON_PATH)) {
      console.error('Users JSON not found at:', USERS_JSON_PATH);
      process.exit(1);
    }

    const json = fs.readFileSync(USERS_JSON_PATH, 'utf8');
    const users = JSON.parse(json);
    if (!Array.isArray(users) || users.length === 0) {
      console.warn('users.json is empty or not an array. Nothing to import.');
      process.exit(0);
    }

    console.log(`Found ${users.length} users in JSON. Importing...`);
    let success = 0;
    for (const u of users) {
      try {
        const saved = await upsertUserFromJson(u);
        success++;
        console.log(`✔ Imported/Updated: ${saved.username} <${saved.email}> [${Array.isArray(saved.role) ? saved.role.join(',') : saved.role}]`);
      } catch (e) {
        console.error(`✖ Failed to import user ${u.username || u.email}:`, e.message);
      }
    }

    console.log(`\n✅ Done. Successfully imported/updated ${success}/${users.length} users.`);
  } catch (err) {
    console.error('Import failed:', err);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  importUsers();
}

export { importUsers };


