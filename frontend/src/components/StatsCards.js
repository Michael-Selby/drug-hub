import React from 'react';
import { Package, AlertTriangle, Ban, DollarSign } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, color, bg }) => (
  <div className="card flex items-center gap-4">
    <div className={`${bg} p-3 rounded-xl`}>
      <Icon size={24} className={color} />
    </div>
    <div>
      <p className="text-sm text-gray-500 font-medium">{label}</p>
      <p className="text-2xl font-bold text-primary">{value}</p>
    </div>
  </div>
);

const StatsCards = ({ drugs, expiringDrugs }) => {
  const total = drugs.length;
  const expired = drugs.filter((d) => new Date(d.expiryDate) < new Date()).length;
  const totalValue = drugs.reduce((sum, d) => sum + d.price * d.quantity, 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard
        icon={Package}
        label="Total Drugs"
        value={total}
        color="text-primary"
        bg="bg-primary-50"
      />
      <StatCard
        icon={AlertTriangle}
        label="Expiring Soon"
        value={expiringDrugs.length}
        color="text-yellow-600"
        bg="bg-yellow-50"
      />
      <StatCard
        icon={Ban}
        label="Expired"
        value={expired}
        color="text-red-600"
        bg="bg-red-50"
      />
      <StatCard
        icon={DollarSign}
        label="Inventory Value"
        value={`$${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
        color="text-green-600"
        bg="bg-green-50"
      />
    </div>
  );
};

export default StatsCards;
