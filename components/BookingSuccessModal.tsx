
import React from 'react';
import { Booking } from '../types';
import { CheckCircleIcon, XIcon } from './icons';

interface BookingSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking;
}

const BookingSuccessModal: React.FC<BookingSuccessModalProps> = ({ isOpen, onClose, booking }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50" onClick={onClose}>
      <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md mx-4 relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-white">
            <XIcon className="h-6 w-6" />
        </button>
        <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-500/20 mb-4">
                <CheckCircleIcon className="h-10 w-10 text-green-400" />
            </div>
            <h3 className="text-2xl leading-6 font-bold text-white" id="modal-title">
                Pemesanan Berhasil!
            </h3>
            <div className="mt-4 text-left bg-gray-700/50 p-4 rounded-lg space-y-2">
                <p className="text-sm text-gray-300"><strong>ID Pesanan:</strong> <span className="font-mono">{booking.id}</span></p>
                <p className="text-sm text-gray-300"><strong>Layanan:</strong> {booking.serviceTitle}</p>
                <p className="text-sm text-gray-300"><strong>Tanggal:</strong> {booking.bookingDate}</p>
                <p className="text-sm text-white"><strong>Total:</strong> <span className="font-bold">Rp{booking.totalPrice.toLocaleString('id-ID')}</span></p>
            </div>
            <div className="mt-6">
                 <p className="text-sm text-gray-400 mb-4">
                    Admin kami telah dinotifikasi dan akan segera menghubungi Anda untuk konfirmasi.
                 </p>
            </div>
        </div>
        <div className="mt-4">
          <button 
            type="button" 
            onClick={onClose} 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors">
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccessModal;
