import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


// lib/utils.ts
// lib/utils.ts
export function CurrentUser() {
  try {
    const token = localStorage.getItem("token");
    
    if (!token) {
      console.log("No token found in storage");
      return null;
    }

    console.log("Token found, decoding...");
    
    // Decode JWT token
    const payload = JSON.parse(atob(token.split('.')[1]));
    console.log("Full token payload:", payload);
    
    // Extract user info - your token structure might be different
    const userInfo = {
      id: payload.id, // Try direct id first
      email: payload.email,
      role: payload.role
    };
    
    console.log("Extracted user info:", userInfo);
    
    if (!userInfo.id) {
      console.log("No user ID found in token, checking localStorage...");
      // Fallback to localStorage
      const storedId = localStorage.getItem("user_id");
      if (storedId) {
        return {
          id: parseInt(storedId),
          role: localStorage.getItem("user_role")
        };
      }
      return null;
    }
    
    return userInfo;
  } catch (error) {
    console.error("Error in CurrentUser:", error);
    return null;
  }
}