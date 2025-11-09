import React, { useState, useEffect } from 'react';
import ServiceListPage from './components/ServiceListPage';
import AdminDashboard from './components/AdminDashboard';
import ConfirmDeleteModal from './components/ConfirmDeleteModal';
import BookingSuccessModal from './components/BookingSuccessModal';
import ConfirmDeleteBookingModal from './components/ConfirmDeleteBookingModal';
import LoginModal from './components/LoginModal';
import ETicketPage from './components/ETicketPage';
import { CompassIcon, ListTodoIcon, LayoutDashboardIcon, LogInIcon, LogOutIcon } from './components/icons';
import { Service, Booking } from './types';
import * as db from './utils/db';

type Page = 'services' | 'dashboard';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('services');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  
  const [services, setServices] = useState<Service[]>(() => db.getServices());
  const [bookings, setBookings] = useState<Booking[]>(() => db.getBookings());
  
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);
  const [bookingToDelete, setBookingToDelete] = useState<Booking | null>(null);
  
  const [lastSuccessfulBooking, setLastSuccessfulBooking] = useState<Booking | null>(null);
  const [adminWhatsAppNumber, setAdminWhatsAppNumber] = useState<string>(() => db.getAdminWhatsAppNumber());

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [viewingETicket, setViewingETicket] = useState<Booking | null>(null);

  useEffect(() => {
    db.saveServices(services);
  }, [services]);

  useEffect(() => {
    db.saveBookings(bookings);
  }, [bookings]);

  useEffect(() => {
    db.saveAdminWhatsAppNumber(adminWhatsAppNumber);
  }, [adminWhatsAppNumber]);


  const handleOpenLoginModal = () => setIsLoginModalOpen(true);
  const handleCloseLoginModal = () => setIsLoginModalOpen(false);
  
  const handleLoginAttempt = (success: boolean) => {
    if (success) {
      setIsAdminLoggedIn(true);
      setCurrentPage('dashboard');
      handleCloseLoginModal();
    }
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    setCurrentPage('services');
  };
  
  const handleAddService = (service: Omit<Service, 'id'>) => {
    setServices(prev => [...prev, { ...service, id: Date.now() }]);
  };

  const handleUpdateService = (updatedService: Service) => {
    setServices(prev => prev.map(s => s.id === updatedService.id ? updatedService : s));
  };
  
  const handleDeleteServiceRequest = (serviceId: number) => {
    const service = services.find(s => s.id === serviceId);
    if (service) {
      setServiceToDelete(service);
    }
  };

  const handleConfirmDeleteService = () => {
    if (serviceToDelete) {
      setServices(prevServices => prevServices.filter(s => s.id !== serviceToDelete.id));
      setServiceToDelete(null); 
    }
  };

  const handleCancelDeleteService = () => {
    setServiceToDelete(null);
  };

  const handleCreateBooking = (newBookingData: Omit<Booking, 'id'>) => {
    const newBooking: Booking = {
      ...newBookingData,
      id: `BK-${Date.now()}`,
    };
    setBookings(prev => [newBooking, ...prev]);
    setLastSuccessfulBooking(newBooking);

    // Auto-notify admin via WhatsApp
    if (adminWhatsAppNumber) {
        const message = encodeURIComponent(
            `🔔 Notifikasi Pesanan Baru 🔔\n\n` +
            `ID Pesanan: ${newBooking.id}\n` +
            `Nama: ${newBooking.customerName}\n` +
            `Layanan: ${newBooking.serviceTitle}\n` +
            `Tanggal: ${newBooking.bookingDate}\n` +
            `Total Harga: Rp${newBooking.totalPrice.toLocaleString('id-ID')}\n\n` +
            `Mohon segera diproses. Terima kasih.`
        );
        const whatsappUrl = `https://wa.me/${adminWhatsAppNumber}?text=${message}`;
        window.open(whatsappUrl, '_blank');
    }
  };


  const handleCloseSuccessModal = () => {
    setLastSuccessfulBooking(null);
  };

  const handleUpdateAdminWhatsAppNumber = (number: string) => {
    setAdminWhatsAppNumber(number);
  };

  const handleUpdateBookingStatus = (bookingId: string, status: Booking['status']) => {
    setBookings(prev => 
      prev.map(booking => 
        booking.id === bookingId ? { ...booking, status } : booking
      )
    );
  };

  const handleDeleteBookingRequest = (bookingId: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (booking) {
      setBookingToDelete(booking);
    }
  };

  const handleConfirmDeleteBooking = () => {
    if (bookingToDelete) {
      setBookings(prevBookings => prevBookings.filter(b => b.id !== bookingToDelete.id));
      setBookingToDelete(null);
    }
  };

  const handleCancelDeleteBooking = () => {
    setBookingToDelete(null);
  };

  const handleViewETicket = (booking: Booking) => {
    setViewingETicket(booking);
  };

  const handleCloseETicket = () => {
    setViewingETicket(null);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'services':
        return <ServiceListPage services={services} onBookService={handleCreateBooking} />;
      case 'dashboard':
        return isAdminLoggedIn ? (
            <AdminDashboard 
                services={services}
                bookings={bookings}
                onAddService={handleAddService}
                onUpdateService={handleUpdateService}
                onDeleteService={handleDeleteServiceRequest}
                onUpdateBookingStatus={handleUpdateBookingStatus}
                onDeleteBooking={handleDeleteBookingRequest}
                adminWhatsAppNumber={adminWhatsAppNumber}
                onUpdateAdminWhatsAppNumber={handleUpdateAdminWhatsAppNumber}
                onViewETicket={handleViewETicket}
            />
        ) : <ServiceListPage services={services} onBookService={handleCreateBooking}/>;
      default:
        return <ServiceListPage services={services} onBookService={handleCreateBooking} />;
    }
  };

  const NavButton: React.FC<{
    page: Page;
    label: string;
    icon: React.ReactNode;
    onClick?: () => void;
    isActive: boolean;
  }> = ({ page, label, icon, onClick, isActive }) => (
    <button
      onClick={onClick ?? (() => setCurrentPage(page))}
      className={`flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-2 px-4 py-3 rounded-lg transition-colors duration-200 ${
        isActive
          ? 'bg-blue-600 text-white shadow-lg'
          : 'bg-gray-700/50 hover:bg-gray-600/80 text-gray-300'
      }`}
      aria-current={isActive ? 'page' : undefined}
    >
      {icon}
      <span className="text-sm sm:text-base font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <header className="bg-gray-800/80 backdrop-blur-sm shadow-lg sticky top-0 z-20">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <CompassIcon className="h-8 w-8 text-blue-400" />
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              TourBook Pro
            </h1>
          </div>
          <div className="hidden md:flex items-center gap-2">
             <NavButton page="services" label="Layanan" icon={<ListTodoIcon className="h-5 w-5" />} isActive={currentPage === 'services'} />
             {isAdminLoggedIn && <NavButton page="dashboard" label="Dasbor" icon={<LayoutDashboardIcon className="h-5 w-5" />} isActive={currentPage === 'dashboard'} />}
             {isAdminLoggedIn ? (
                 <button onClick={handleAdminLogout} className="flex items-center gap-2 px-4 py-3 rounded-lg bg-red-600/80 hover:bg-red-700/80 text-white transition-colors duration-200">
                     <LogOutIcon className="h-5 w-5" />
                     <span>Logout</span>
                 </button>
             ) : (
                <button onClick={handleOpenLoginModal} className="flex items-center gap-2 px-4 py-3 rounded-lg bg-gray-700/50 hover:bg-gray-600/80 text-gray-300 transition-colors duration-200">
                    <LogInIcon className="h-5 w-5" />
                    <span>Login Admin</span>
                </button>
             )}
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderPage()}
      </main>
      
      <footer className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-800/90 backdrop-blur-sm border-t border-gray-700 p-2 z-20">
          <div className={`grid ${isAdminLoggedIn ? 'grid-cols-3' : 'grid-cols-2'} gap-2`}>
              <NavButton page="services" label="Layanan" icon={<ListTodoIcon className="h-6 w-6 mx-auto" />} isActive={currentPage === 'services'} />
              {isAdminLoggedIn && <NavButton page="dashboard" label="Dasbor" icon={<LayoutDashboardIcon className="h-6 w-6 mx-auto" />} isActive={currentPage === 'dashboard'} />}
               {isAdminLoggedIn ? (
                 <button onClick={handleAdminLogout} className="flex flex-col items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gray-700/50 hover:bg-gray-600/80 text-gray-300">
                     <LogOutIcon className="h-6 w-6 mx-auto" />
                     <span className="text-sm font-medium">Logout</span>
                 </button>
             ) : (
                <button onClick={handleOpenLoginModal} className="flex flex-col items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gray-700/50 hover:bg-gray-600/80 text-gray-300">
                    <LogInIcon className="h-6 w-6 mx-auto" />
                    <span className="text-sm font-medium">Login</span>
                </button>
             )}
          </div>
      </footer>

      {isLoginModalOpen && (
          <LoginModal
            isOpen={isLoginModalOpen}
            onClose={handleCloseLoginModal}
            onLoginAttempt={handleLoginAttempt}
          />
      )}

      {serviceToDelete && (
        <ConfirmDeleteModal
          isOpen={!!serviceToDelete}
          onClose={handleCancelDeleteService}
          onConfirm={handleConfirmDeleteService}
          serviceName={serviceToDelete.title}
        />
      )}

      {bookingToDelete && (
        <ConfirmDeleteBookingModal
          isOpen={!!bookingToDelete}
          onClose={handleCancelDeleteBooking}
          onConfirm={handleConfirmDeleteBooking}
          booking={bookingToDelete}
        />
      )}

      {lastSuccessfulBooking && (
        <BookingSuccessModal
          isOpen={!!lastSuccessfulBooking}
          onClose={handleCloseSuccessModal}
          booking={lastSuccessfulBooking}
        />
      )}

      {viewingETicket && (
        <ETicketPage
          booking={viewingETicket}
          onClose={handleCloseETicket}
        />
      )}

      <div className="h-24 md:hidden"></div>
    </div>
  );
};

export default App;