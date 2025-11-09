
import React, { useState } from 'react';
import { KeyIcon, UserIcon, XIcon } from './icons';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginAttempt: (success: boolean) => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginAttempt }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Super admin credentials check (kept client-side for this prototype)
    if (username === 'jaluradmin' && password === 'jaluradmin') {
      onLoginAttempt(true);
    } else {
      setError('Nama pengguna atau kata sandi salah.');
      onLoginAttempt(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50" onClick={onClose}>
      <div className="bg-gray-800 rounded-lg shadow-xl p-8 w-full max-w-sm mx-4 relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-white">
            <XIcon className="h-6 w-6" />
        </button>
        <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white">Login Super Admin</h2>
            <p className="text-gray-400 mt-1">Akses dasbor manajemen.</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
            <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">Nama Pengguna</label>
                <div className="relative">
                     <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 pointer-events-none">
                        <UserIcon className="h-5 w-5" />
                    </span>
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 pl-10 pr-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    />
                </div>
            </div>
             <div>
                <label htmlFor="password"  className="block text-sm font-medium text-gray-300 mb-1">Kata Sandi</label>
                 <div className="relative">
                     <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 pointer-events-none">
                        <KeyIcon className="h-5 w-5" />
                    </span>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 pl-10 pr-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    />
                </div>
            </div>
            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
            <div>
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-transform duration-200 hover:scale-105 shadow-lg">
                    Login
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
