export type RideStatus = 'PENDING' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export type VehicleType = 'MOTO' | 'TAXI' | 'EXPRESS';

export interface RideRequest {
  originAddress: string;
  originLat: number;
  originLng: number;
  destAddress: string;
  destLat: number;
  destLng: number;
  vehicleType: VehicleType;
}

export interface RideResponse {
  id: number;
  driverName?: string;
  driverPhone?: string;
  customerName?: string;
  originAddress: string;
  destAddress: string;
  estimatedPrice: number;
  finalPrice?: number;
  status: RideStatus;
  requestedAt: string;
  completedAt?: string;
}

export interface PriceEstimate {
  estimatedPrice: number;
  distance: number;
  durationMinutes: number;
}

export interface Tariff {
  id?: number;
  vehicleType: VehicleType;
  basePrice: number;
  pricePerKm: number;
}
