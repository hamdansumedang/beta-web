import React, { useState, useEffect } from 'react';
import { Service } from '../types';

interface ServiceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (service: Service | Omit<Service, 'id'>) => void;
  serviceToEdit?: Service;
}

// Moved outside the component to prevent re-creation on every render, fixing the focus loss bug.
const FormInput = (props: React.InputHTMLAttributes<HTMLInputElement>) => <input {...props} className="bg-gray-700 p-2 rounded w-full text-white"/>;
const FormTextarea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => <textarea {...props} className="bg-gray-700 p-2 rounded w-full h-24 text-white"/>;
const FormSelect = (props: React.SelectHTMLAttributes<HTMLSelectElement>) => <select {...props} className="bg-gray-700 p-2 rounded w-full text-white"/>;


const ServiceFormModal: React.FC<ServiceFormModalProps> = ({ isOpen, onClose, onSave, serviceToEdit }) => {
  const initialServiceState: Omit<Service, 'id'> = {
    title: '',
    type: 'Shuttle',
    route: '',
    duration: '',
    price: 0,
    priceType: 'per kendaraan',
    capacity: 1,
    image: 'https://picsum.photos/seed/newservice/400/400',
    description: '',
    facilities: [],
    itinerary: [],
    priceOneWay: 0,
    priceRoundTrip: 0,
    availableDates: [],
    pickupPoints: [],
    dropOffPoints: [],
  };

  const [service, setService] = useState<Omit<Service, 'id'> | Service>(serviceToEdit || initialServiceState);

  useEffect(() => {
    setService(serviceToEdit || initialServiceState);
  }, [serviceToEdit, isOpen]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const numericFields = ['price', 'capacity', 'priceOneWay', 'priceRoundTrip'];
    if (numericFields.includes(name)) {
      setService({ ...service, [name]: parseInt(value, 10) || 0 });
    } else {
      setService({ ...service, [name]: value });
    }
  };

  const handleListChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'facilities' | 'itinerary' | 'availableDates' | 'pickupPoints' | 'dropOffPoints') => {
    const { value } = e.target;
    setService({...service, [field]: value.split(',').map(item => item.trim()).filter(Boolean) });
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(service);
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50" onClick={onClose}>
      <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-white mb-6">{serviceToEdit ? 'Edit Layanan' : 'Tambah Layanan Baru'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput name="title" value={service.title} onChange={handleChange} placeholder="Nama Layanan" required />
            <FormSelect name="type" value={service.type} onChange={handleChange}>
              <option value="Shuttle">Shuttle</option>
              <option value="Private Tour">Private Tour</option>
            </FormSelect>
          </div>
          <FormInput name="image" value={service.image} onChange={handleChange} placeholder="URL Gambar" required />
          <FormTextarea name="description" value={service.description} onChange={handleChange} placeholder="Deskripsi Singkat" required />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput name="capacity" type="number" value={service.capacity} onChange={handleChange} placeholder="Kapasitas" required min="1" />
            <FormInput name="facilities" value={service.facilities?.join(', ')} onChange={(e) => handleListChange(e, 'facilities')} placeholder="Fasilitas (pisahkan koma)" />
          </div>

          {service.type === 'Shuttle' && (
            <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput name="priceOneWay" type="number" value={service.priceOneWay || ''} onChange={handleChange} placeholder="Harga Sekali Jalan (Rp)" required min="0" />
                    <FormInput name="priceRoundTrip" type="number" value={service.priceRoundTrip || ''} onChange={handleChange} placeholder="Harga Pulang-Pergi (Rp)" required min="0" />
                </div>
                <FormInput name="availableDates" value={service.availableDates?.join(', ')} onChange={(e) => handleListChange(e, 'availableDates')} placeholder="Tanggal Tersedia (YYYY-MM-DD, pisahkan koma)" />
                <FormInput name="pickupPoints" value={service.pickupPoints?.join(', ')} onChange={(e) => handleListChange(e, 'pickupPoints')} placeholder="Titik Jemput (pisahkan koma)" />
                <FormInput name="dropOffPoints" value={service.dropOffPoints?.join(', ')} onChange={(e) => handleListChange(e, 'dropOffPoints')} placeholder="Titik Turun (pisahkan koma)" />
            </>
          )}

          {service.type === 'Private Tour' && (
            <>
                <FormInput name="route" value={service.route || ''} onChange={handleChange} placeholder="Rute Tur" required />
                <FormInput name="duration" value={service.duration || ''} onChange={handleChange} placeholder="Durasi (e.g., 4 jam)" required />
                <FormInput name="price" type="number" value={service.price || ''} onChange={handleChange} placeholder="Harga per Kendaraan (Rp)" required min="0" />
                <FormInput name="itinerary" value={service.itinerary?.join(', ')} onChange={(e) => handleListChange(e, 'itinerary')} placeholder="Rencana Perjalanan (pisahkan koma)" />
            </>
          )}

          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded">Batal</button>
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Simpan</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceFormModal;