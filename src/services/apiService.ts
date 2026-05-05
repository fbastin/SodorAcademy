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
  }
};
