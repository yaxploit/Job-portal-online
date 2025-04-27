// Local authentication system that works without backend
import { User } from "@shared/schema";

// Local storage keys
const USER_KEY = "jobnexus_user";
const USERS_KEY = "jobnexus_users";

// Helper function to create Date objects from ISO strings when parsing JSON
function parseDate(date: string): Date {
  return new Date(date);
}

// Pre-defined users with proper type conversion
const DEFAULT_USERS: User[] = [
  {
    id: 1,
    email: "john@example.com",
    name: "John Doe",
    username: "johndoe",
    password: "password123",
    userType: "seeker",
    createdAt: new Date(),
  },
  {
    id: 2,
    email: "jane@example.com",
    name: "Jane Smith",
    username: "janesmith",
    password: "password123",
    userType: "seeker",
    createdAt: new Date(),
  },
  {
    id: 3,
    email: "tech@techcorp.com",
    name: "Tech Corp",
    username: "techcorp",
    password: "password123",
    userType: "employer",
    createdAt: new Date(),
  },
  {
    id: 4,
    email: "global@globalsys.com",
    name: "Global Systems",
    username: "globalsys",
    password: "password123",
    userType: "employer",
    createdAt: new Date(),
  },
  {
    id: 5,
    email: "admin@jobnexus.com",
    name: "Admin",
    username: "admin",
    password: "yaxploit",
    userType: "admin",
    createdAt: new Date(),
  }
];

// Initialize users in local storage if not exists
export function initLocalAuth() {
  if (!localStorage.getItem(USERS_KEY)) {
    localStorage.setItem(USERS_KEY, JSON.stringify(DEFAULT_USERS));
  }
}

// Get all users
export function getUsers(): User[] {
  const usersJson = localStorage.getItem(USERS_KEY);
  return usersJson ? JSON.parse(usersJson) : [];
}

// Get current user
export function getCurrentUser(): User | null {
  const userJson = localStorage.getItem(USER_KEY);
  return userJson ? JSON.parse(userJson) : null;
}

// Login
export function login(username: string, password: string): User | null {
  const users = getUsers();
  const user = users.find(u => u.username === username && u.password === password);
  
  if (user) {
    // Don't store password in the session
    const { password: _, ...userWithoutPassword } = user;
    localStorage.setItem(USER_KEY, JSON.stringify(userWithoutPassword));
    return userWithoutPassword as User;
  }
  
  return null;
}

// Register
export function register(user: Omit<User, "id" | "createdAt">): User | null {
  const users = getUsers();
  
  // Check if username or email already exists
  if (users.some(u => u.username === user.username)) {
    throw new Error("Username already exists");
  }
  
  if (users.some(u => u.email === user.email)) {
    throw new Error("Email already exists");
  }
  
  // Create new user
  const newUser: User = {
    ...user,
    id: users.length + 1,
    createdAt: new Date(),
  };
  
  // Save to storage
  localStorage.setItem(USERS_KEY, JSON.stringify([...users, newUser]));
  
  // Log in the new user
  const { password: _, ...userWithoutPassword } = newUser;
  localStorage.setItem(USER_KEY, JSON.stringify(userWithoutPassword));
  
  return userWithoutPassword as User;
}

// Logout
export function logout(): void {
  localStorage.removeItem(USER_KEY);
}