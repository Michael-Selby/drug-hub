import React, { useState, useEffect, useCallback } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { Plus, Search, RefreshCw, Filter, X } from 'lucide-react';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Signup from './components/Signup';
import StatsCards from './components/StatsCards';
import ExpiryAlert from './components/ExpiryAlert';
import DrugTable from './components/DrugTable';
import DrugForm from './components/DrugForm';
import DeleteConfirm from './components/DeleteConfirm';
import {
  fetchDrugs,
  fetchExpiringDrugs,
  createDrug,
  updateDrug,
  deleteDrug,
} from './api/drugApi';

const EXPIRY_DAYS = 30;

function App() {
  const storedUser = localStorage.getItem('dh_user');
  const [user, setUser] = useState(storedUser ? JSON.parse(storedUser) : null);
  const [authPage, setAuthPage] = useState('login');

  const handleLogin = (userData) => setUser(userData);

  const handleLogout = () => {
    localStorage.removeItem('dh_token');
    localStorage.removeItem('dh_user');
    setUser(null);
    toast.success('Logged out');
  };

  const [drugs, setDrugs] = useState([]);
  const [expiringDrugs, setExpiringDrugs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortField, setSortField] = useState('createdAt');
  const [sortDir, setSortDir] = useState('desc');

  const [showAlert, setShowAlert] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingDrug, setEditingDrug] = useState(null);
  const [deletingDrug, setDeletingDrug] = useState(null);

  const loadDrugs = useCallback(async () => {
    setLoading(true);
    try {
      const [all, expiring] = await Promise.all([
        fetchDrugs({ search, category: categoryFilter }),
        fetchExpiringDrugs(EXPIRY_DAYS),
      ]);
      setDrugs(all);
      setExpiringDrugs(expiring);
    } catch (err) {
      toast.error('Failed to fetch drugs. Is the server running?');
    } finally {
      setLoading(false);
    }
  }, [search, categoryFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadDrugs();
    }, 300);
    return () => clearTimeout(timer);
  }, [loadDrugs]);

  useEffect(() => {
    if (expiringDrugs.length > 0) {
      setShowAlert(true);
    }
  }, [expiringDrugs.length]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const sortedDrugs = [...drugs].sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];
    if (sortField === 'expiryDate') {
      valA = new Date(valA);
      valB = new Date(valB);
    } else if (typeof valA === 'string') {
      valA = valA.toLowerCase();
      valB = valB.toLowerCase();
    }
    if (valA < valB) return sortDir === 'asc' ? -1 : 1;
    if (valA > valB) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  const handleAddClick = () => {
    setEditingDrug(null);
    setShowForm(true);
  };

  const handleEditClick = (drug) => {
    setEditingDrug(drug);
    setShowForm(true);
  };

  const handleFormSubmit = async (data) => {
    setFormLoading(true);
    try {
      if (editingDrug) {
        await updateDrug(editingDrug._id, data);
        toast.success('Drug updated successfully!');
      } else {
        await createDrug(data);
        toast.success('Drug added successfully!');
      }
      setShowForm(false);
      setEditingDrug(null);
      loadDrugs();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setFormLoading(true);
    try {
      await deleteDrug(deletingDrug._id);
      toast.success('Drug deleted successfully');
      setDeletingDrug(null);
      loadDrugs();
    } catch (err) {
      toast.error('Failed to delete drug');
    } finally {
      setFormLoading(false);
    }
  };

  const categories = [...new Set(drugs.map((d) => d.category))].sort();

  if (!user) {
    return (
      <>
        <Toaster position="top-right" toastOptions={{ style: { borderRadius: '10px', fontSize: '14px' } }} />
        {authPage === 'login' ? (
          <Login onLogin={handleLogin} onGoSignup={() => setAuthPage('signup')} />
        ) : (
          <Signup onLogin={handleLogin} onGoLogin={() => setAuthPage('login')} />
        )}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster
        position="top-right"
        toastOptions={{
          style: { borderRadius: '10px', fontSize: '14px' },
          success: { iconTheme: { primary: '#121358', secondary: '#fff' } },
        }}
      />

      <Navbar
        expiringCount={expiringDrugs.length}
        onAlertClick={() => setShowAlert((p) => !p)}
        user={user}
        onLogout={handleLogout}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <StatsCards drugs={drugs} expiringDrugs={expiringDrugs} />

        {showAlert && expiringDrugs.length > 0 && (
          <ExpiryAlert
            drugs={expiringDrugs}
            onClose={() => setShowAlert(false)}
          />
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <h2 className="text-xl font-bold text-primary">Drug Inventory</h2>
          <button onClick={handleAddClick} className="btn-primary">
            <Plus size={18} /> Add Drug
          </button>
        </div>

        <div className="card mb-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search by name, generic name or batch..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field pl-9"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="relative sm:w-52">
              <Filter
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="input-field pl-9"
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <button
              onClick={loadDrugs}
              disabled={loading}
              className="btn-secondary shrink-0"
              title="Refresh"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>

          {(search || categoryFilter) && (
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100 text-sm text-gray-500">
              <span>
                Showing <strong className="text-primary">{sortedDrugs.length}</strong> result
                {sortedDrugs.length !== 1 ? 's' : ''}
              </span>
              {categoryFilter && (
                <span className="flex items-center gap-1 bg-primary-50 text-primary px-2 py-0.5 rounded-full text-xs font-medium">
                  {categoryFilter}
                  <button onClick={() => setCategoryFilter('')}>
                    <X size={12} />
                  </button>
                </span>
              )}
              {search && (
                <span className="flex items-center gap-1 bg-primary-50 text-primary px-2 py-0.5 rounded-full text-xs font-medium">
                  "{search}"
                  <button onClick={() => setSearch('')}>
                    <X size={12} />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {loading ? (
          <div className="card flex items-center justify-center py-16 text-primary">
            <RefreshCw size={32} className="animate-spin opacity-50" />
          </div>
        ) : (
          <DrugTable
            drugs={sortedDrugs}
            onEdit={handleEditClick}
            onDelete={setDeletingDrug}
            sortField={sortField}
            sortDir={sortDir}
            onSort={handleSort}
          />
        )}
      </main>

      {showForm && (
        <DrugForm
          drug={editingDrug}
          onSubmit={handleFormSubmit}
          onClose={() => { setShowForm(false); setEditingDrug(null); }}
          loading={formLoading}
        />
      )}

      {deletingDrug && (
        <DeleteConfirm
          drug={deletingDrug}
          onConfirm={handleDeleteConfirm}
          onClose={() => setDeletingDrug(null)}
          loading={formLoading}
        />
      )}
    </div>
  );
}

export default App;
