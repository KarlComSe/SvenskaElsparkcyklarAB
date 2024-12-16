export interface BicycleResponse {
    id: string;
    batteryLevel: number;
    latitude?: number;
    longitude?: number;
    status: 'Rented' | 'Available' | 'Service';
    city: string;  // Note: this is now a string instead of City object
    createdAt: Date;
    updatedAt: Date;
}