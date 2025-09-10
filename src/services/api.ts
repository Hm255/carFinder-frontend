import axios from 'axios';

export interface Car {
  registration_number: string;
  make: string;
  model: string;
  color: string;
  fuel_type: string;
  engine_size: number;
  year_of_manufacture: number;
  wheel_plan: string;
  power_output: number;
  co2_emissions: number;
  price: number;
  type_approval: string;       
  tax_due_date: string;       
  date_of_last_v5c_issued: string; 
  first_used_date: string;    
  marked_for_export: boolean; 
  has_outstanding_recall: boolean; 
  date_of_manufacture: string;
  tax_status: string;
}

export const fetchCars = async (): Promise<Car[]> => {
  try {
    const response = await axios.get('/api/cars');
    const payload = response.data;

    
    if (Array.isArray(payload)) return payload;
    if (payload && Array.isArray(payload.cars)) return payload.cars;
    if (payload && Array.isArray(payload.data)) return payload.data;

    console.warn('Unexpected API response shape:', payload);
    return [];
  } catch (error: any) {
    console.error('Error fetching cars:', error);
    return [];
  }
};
