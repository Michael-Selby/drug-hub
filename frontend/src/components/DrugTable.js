import React from 'react';
import { Pencil, Trash2, ChevronUp, ChevronDown, Package } from 'lucide-react';

const getDaysUntilExpiry = (expiryDate) => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const exp = new Date(expiryDate);
  exp.setHours(0, 0, 0, 0);
  return Math.ceil((exp - now) / (1000 * 60 * 60 * 24));
};

const ExpiryBadge = ({ expiryDate }) => {
  const days = getDaysUntilExpiry(expiryDate);
  const date = new Date(expiryDate).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
  });

  let badge = '';
  let tip = '';
  if (days <= 0) {
    badge = 'bg-red-100 text-red-700 border border-red-300';
    tip = 'Expired';
  } else if (days <= 7) {
    badge = 'bg-orange-100 text-orange-700 border border-orange-300';
    tip = `${days}d left`;
  } else if (days <= 30) {
    badge = 'bg-yellow-100 text-yellow-700 border border-yellow-300';
    tip = `${days}d left`;
  } else {
    badge = 'bg-green-50 text-green-700 border border-green-200';
    tip = null;
  }

  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm text-gray-700">{date}</span>
      {tip && (
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full w-fit ${badge}`}>
          {tip}
        </span>
      )}
    </div>
  );
};

const SortIcon = ({ field, sortField, sortDir }) => {
  if (sortField !== field)
    return <ChevronUp size={14} className="text-gray-300 group-hover:text-gray-400" />;
  return sortDir === 'asc' ? (
    <ChevronUp size={14} className="text-primary" />
  ) : (
    <ChevronDown size={14} className="text-primary" />
  );
};

const DrugTable = ({ drugs, onEdit, onDelete, sortField, sortDir, onSort }) => {
  const headers = [
    { key: 'name', label: 'Name' },
    { key: 'category', label: 'Category' },
    { key: 'quantity', label: 'Qty' },
    { key: 'price', label: 'Price' },
    { key: 'expiryDate', label: 'Expiry Date' },
    { key: 'manufacturer', label: 'Manufacturer' },
  ];

  if (drugs.length === 0) {
    return (
      <div className="card flex flex-col items-center justify-center py-16 text-gray-400">
        <Package size={48} className="mb-3 opacity-30" />
        <p className="font-medium text-lg">No drugs found</p>
        <p className="text-sm">Add a drug to get started</p>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-primary text-white text-left">
              {headers.map((h) => (
                <th
                  key={h.key}
                  className="px-4 py-3 font-semibold cursor-pointer select-none group"
                  onClick={() => onSort(h.key)}
                >
                  <div className="flex items-center gap-1">
                    {h.label}
                    <SortIcon field={h.key} sortField={sortField} sortDir={sortDir} />
                  </div>
                </th>
              ))}
              <th className="px-4 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {drugs.map((drug, i) => {
              const expired = getDaysUntilExpiry(drug.expiryDate) <= 0;
              const nearExpiry =
                getDaysUntilExpiry(drug.expiryDate) > 0 &&
                getDaysUntilExpiry(drug.expiryDate) <= 30;

              return (
                <tr
                  key={drug._id}
                  className={`border-b border-gray-100 hover:bg-primary-50 transition-colors duration-100 ${
                    expired ? 'bg-red-50' : nearExpiry ? 'bg-yellow-50' : i % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  }`}
                >
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-semibold text-gray-800">{drug.name}</p>
                      {drug.genericName && (
                        <p className="text-xs text-gray-400">{drug.genericName}</p>
                      )}
                      {drug.batchNumber && (
                        <p className="text-xs text-gray-400 font-mono">{drug.batchNumber}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="bg-primary-50 text-primary text-xs font-medium px-2 py-1 rounded-full">
                      {drug.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-700">
                    {drug.quantity} <span className="text-gray-400 text-xs">{drug.unit}</span>
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-700">
                    ${Number(drug.price).toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    <ExpiryBadge expiryDate={drug.expiryDate} />
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {drug.manufacturer || <span className="text-gray-300">—</span>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEdit(drug)}
                        className="p-1.5 rounded-lg text-primary hover:bg-primary-50 transition-colors"
                        title="Edit"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => onDelete(drug)}
                        className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DrugTable;
