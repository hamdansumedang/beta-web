import React, { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Service, Booking } from '../types';
import { EditIcon, TrashIcon, PlusIcon, WhatsAppIcon, CheckCircleIcon, DownloadIcon, EyeIcon } from './icons';
import ServiceFormModal from './ServiceFormModal';


const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-700 p-2 border border-gray-600 rounded-md shadow-lg">
          <p className="label text-white">{`${label}`}</p>
          <p className="intro text-cyan-400">{`${payload[0].name} : ${payload[0].dataKey === 'revenue' ? `Rp${payload[0].value.toLocaleString('id-ID')}`: payload[0].value}`}</p>
        </div>
      );
    }
    return null;
};

interface AdminDashboardProps {
    services: Service[];
    bookings: Booking[];
    onAddService: (service: Omit<Service, 'id'>) => void;
    onUpdateService: (service: Service) => void;
    onDeleteService: (id: number) => void;
    onUpdateBookingStatus: (bookingId: string, status: Booking['status']) => void;
    onDeleteBooking: (id: string) => void;
    adminWhatsAppNumber: string;
    onUpdateAdminWhatsAppNumber: (number: string) => void;
    onViewETicket: (booking: Booking) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
    services, 
    bookings, 
    onAddService, 
    onUpdateService, 
    onDeleteService, 
    onUpdateBookingStatus,
    onDeleteBooking,
    adminWhatsAppNumber,
    onUpdateAdminWhatsAppNumber,
    onViewETicket
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | undefined>(undefined);
  const [whatsAppNumberInput, setWhatsAppNumberInput] = useState(adminWhatsAppNumber);
  const [isSettingsSaved, setIsSettingsSaved] = useState(false);

  useEffect(() => {
    setWhatsAppNumberInput(adminWhatsAppNumber);
  }, [adminWhatsAppNumber]);

  const chartData = useMemo(() => {
    const monthlyRevenue: { [key: string]: number } = {};
    const bookingsPerService: { [key: string]: number } = {};
    
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

    bookings.forEach(booking => {
        // Revenue logic
        const date = new Date(booking.bookingDate);
        if (!isNaN(date.getTime())) {
            const month = monthNames[date.getMonth()];
            if (!monthlyRevenue[month]) monthlyRevenue[month] = 0;
            monthlyRevenue[month] += booking.totalPrice;
        }

        // Bookings per service logic
        if (!bookingsPerService[booking.serviceTitle]) bookingsPerService[booking.serviceTitle] = 0;
        bookingsPerService[booking.serviceTitle]++;
    });

    const revenueChartData = monthNames.map(month => ({
      name: month,
      revenue: monthlyRevenue[month] || 0
    }));
    
    const serviceChartData = Object.keys(bookingsPerService).map(title => ({ 
        name: title.length > 15 ? title.substring(0, 15) + '...' : title, 
        bookings: bookingsPerService[title] 
    }));

    return { revenueChartData, serviceChartData };
  }, [bookings]);

  const handleOpenModalForEdit = (service: Service) => {
      setEditingService(service);
      setIsModalOpen(true);
  }

  const handleOpenModalForAdd = () => {
      setEditingService(undefined);
      setIsModalOpen(true);
  }

  const handleCloseModal = () => {
      setIsModalOpen(false);
      setEditingService(undefined);
  }
  
  const handleSaveService = (service: Service | Omit<Service, 'id'>) => {
      if ('id' in service) {
          onUpdateService(service);
          alert(`Layanan "${service.title}" berhasil diperbarui.`);
      } else {
          onAddService(service);
          alert(`Layanan "${service.title}" berhasil ditambahkan.`);
      }
      handleCloseModal();
  }

  const handleWhatsAppContact = (booking: Booking) => {
    const isConfirmed = booking.status === 'Terkonfirmasi';
    const messageTemplate = isConfirmed
      ? `Halo ${booking.customerName}, kami menghubungi Anda terkait pesanan Anda #${booking.id} untuk layanan ${booking.serviceTitle} pada tanggal ${booking.bookingDate}.`
      : `Halo ${booking.customerName}, kami ingin mengkonfirmasi pesanan Anda #${booking.id} untuk layanan ${booking.serviceTitle} pada tanggal ${booking.bookingDate}. Mohon balas pesan ini untuk konfirmasi.`;
    
    const message = encodeURIComponent(messageTemplate);
    const whatsappUrl = `https://wa.me/${booking.customerPhone}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleWhatsAppSettingsSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateAdminWhatsAppNumber(whatsAppNumberInput);
    setIsSettingsSaved(true);
    setTimeout(() => {
        setIsSettingsSaved(false);
    }, 3000);
  };
  
  const handleExportCSV = () => {
    const headers = [
      "ID Pesanan", "Nama Pelanggan", "No. WhatsApp", "Email", "Layanan",
      "Tanggal Pesan", "Status", "Total Harga", "Tipe Perjalanan",
      "Titik Jemput", "Titik Turun"
    ];

    const rows = bookings.map(b => [
      `"${b.id}"`, `"${b.customerName}"`, `"${b.customerPhone}"`,
      `"${b.customerEmail || ''}"`, `"${b.serviceTitle}"`, `"${b.bookingDate}"`,
      `"${b.status}"`, b.totalPrice, `"${b.tripType || ''}"`,
      `"${b.pickupPoint || ''}"`, `"${b.dropOffPoint || ''}"`
    ].join(','));

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "laporan_pesanan.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-12">
      <div className="text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Dasbor Admin</h2>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-400">
          Metrik utama dan kinerja bisnis dalam sekejap.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
          <h3 className="text-xl font-bold mb-4 text-white">Pendapatan Bulanan</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData.revenueChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
              <XAxis dataKey="name" stroke="#A0AEC0" />
              <YAxis stroke="#A0AEC0" tickFormatter={(val) => `Rp${(val/1_000_000).toFixed(0)}Jt`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line type="monotone" dataKey="revenue" name="Pendapatan" stroke="#38B2AC" strokeWidth={2} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
          <h3 className="text-xl font-bold mb-4 text-white">Pemesanan per Layanan</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData.serviceChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
              <XAxis dataKey="name" stroke="#A0AEC0" />
              <YAxis stroke="#A0AEC0" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="bookings" name="Jumlah Pesanan" fill="#4299E1" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-white">Kelola Layanan</h3>
            <button onClick={handleOpenModalForAdd} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition">
                <PlusIcon className="h-5 w-5" />
                <span>Tambah Layanan</span>
            </button>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left text-gray-300">
                <thead className="bg-gray-700/50 text-xs uppercase">
                    <tr>
                        <th className="p-3">Nama Layanan</th>
                        <th className="p-3">Tipe</th>
                        <th className="p-3">Harga (Rp)</th>
                        <th className="p-3 text-center">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {services.map(service => (
                        <tr key={service.id} className="border-b border-gray-700 hover:bg-gray-700/30">
                            <td className="p-3 font-medium">{service.title}</td>
                            <td className="p-3">{service.type}</td>
                            <td className="p-3">
                                {(
                                    service.type === 'Shuttle' 
                                    ? service.priceOneWay 
                                    : service.price
                                )?.toLocaleString('id-ID') ?? 'N/A'}
                            </td>
                            <td className="p-3 flex justify-center items-center gap-2">
                                <button onClick={() => handleOpenModalForEdit(service)} className="p-2 text-yellow-400 hover:text-yellow-300"><EditIcon className="h-5 w-5" /></button>
                                <button onClick={() => onDeleteService(service.id)} className="p-2 text-red-400 hover:text-red-300"><TrashIcon className="h-5 w-5" /></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>

       {/* Bookings Report Section */}
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-white">Laporan Pesanan</h3>
            <button onClick={handleExportCSV} className="flex items-center gap-2 bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition">
                <DownloadIcon className="h-5 w-5" />
                <span>Ekspor CSV</span>
            </button>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left text-gray-300">
                <thead className="bg-gray-700/50 text-xs uppercase">
                    <tr>
                        <th className="p-3">ID Pesanan</th>
                        <th className="p-3">Pelanggan</th>
                        <th className="p-3">No. WhatsApp</th>
                        <th className="p-3">Email</th>
                        <th className="p-3">Layanan</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-center">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {bookings.map(booking => (
                        <tr key={booking.id} className="border-b border-gray-700 hover:bg-gray-700/30">
                            <td className="p-3 font-mono text-sm">{booking.id}</td>
                            <td className="p-3">{booking.customerName}</td>
                            <td className="p-3 font-mono text-sm">{booking.customerPhone}</td>
                            <td className="p-3 text-sm">{booking.customerEmail || '-'}</td>
                            <td className="p-3">{booking.serviceTitle}</td>
                            <td className="p-3">
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${booking.status === 'Terkonfirmasi' ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
                                    {booking.status}
                                </span>
                            </td>
                            <td className="p-3">
                                <div className="flex items-center justify-center gap-2">
                                    {booking.status === 'Menunggu Konfirmasi' && (
                                        <button onClick={() => onUpdateBookingStatus(booking.id, 'Terkonfirmasi')} className="p-2 text-green-400 hover:text-green-300 transition" title="Tandai Terkonfirmasi">
                                            <CheckCircleIcon className="h-5 w-5" />
                                        </button>
                                    )}
                                    <button onClick={() => handleWhatsAppContact(booking)} className="p-2 text-green-400 hover:text-green-300 transition" title="Hubungi via WhatsApp">
                                        <WhatsAppIcon className="h-5 w-5 fill-current" />
                                    </button>
                                    {booking.status === 'Terkonfirmasi' && (
                                        <button onClick={() => onViewETicket(booking)} className="p-2 text-sky-400 hover:text-sky-300 transition" title="Lihat E-Ticket">
                                            <EyeIcon className="h-5 w-5" />
                                        </button>
                                    )}
                                    <button onClick={() => onDeleteBooking(booking.id)} className="p-2 text-red-400 hover:text-red-300 transition" title="Hapus Pesanan">
                                        <TrashIcon className="h-5 w-5" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
      
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-4">Pengaturan</h3>
        <form onSubmit={handleWhatsAppSettingsSave} className="max-w-md">
            <div>
                <label htmlFor="whatsapp-admin" className="block text-sm font-medium text-gray-300 mb-1">
                    Nomor WhatsApp Admin untuk Notifikasi
                </label>
                <div className="flex items-center gap-2">
                    <input 
                        type="tel"
                        id="whatsapp-admin"
                        value={whatsAppNumberInput}
                        onChange={(e) => setWhatsAppNumberInput(e.target.value)}
                        placeholder="Contoh: 6281234567890"
                        className="flex-grow bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    />
                    <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition">
                        Simpan
                    </button>
                     {isSettingsSaved && (
                        <span className="text-green-400 text-sm transition-opacity duration-300">Tersimpan!</span>
                    )}
                </div>
                <p className="text-xs text-gray-500 mt-2">Masukkan nomor dengan format internasional (misal, 62 untuk Indonesia) tanpa tanda '+' atau spasi.</p>
            </div>
        </form>
      </div>


      {isModalOpen && (
          <ServiceFormModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onSave={handleSaveService}
            serviceToEdit={editingService}
          />
      )}
    </div>
  );
};

export default AdminDashboard;