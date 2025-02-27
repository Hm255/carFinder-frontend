// src/services/api.ts

import axios from 'axios';

const backendUrl = 'http://localhost:9090'; // You can also use an environment variable here

export interface Car {
    registration_number: string; // character(7)
    make_id: number; // integer
    model_id: number; // integer
    color: string; // character varying(30)
    engine_size: number; // integer
    year_of_manufacture: number; // integer
    date_of_manufacture: Date; // date
    co2_emissions: number; // integer
    tax_due_date: Date; // date
    date_of_last_v5c_issued: Date; // date
    first_used_date: Date; // date
    marked_for_export: boolean; // boolean
    has_outstanding_recall: boolean; // boolean
    type_approval: string; // character varying(10)
    fuel_type_id: number; // integer
    tax_status_id: number; // integer
    wheel_plan_id: number; // integer
    power_output: number; // integer
  }

export async function fetchCars(): Promise<Car[]> {
  try {
    const response = await axios.get(`${backendUrl}/cars`);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching cars:', error);
    throw error;
  }
}
