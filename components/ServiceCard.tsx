
import React, { useState } from 'react';
import { Service, Booking } from '../types';
import BookingForm from './BookingForm';
import { MapPinIcon, ClockIcon, UsersIcon, CheckCircleIcon } from './icons';

interface ServiceCardProps {
  service: Service;
  onBookService: (booking: Omit<Booking, 'id'>) => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onBookService }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const InfoChip: React.FC<{ icon: React.ReactNode; text: string }> = ({ icon, text }) => (
    <div className="flex items-center gap-2 bg-gray-700/50 px-3 py-1.5 rounded-full text-sm text-gray-300">
      {icon}
      <span>{text}</span>
    </div>
  );

  const priceToDisplay = service.type === 'Shuttle' ? service.priceOneWay : service.price;
  const priceTypeToDisplay = service.type === 'Shuttle' ? 'per orang (sekali jalan)' : service.priceType;
  const routeToDisplay = service.type === 'Shuttle' ? `${service.pickupPoints?.[0] || 'N/A'} ↔︎ ${service.dropOffPoints?.[0] || 'N/A'}` : service.route;

  return (
    <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 ease-in-out border border-transparent hover:border-blue-500/50">
      <div className="p-4 md:p-6 flex flex-col md:flex-row gap-4 md:gap-6 items-start md:items-center">
        <img
          src={service.image}
          alt={service.title}
          className="w-full md:w-40 h-40 object-cover rounded-lg flex-shrink-0"
        />
        <div className="flex-grow">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3">
             <h3 className="text-xl font-bold text-white">{service.title}</h3>
             <span className="text-xs font-semibold bg-blue-500 text-white px-2.5 py-1 rounded-full mt-2 sm:mt-0">{service.type}</span>
          </div>
          <p className="text-gray-400 mb-4">{service.description}</p>
          <div className="flex flex-wrap gap-3">
            <InfoChip icon={<MapPinIcon className="h-4 w-4" />} text={routeToDisplay ?? 'Rute fleksibel'} />
            {service.type === 'Private Tour' && service.duration && (
              <InfoChip icon={<ClockIcon className="h-4 w-4" />} text={service.duration} />
            )}
            <InfoChip icon={<UsersIcon className="h-4 w-4" />} text={`Hingga ${service.capacity} tamu`} />
          </div>
        </div>
        <div className="flex-shrink-0 w-full md:w-auto flex flex-col items-stretch md:items-end gap-2 pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-gray-700 md:pl-6">
          <p className="text-2xl font-bold text-white text-center md:text-right">
            Rp{(priceToDisplay ?? 0).toLocaleString('id-ID')}
          </p>
          <p className="text-sm text-gray-400 text-center md:text-right mb-2">
            {priceTypeToDisplay}
          </p>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-transform duration-200 hover:scale-105 shadow-md"
            aria-expanded={isExpanded}
          >
            {isExpanded ? 'Tutup' : 'Pesan Sekarang'}
          </button>
        </div>
      </div>
      <div
        className={`transition-all duration-500 ease-in-out overflow-hidden ${
          isExpanded ? 'max-h-[2000px]' : 'max-h-0'
        }`}
      >
        <div className="bg-gray-800/50 p-6 border-t border-gray-700">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div>
                    <h4 className="text-lg font-semibold text-white mb-3">Fasilitas</h4>
                    <ul className="space-y-2">
                    {service.facilities.map((facility, index) => (
                        <li key={index} className="flex items-center gap-2 text-gray-300">
                        <CheckCircleIcon className="h-5 w-5 text-green-400" />
                        {facility}
                        </li>
                    ))}
                    </ul>
                </div>
                {service.itinerary && service.itinerary.length > 0 && (
                <div>
                    <h4 className="text-lg font-semibold text-white mb-3">Rencana Perjalanan</h4>
                    <ul className="space-y-2 list-decimal list-inside text-gray-300">
                    {service.itinerary.map((stop, index) => (
                        <li key={index}>{stop}</li>
                    ))}
                    </ul>
                </div>
                )}
            </div>
            <BookingForm service={service} onBookService={onBookService} />
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
