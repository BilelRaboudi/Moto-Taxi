export type DriverStatus = 'PENDING' | 'VALIDATED' | 'REFUSED';

export interface Driver {
  id: number;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  licenseNumber: string;
  vehicleType: string;
  vehiclePlate: string;
  available: boolean;
  status: DriverStatus;
  currentLat?: number;
  currentLng?: number;
  totalEarnings: number;
}
