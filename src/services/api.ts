import axios from 'axios';

const backendUrl = 'http://localhost:9090'; // port the backend application runs on

export interface Car {
  registration_number: string;     // character(7)
  color: string;                   // character varying(30)
  engine_size: number;             // integer
  year_of_manufacture: number;     // integer
  date_of_manufacture: string;       // date
  co2_emissions: number;           // integer
  tax_due_date: string;              // date
  date_of_last_v5c_issued: string;   // date
  first_used_date: string;           // date
  marked_for_export: boolean;      // boolean
  has_outstanding_recall: boolean; // boolean
  type_approval: string;           // character varying(10)
  power_output: number;            // integer
  price: number;                   // integer or decimal, depending on your schema
  make: string;                    // Make name
  model: string;                   // Model name
  fuel_type: string;               // Fuel type name
  tax_status: string;              // Tax status name
  wheel_plan: string;              // Wheel plan name
}


export async function fetchCars(): Promise<Car[]> {
  try {
    const response = await axios.get<Car[]>(`${backendUrl}/cars`);
    return response.data; 
  } catch (error: any) {
    console.error('Error fetching cars:', error);
    throw error;
  }
}


