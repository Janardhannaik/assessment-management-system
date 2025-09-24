const fs = require("fs").promises;
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const USERS_FILE = path.join(__dirname, "../users.json");

// In-memory cache
let usersCache = null;

async function loadUsers() {
  if (usersCache) return usersCache;
  try {
    const data = await fs.readFile(USERS_FILE, "utf-8");
    usersCache = JSON.parse(data);
  } catch {
    usersCache = [];
  }
  return usersCache;
}

async function saveUsers() {
  if (!usersCache) usersCache = [];
  await fs.writeFile(USERS_FILE, JSON.stringify(usersCache, null, 2));
}

// Add user
async function addUser({ name, email, passwordHash }) {
  const users = await loadUsers();
  const newUser = {
    id: uuidv4(),
    name,
    email,
    passwordHash,
    createdAt: Date.now(),
  };
  users.push(newUser);
  await saveUsers();
  return newUser;
}

// Find by email
async function findUserByEmail(email) {
  const users = await loadUsers();
  return users.find((u) => u.email === email);
}

module.exports = { loadUsers, saveUsers, addUser, findUserByEmail };
