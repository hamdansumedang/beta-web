import React from 'react';
import { Booking } from '../types';
import { XIcon } from './icons';

interface ETicketPageProps {
  booking: Booking;
  onClose: () => void;
}

const ETicketPage: React.FC<ETicketPageProps> = ({ booking, onClose }) => {
  // Membuat data string untuk di-encode dalam QR code
  const qrData = `ID Pesanan: ${booking.id}\nNama: ${booking.customerName}\nLayanan: ${booking.serviceTitle}\nTanggal: ${booking.bookingDate}`;
  const qrCodeUrl = `https://quickchart.io/qr?text=${encodeURIComponent(qrData)}&size=128`;

  const DetailRow: React.FC<{ label: string; value: string | undefined | number }> = ({ label, value }) => (
    <div className="border-b border-gray-700 py-3 flex justify-between items-center">
      <span className="text-sm text-gray-400">{label}</span>
      <span className="text-sm font-semibold text-white text-right">{value || 'N/A'}</span>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-gray-900 z-50 p-4 sm:p-6 lg:p-8 flex justify-center items-center animate-fade-in">
      <div className="w-full max-w-lg bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white bg-gray-700/50 hover:bg-gray-600/80 rounded-full p-2 transition-colors z-10"
          aria-label="Tutup E-Ticket"
        >
          <XIcon className="h-6 w-6" />
        </button>

        {/* Ticket Body */}
        <div className="p-6 sm:p-8">
          <header className="text-center pb-4 border-b-2 border-dashed border-gray-600">
            <h1 className="text-3xl font-bold text-white tracking-wider">E-TICKET</h1>
            <p className="text-blue-400 font-mono mt-1">{booking.id}</p>
          </header>

          <main className="mt-6">
            <h2 className="text-lg font-bold text-white">{booking.serviceTitle}</h2>
            <p className="text-sm text-gray-400 mb-4">{booking.type}</p>

            <div className="space-y-1">
              <DetailRow label="Nama Pelanggan" value={booking.customerName} />
              <DetailRow label="Tanggal" value={booking.bookingDate} />
              {booking.type === 'Shuttle' && (
                <>
                  <DetailRow label="Tipe Perjalanan" value={booking.tripType} />
                  <DetailRow label="Titik Jemput" value={booking.pickupPoint} />
                  <DetailRow label="Titik Turun" value={booking.dropOffPoint} />
                </>
              )}
              <DetailRow label="Status" value={booking.status} />
            </div>
          </main>
        </div>

        {/* Ticket Footer with Perforated Edge */}
        <div className="relative">
          <div className="absolute -top-3 left-0 right-0 flex justify-between">
            <div className="w-6 h-6 bg-gray-900 rounded-full -ml-3"></div>
            <div className="w-6 h-6 bg-gray-900 rounded-full -mr-3"></div>
          </div>
          <div className="bg-gray-700/50 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <p className="text-sm text-gray-400">Total Harga</p>
              <p className="text-3xl font-bold text-white">Rp{booking.totalPrice.toLocaleString('id-ID')}</p>
            </div>
            <div className="flex-shrink-0">
              <img src={qrCodeUrl} alt="QR Code" className="w-24 h-24 rounded-lg bg-white p-1" />
              <p className="text-xs text-gray-500 mt-1 text-center">Pindai untuk validasi</p>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ETicketPage;