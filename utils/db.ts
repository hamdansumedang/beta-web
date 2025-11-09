
import { Service, Booking } from '../types';
import { SERVICES_DATA, BOOKINGS_DATA } from '../constants';

const SERVICES_KEY = 'tourbook_services';
const BOOKINGS_KEY = 'tourbook_bookings';
const ADMIN_WHATSAPP_KEY = 'tourbook_admin_whatsapp';

// Generic function to get an item from localStorage
const getDbItem = <T,>(key: string, fallback: T): T => {
    try {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : fallback;
    } catch (error) {
        console.error(`Error reading from localStorage key “${key}”:`, error);
        return fallback;
    }
};

// Generic function to save an item to localStorage
const saveDbItem = <T,>(key: string, value: T): void => {
    try {
        window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error(`Error writing to localStorage key “${key}”:`, error);
    }
};

// Initialize database with seed data if it doesn't exist
const initializeDatabase = () => {
    if (!localStorage.getItem(SERVICES_KEY)) {
        saveDbItem(SERVICES_KEY, SERVICES_DATA);
    }
    if (!localStorage.getItem(BOOKINGS_KEY)) {
        saveDbItem(BOOKINGS_KEY, BOOKINGS_DATA);
    }
    if (!localStorage.getItem(ADMIN_WHATSAPP_KEY)) {
        saveDbItem(ADMIN_WHATSAPP_KEY, '6281234567890');
    }
};

// --- Public API for DB interaction ---

export const getServices = (): Service[] => getDbItem(SERVICES_KEY, SERVICES_DATA);
export const saveServices = (services: Service[]) => saveDbItem(SERVICES_KEY, services);

export const getBookings = (): Booking[] => getDbItem(BOOKINGS_KEY, BOOKINGS_DATA);
export const saveBookings = (bookings: Booking[]) => saveDbItem(BOOKINGS_KEY, bookings);

export const getAdminWhatsAppNumber = (): string => getDbItem(ADMIN_WHATSAPP_KEY, '6281234567890');
export const saveAdminWhatsAppNumber = (number: string) => saveDbItem(ADMIN_WHATSAPP_KEY, number);

// Run initialization on load
initializeDatabase();
