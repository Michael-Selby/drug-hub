import React from 'react';
import { Trash2, X } from 'lucide-react';

const DeleteConfirm = ({ drug, onConfirm, onClose, loading }) => {
  if (!drug) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <div className="flex items-center justify-center w-14 h-14 bg-red-100 rounded-full mx-auto mb-4">
          <Trash2 size={26} className="text-red-600" />
        </div>
        <h3 className="text-lg font-bold text-gray-800 text-center mb-1">Delete Drug</h3>
        <p className="text-sm text-gray-500 text-center mb-6">
          Are you sure you want to delete{' '}
          <span className="font-semibold text-gray-800">{drug.name}</span>? This action cannot be
          undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            disabled={loading}
            className="btn-danger flex-1 justify-center"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <><Trash2 size={16} /> Delete</>
            )}
          </button>
          <button onClick={onClose} className="btn-secondary flex-1 justify-center">
            <X size={16} /> Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirm;
