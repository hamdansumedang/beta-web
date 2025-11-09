export interface Service {
  id: number;
  title: string;
  type: 'Shuttle' | 'Private Tour';
  image: string;
  description: string;
  capacity: number;
  facilities: string[];

  // Private Tour specific fields
  route?: string;
  duration?: string;
  price?: number; // Represents price per vehicle for tours
  priceType?: 'per kendaraan';
  itinerary?: string[];

  // Shuttle specific fields
  priceOneWay?: number;
  priceRoundTrip?: number;
  availableDates?: string[];
  pickupPoints?: string[];
  dropOffPoints?: string[];
}

export interface Booking {
    id: string;
    serviceTitle: string;
    type: 'Shuttle' | 'Private Tour'; // Menambahkan tipe layanan ke dalam data pemesanan
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    bookingDate: string;
    status: 'Menunggu Konfirmasi' | 'Terkonfirmasi' | 'Batal';
    totalPrice: number;

    // Shuttle specific booking details
    tripType?: 'One Way' | 'Round Trip';
    pickupPoint?: string;
    dropOffPoint?: string;
}
