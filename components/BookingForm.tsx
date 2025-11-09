
import React, { useState, useEffect } from 'react';
import { Booking, Service } from '../types';
import { CalendarIcon, MailIcon, PhoneIcon, UserIcon, CreditCardIcon, MapPinIcon } from './icons';

interface BookingFormProps {
    service: Service;
    onBookService: (booking: Omit<Booking, 'id'>) => void;
}

// Moved outside the component to prevent re-creation on every render, fixing the focus loss bug.
const FormField: React.FC<{
    label: string, 
    id: string, 
    name: string, 
    value: string, 
    icon: React.ReactNode, 
    children: React.ReactNode, 
    required?: boolean
}> = ({label, id, icon, children, required = true}) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">
            {label} {required ? '' : <span className="text-gray-500">(Opsional)</span>}
        </label>
        <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 pointer-events-none">
                {icon}
            </span>
            {children}
        </div>
    </div>
);


const BookingForm: React.FC<BookingFormProps> = ({ service, onBookService }) => {
    
    const initialFormState = {
        name: '',
        email: '',
        phone: '',
        date: service.type === 'Shuttle' ? service.availableDates?.[0] || '' : '',
        pickupPoint: service.pickupPoints?.[0] || '',
        dropOffPoint: service.dropOffPoints?.[0] || '',
    };
    
    const [bookingDetails, setBookingDetails] = useState(initialFormState);
    const [tripType, setTripType] = useState<'One Way' | 'Round Trip'>('One Way');
    const [isLoading, setIsLoading] = useState(false);

    // Reset form when service changes or when default values change
    useEffect(() => {
        setBookingDetails({
          name: '',
          email: '',
          phone: '',
          date: service.type === 'Shuttle' ? service.availableDates?.[0] || '' : '',
          pickupPoint: service.pickupPoints?.[0] || '',
          dropOffPoint: service.dropOffPoints?.[0] || '',
        });
        setTripType('One Way');
    }, [service]);


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setBookingDetails(prev => ({...prev, [name]: value}));
    }
    
    const handleTripTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTripType(e.target.checked ? 'Round Trip' : 'One Way');
    }

    const calculatePrice = () => {
        if (service.type === 'Shuttle') {
            return tripType === 'Round Trip' ? service.priceRoundTrip ?? 0 : service.priceOneWay ?? 0;
        }
        return service.price ?? 0;
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate a short delay for better UX
        setTimeout(() => {
            const totalPrice = calculatePrice();
            
            const newBooking: Omit<Booking, 'id'> = {
                serviceTitle: service.title,
                type: service.type, // Include the service type in the booking data
                customerName: bookingDetails.name,
                customerPhone: bookingDetails.phone,
                customerEmail: bookingDetails.email,
                bookingDate: bookingDetails.date,
                status: 'Menunggu Konfirmasi',
                totalPrice: totalPrice,
                ...(service.type === 'Shuttle' && {
                    tripType: tripType,
                    pickupPoint: bookingDetails.pickupPoint,
                    dropOffPoint: bookingDetails.dropOffPoint,
                })
            };
            onBookService(newBooking);
            
            setBookingDetails(initialFormState);
            setTripType('One Way');
            setIsLoading(false);
        }, 500);
    }
    
    const renderShuttleForm = () => (
        <>
            <FormField label="Pilih Tanggal" id="date" name="date" value={bookingDetails.date} icon={<CalendarIcon className="h-5 w-5" />}>
                <select id="date" name="date" value={bookingDetails.date} onChange={handleInputChange} required className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 pl-10 pr-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition appearance-none">
                    <option value="" disabled>Pilih tanggal...</option>
                    {service.availableDates?.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
            </FormField>
            <FormField label="Titik Penjemputan" id="pickupPoint" name="pickupPoint" value={bookingDetails.pickupPoint} icon={<MapPinIcon className="h-5 w-5" />}>
                 <select id="pickupPoint" name="pickupPoint" value={bookingDetails.pickupPoint} onChange={handleInputChange} required className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 pl-10 pr-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition appearance-none">
                    {service.pickupPoints?.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
            </FormField>
            <FormField label="Titik Turun" id="dropOffPoint" name="dropOffPoint" value={bookingDetails.dropOffPoint} icon={<MapPinIcon className="h-5 w-5" />}>
                 <select id="dropOffPoint" name="dropOffPoint" value={bookingDetails.dropOffPoint} onChange={handleInputChange} required className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 pl-10 pr-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition appearance-none">
                    {service.dropOffPoints?.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
            </FormField>
            <div className="flex items-center mt-2">
                <input type="checkbox" id="roundTrip" name="roundTrip" checked={tripType === 'Round Trip'} onChange={handleTripTypeChange} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 bg-gray-700" />
                <label htmlFor="roundTrip" className="ml-2 block text-sm text-gray-300">Pulang-Pergi (Round Trip)</label>
            </div>
        </>
    );

    const renderTourForm = () => (
         <FormField label="Tanggal" id="date" name="date" value={bookingDetails.date} icon={<CalendarIcon className="h-5 w-5" />}>
            <input
                type="date" id="date" name="date" value={bookingDetails.date} onChange={handleInputChange}
                min={new Date().toISOString().split('T')[0]} required
                className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 pl-10 pr-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
         </FormField>
    );

    return (
        <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-6">Lengkapi Pemesanan Anda</h3>
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Kolom 1: Detail Perjalanan */}
                    <div className="space-y-4">
                        {service.type === 'Shuttle' ? renderShuttleForm() : renderTourForm()}
                    </div>
                    {/* Kolom 2: Info Kontak */}
                     <div className="space-y-4">
                         <FormField label="Nama Lengkap" id="name" name="name" value={bookingDetails.name} icon={<UserIcon className="h-5 w-5" />}>
                           <input type="text" id="name" name="name" value={bookingDetails.name} onChange={handleInputChange} required className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 pl-10 pr-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" />
                         </FormField>
                         <FormField label="No. WhatsApp" id="phone" name="phone" value={bookingDetails.phone} icon={<PhoneIcon className="h-5 w-5" />}>
                           <input type="tel" id="phone" name="phone" value={bookingDetails.phone} onChange={handleInputChange} required className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 pl-10 pr-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" />
                         </FormField>
                    </div>
                    {/* Kolom 3: Kontak Tambahan & Harga */}
                    <div className="space-y-4">
                         <FormField label="Email" id="email" name="email" value={bookingDetails.email} icon={<MailIcon className="h-5 w-5" />} required={false}>
                            <input type="email" id="email" name="email" value={bookingDetails.email} onChange={handleInputChange} className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 pl-10 pr-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" />
                         </FormField>
                         <div className="bg-gray-800 p-4 rounded-lg text-center">
                            <p className="text-sm text-gray-400">Total Harga</p>
                            <p className="text-2xl font-bold text-white">Rp{calculatePrice().toLocaleString('id-ID')}</p>
                         </div>
                    </div>
                </div>
                <div className="mt-8 pt-6 border-t border-gray-700">
                    <button type="submit" disabled={isLoading} className="w-full flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-transform duration-200 hover:scale-105 shadow-lg disabled:bg-green-800 disabled:cursor-not-allowed">
                        <CreditCardIcon className="h-5 w-5" />
                        {isLoading ? 'Memproses...' : 'Konfirmasi Pemesanan'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default BookingForm;