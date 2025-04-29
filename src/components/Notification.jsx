import { useEffect } from 'react';

export default function Notification({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => onClose(), 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = {
    success: 'bg-green-100 text-green-800',
    error: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800'
  };

  return (
    <div className={`fixed top-4 right-4 p-4 rounded-md shadow-lg ${bgColor[type]} z-50`}>
      <div className="flex items-center">
        <span className="mr-2">
          {type === 'success' ? '✓' : type === 'error' ? '✕' : 'i'}
        </span>
        <span>{message}</span>
        <button 
          onClick={onClose}
          className="ml-4 text-lg font-bold"
        >
          &times;
        </button>
      </div>
    </div>
  );
}