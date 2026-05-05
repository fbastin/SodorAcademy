import { UserStats } from "../types";

const BASE_URL = '/SodorAcademy/api';

export interface User {
  id: string;
  name: string;
  stats: UserStats;
}

export const apiService = {
  async register(name: string, pin: string): Promise<User> {
    const response = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, pin })
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Registration failed');
    }
    const data = await response.json();
    return data.user;
  },

  async login(name: string, pin: string): Promise<User> {
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, pin })
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }
    const data = await response.json();
    return data.user;
  },

  async updateProgress(userId: string, stats: UserStats): Promise<void> {
    const response = await fetch(`${BASE_URL}/progress/${userId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stats })
    });
    if (!response.ok) {
      throw new Error('Failed to save progress');
    }
  },

  async changePin(userId: string, newPin: string): Promise<void> {
    const response = await fetch(`${BASE_URL}/change-pin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, newPin })
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to change PIN');
    }
  },

  async deleteAccount(userId: string): Promise<void> {
    const response = await fetch(`${BASE_URL}/account/${userId}`, {
      method: 'DELETE'
    });
    if (!response.ok) {
      throw new Error('Failed to delete account');
    }
  },

  async importData(userData: any): Promise<User> {
    const response = await fetch(`${BASE_URL}/import`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userData })
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Import failed');
    }
    const data = await response.json();
    return data.user;
  },

  // Helper to get full data for export (since client normally only has stats)
  async getFullData(name: string, pin: string): Promise<any> {
    // We can reuse login logic to get the full object from server context if needed, 
    // but the server login returns User which has stats. 
    // The export should ideally include the PIN to be useful for full restoration.
    // For simplicity, we'll assume the user object we want to export is the one in the database.
    // Let's add an endpoint or just use the local state + current pin.
    return null; // Will be handled in App.tsx by combining local user + known pin
  }
};
