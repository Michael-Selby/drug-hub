import React, { useState, useEffect } from 'react';
import { X, Save, Plus, Mic } from 'lucide-react';
import VoiceInputModal from './VoiceInputModal';

const CATEGORIES = [
  'Antibiotic',
  'Analgesic',
  'Antiviral',
  'Antifungal',
  'Antihistamine',
  'Antacid',
  'Cardiovascular',
  'Diabetes',
  'Vitamins & Supplements',
  'Respiratory',
  'Dermatological',
  'Neurological',
  'Other',
];

const UNITS = ['pcs', 'tablets', 'capsules', 'ml', 'mg', 'g', 'vials', 'bottles', 'sachets'];

const emptyForm = {
  name: '',
  genericName: '',
  category: '',
  manufacturer: '',
  batchNumber: '',
  quantity: '',
  unit: 'pcs',
  price: '',
  expiryDate: '',
  description: '',
};

const DrugForm = ({ drug, onSubmit, onClose, loading }) => {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [showVoice, setShowVoice] = useState(false);

  useEffect(() => {
    if (drug) {
      setForm({
        name: drug.name || '',
        genericName: drug.genericName || '',
        category: drug.category || '',
        manufacturer: drug.manufacturer || '',
        batchNumber: drug.batchNumber || '',
        quantity: drug.quantity !== undefined ? drug.quantity : '',
        unit: drug.unit || 'pcs',
        price: drug.price !== undefined ? drug.price : '',
        expiryDate: drug.expiryDate
          ? new Date(drug.expiryDate).toISOString().split('T')[0]
          : '',
        description: drug.description || '',
      });
    } else {
      setForm(emptyForm);
    }
    setErrors({});
  }, [drug]);

  const handleVoiceApply = (parsed) => {
    setForm((prev) => ({
      ...prev,
      ...Object.fromEntries(
        Object.entries(parsed).map(([k, v]) => [k, v !== undefined ? String(v) : prev[k]])
      ),
    }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.category) errs.category = 'Category is required';
    if (form.quantity === '' || form.quantity < 0) errs.quantity = 'Valid quantity required';
    if (form.price === '' || form.price < 0) errs.price = 'Valid price required';
    if (!form.expiryDate) errs.expiryDate = 'Expiry date is required';
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    onSubmit({
      ...form,
      quantity: Number(form.quantity),
      price: Number(form.price),
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="text-lg font-bold text-primary flex items-center gap-2">
            {drug ? <Save size={20} /> : <Plus size={20} />}
            {drug ? 'Edit Drug' : 'Add New Drug'}
          </h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowVoice(true)}
              title="Fill with voice"
              className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors"
              style={{ color: '#121358', borderColor: '#121358' }}
            >
              <Mic size={14} /> Voice
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          </div>
        </div>

      {showVoice && (
        <VoiceInputModal
          onApply={handleVoiceApply}
          onClose={() => setShowVoice(false)}
        />
      )}

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">
                Drug Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Paracetamol 500mg"
                className={`input-field ${errors.name ? 'border-red-400 focus:ring-red-400' : ''}`}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="label">Generic Name</label>
              <input
                type="text"
                name="genericName"
                value={form.genericName}
                onChange={handleChange}
                placeholder="e.g. Acetaminophen"
                className="input-field"
              />
            </div>

            <div>
              <label className="label">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className={`input-field ${errors.category ? 'border-red-400 focus:ring-red-400' : ''}`}
              >
                <option value="">Select category</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
            </div>

            <div>
              <label className="label">Manufacturer</label>
              <input
                type="text"
                name="manufacturer"
                value={form.manufacturer}
                onChange={handleChange}
                placeholder="e.g. Pfizer"
                className="input-field"
              />
            </div>

            <div>
              <label className="label">Batch Number</label>
              <input
                type="text"
                name="batchNumber"
                value={form.batchNumber}
                onChange={handleChange}
                placeholder="e.g. BT-20240101"
                className="input-field"
              />
            </div>

            <div>
              <label className="label">
                Expiry Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="expiryDate"
                value={form.expiryDate}
                onChange={handleChange}
                className={`input-field ${errors.expiryDate ? 'border-red-400 focus:ring-red-400' : ''}`}
              />
              {errors.expiryDate && <p className="text-red-500 text-xs mt-1">{errors.expiryDate}</p>}
            </div>

            <div>
              <label className="label">
                Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="quantity"
                value={form.quantity}
                onChange={handleChange}
                min="0"
                placeholder="0"
                className={`input-field ${errors.quantity ? 'border-red-400 focus:ring-red-400' : ''}`}
              />
              {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>}
            </div>

            <div>
              <label className="label">Unit</label>
              <select
                name="unit"
                value={form.unit}
                onChange={handleChange}
                className="input-field"
              >
                {UNITS.map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">
                Price (per unit, $) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                placeholder="0.00"
                className={`input-field ${errors.price ? 'border-red-400 focus:ring-red-400' : ''}`}
              />
              {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
            </div>
          </div>

          <div>
            <label className="label">Description / Notes</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder="Optional notes about this drug..."
              className="input-field resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2 border-t border-gray-100">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1 justify-center"
            >
              {loading ? (
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : drug ? (
                <><Save size={16} /> Update Drug</>
              ) : (
                <><Plus size={16} /> Add Drug</>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1 justify-center"
            >
              <X size={16} /> Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DrugForm;
