
import React from 'react';
import { AlertTriangleIcon } from './icons';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  serviceName: string;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({ isOpen, onClose, onConfirm, serviceName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50" onClick={onClose}>
      <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start gap-4">
            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-900/50 sm:mx-0 sm:h-10 sm:w-10">
                <AlertTriangleIcon className="h-6 w-6 text-red-400" />
            </div>
            <div className="mt-0 text-left">
                <h3 className="text-lg leading-6 font-bold text-white" id="modal-title">
                    Hapus Layanan
                </h3>
                <div className="mt-2">
                    <p className="text-sm text-gray-300">
                    Apakah Anda yakin ingin menghapus layanan <strong className="font-semibold text-white">"{serviceName}"</strong>? Tindakan ini tidak dapat diurungkan.
                    </p>
                </div>
            </div>
        </div>
        <div className="mt-6 flex justify-end gap-4">
          <button 
            type="button" 
            onClick={onClose} 
            className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition-colors">
            Batal
          </button>
          <button 
            type="button" 
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
