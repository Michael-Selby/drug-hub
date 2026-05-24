import React, { useState } from 'react';
import { AlertTriangle, X, Clock, ChevronDown, ChevronUp } from 'lucide-react';

const getDaysUntilExpiry = (expiryDate) => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const exp = new Date(expiryDate);
  exp.setHours(0, 0, 0, 0);
  return Math.ceil((exp - now) / (1000 * 60 * 60 * 24));
};

const getBadgeStyle = (days) => {
  if (days <= 0) return 'bg-red-100 text-red-700 border border-red-300';
  if (days <= 7) return 'bg-orange-100 text-orange-700 border border-orange-300';
  if (days <= 30) return 'bg-yellow-100 text-yellow-700 border border-yellow-300';
  return 'bg-green-100 text-green-700 border border-green-300';
};

const ExpiryAlert = ({ drugs, onClose }) => {
  const [expanded, setExpanded] = useState(true);

  if (!drugs || drugs.length === 0) return null;

  const critical = drugs.filter((d) => getDaysUntilExpiry(d.expiryDate) <= 7);
  const warning = drugs.filter(
    (d) => getDaysUntilExpiry(d.expiryDate) > 7 && getDaysUntilExpiry(d.expiryDate) <= 30
  );

  return (
    <div className="mb-6 rounded-xl border border-yellow-300 bg-yellow-50 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 bg-yellow-100 border-b border-yellow-300">
        <div className="flex items-center gap-2">
          <AlertTriangle size={20} className="text-yellow-700" />
          <h2 className="font-semibold text-yellow-800 text-sm sm:text-base">
            Expiry Alerts &mdash;{' '}
            <span className="font-bold">{drugs.length} drug{drugs.length !== 1 ? 's' : ''}</span>{' '}
            need attention
            {critical.length > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5">
                {critical.length} critical
              </span>
            )}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setExpanded((p) => !p)}
            className="text-yellow-700 hover:text-yellow-900 transition-colors"
          >
            {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          <button
            onClick={onClose}
            className="text-yellow-700 hover:text-yellow-900 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="p-4">
          {critical.length > 0 && (
            <div className="mb-3">
              <p className="text-xs font-bold text-red-700 uppercase tracking-wider mb-2 flex items-center gap-1">
                <Clock size={12} /> Critical (≤ 7 days)
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {critical.map((drug) => {
                  const days = getDaysUntilExpiry(drug.expiryDate);
                  return (
                    <div
                      key={drug._id}
                      className="flex items-center justify-between bg-white border border-red-200 rounded-lg px-3 py-2 text-sm"
                    >
                      <div>
                        <p className="font-semibold text-gray-800">{drug.name}</p>
                        <p className="text-xs text-gray-500">Qty: {drug.quantity} {drug.unit}</p>
                      </div>
                      <span
                        className={`text-xs font-bold px-2 py-1 rounded-full ${getBadgeStyle(days)}`}
                      >
                        {days <= 0 ? 'Expired' : `${days}d left`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {warning.length > 0 && (
            <div>
              <p className="text-xs font-bold text-yellow-700 uppercase tracking-wider mb-2 flex items-center gap-1">
                <Clock size={12} /> Warning (8–30 days)
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {warning.map((drug) => {
                  const days = getDaysUntilExpiry(drug.expiryDate);
                  return (
                    <div
                      key={drug._id}
                      className="flex items-center justify-between bg-white border border-yellow-200 rounded-lg px-3 py-2 text-sm"
                    >
                      <div>
                        <p className="font-semibold text-gray-800">{drug.name}</p>
                        <p className="text-xs text-gray-500">Qty: {drug.quantity} {drug.unit}</p>
                      </div>
                      <span
                        className={`text-xs font-bold px-2 py-1 rounded-full ${getBadgeStyle(days)}`}
                      >
                        {days}d left
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ExpiryAlert;
