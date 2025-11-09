
import React from 'react';
import { Service, Booking } from '../types';
import ServiceCard from './ServiceCard';

interface ServiceListPageProps {
  services: Service[];
  onBookService: (booking: Omit<Booking, 'id'>) => void;
}

const ServiceListPage: React.FC<ServiceListPageProps> = ({ services, onBookService }) => {
  return (
    <div>
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Layanan Kami</h2>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-400">
          Pilih dari layanan shuttle kami yang andal atau pesan tur pribadi yang dapat disesuaikan.
        </p>
      </div>
      <div className="space-y-6">
        {services.map((service: Service) => (
          <ServiceCard key={service.id} service={service} onBookService={onBookService} />
        ))}
      </div>
    </div>
  );
};

export default ServiceListPage;
