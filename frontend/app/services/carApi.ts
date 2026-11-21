import type { Car, CarFormData } from '../types/car';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export interface StatsResponse {
  total: number;
  available: number;
  inUse: number;
  unavailable: number;
}

export const carApi = {
  // get all cars
  async getCars(): Promise<Car[]> {   
    const url = `${API_BASE_URL}/cars`;

    const res = await fetch(url);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Failed to fetch cars (${res.status})`);
    }
    const json = await res.json();
    return json.data || json;
  },

  /**
   * Get single car by ID
   */
  async getCarById(id: string): Promise<Car> {
    const res = await fetch(`${API_BASE_URL}/cars/${id}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Failed to fetch car with ID ${id}`);
    }
    return res.json();
  },

  // create new car
  async createCar(data: CarFormData): Promise<Car> {
    const res = await fetch(`${API_BASE_URL}/cars`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Failed to create car (${res.status})`);
    }
    return res.json();
  },

  // Update car
  async updateCar(id: string, data: Partial<CarFormData>): Promise<Car> {
    const res = await fetch(`${API_BASE_URL}/cars/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Failed to update car (${res.status})`);
    }
    return res.json();
  },

  // Delete car
  async deleteCar(id: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_BASE_URL}/cars/${id}`, {
      method: 'DELETE',
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Failed to delete car (${res.status})`);
    }
    return res.json();
  },
};
