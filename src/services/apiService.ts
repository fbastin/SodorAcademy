import { UserStats } from "../types";

const BASE_URL = '/SodorAcademy/api';

export interface User {
  id: string;
  name: string;
  email?: string;
  stats: UserStats;
  isActive?: boolean;
  isAdmin?: boolean;
}

export const apiService = {
  async register(name: string, pin: string, email: string): Promise<User> {
    const response = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, pin, email })
    });
    if (!response.ok) {
      let errorMsg = 'Registration failed';
      try {
        const error = await response.json();
        errorMsg = error.error || errorMsg;
      } catch (e) {
        const text = await response.text();
        errorMsg = `Server error (${response.status}): ${text.slice(0, 100)}`;
      }
      throw new Error(errorMsg);
    }
    const data = await response.json();
    return data.user;
  },

  async validateEmail(name: string, email: string, code: string): Promise<void> {
    const response = await fetch(`${BASE_URL}/validate-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, code })
    });
    if (!response.ok) {
      let errorMsg = 'Validation failed';
      try {
        const error = await response.json();
        errorMsg = error.error || errorMsg;
      } catch (e) {
        const text = await response.text();
        errorMsg = `Server error (${response.status}): ${text.slice(0, 100)}`;
      }
      throw new Error(errorMsg);
    }
  },

  async login(name: string, pin: string): Promise<User> {
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, pin })
    });
    if (!response.ok) {
      let errorMsg = 'Login failed';
      let errorData: any = {};
      try {
        errorData = await response.json();
        errorMsg = errorData.error || errorMsg;
      } catch (e) {
        const text = await response.text();
        errorMsg = `Server error (${response.status}): ${text.slice(0, 100)}`;
      }

      const err = new Error(errorMsg) as any;
      if (response.status === 403) {
        err.email = errorData.email;
        err.name = name; // Pass the name along for validation
        err.type = 'VALIDATION_REQUIRED';
      }
      throw err;
    }
    const data = await response.json();
    return data.user;
  },

  async requestRecovery(name: string, email: string): Promise<void> {
    const response = await fetch(`${BASE_URL}/request-recovery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email })
    });
    if (!response.ok) {
      let errorMsg = 'Recovery request failed';
      try {
        const error = await response.json();
        errorMsg = error.error || errorMsg;
      } catch (e) {
        const text = await response.text();
        errorMsg = `Server error (${response.status}): ${text.slice(0, 100)}`;
      }
      throw new Error(errorMsg);
    }
  },

  async resetPin(name: string, email: string, code: string, newPin: string): Promise<void> {
    const response = await fetch(`${BASE_URL}/reset-pin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, code, newPin })
    });
    if (!response.ok) {
      let errorMsg = 'PIN reset failed';
      try {
        const error = await response.json();
        errorMsg = error.error || errorMsg;
      } catch (e) {
        const text = await response.text();
        errorMsg = `Server error (${response.status}): ${text.slice(0, 100)}`;
      }
      throw new Error(errorMsg);
    }
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

  async changeName(userId: string, newName: string): Promise<void> {
    const response = await fetch(`${BASE_URL}/change-name`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, newName })
    });
    if (!response.ok) {
      let errorMsg = 'Failed to change name';
      try {
        const error = await response.json();
        errorMsg = error.error || errorMsg;
      } catch (e) {
        const text = await response.text();
        errorMsg = `Server error (${response.status}): ${text.slice(0, 100)}`;
      }
      throw new Error(errorMsg);
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

  // --- Admin Methods ---

  async getAdminUsers(adminId: string): Promise<User[]> {
    const response = await fetch(`${BASE_URL}/admin/users`, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'X-Admin-ID': adminId
      }
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch users');
    }
    const data = await response.json();
    return data.users;
  },

  async deleteUserAsAdmin(adminId: string, targetUserId: string): Promise<void> {
    const response = await fetch(`${BASE_URL}/admin/users/${targetUserId}`, {
      method: 'DELETE',
      headers: { 
        'Content-Type': 'application/json',
        'X-Admin-ID': adminId
      }
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete user');
    }
  },

  async validateUserAsAdmin(adminId: string, targetUserId: string): Promise<void> {
    const response = await fetch(`${BASE_URL}/admin/users/${targetUserId}/validate`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'X-Admin-ID': adminId
      }
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to validate user');
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
