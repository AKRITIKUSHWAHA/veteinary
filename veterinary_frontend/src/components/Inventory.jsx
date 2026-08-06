import { apiFetch } from '../utils/api';
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Package, Plus, AlertTriangle, Search, Edit3, Trash2, ShieldAlert, Activity, CheckCircle, Clock, Loader, Filter, SlidersHorizontal, RotateCcw, X, Maximize2, Minimize2 } from 'lucide-react';
import FormSelect from './FormSelect';
import toast from 'react-hot-toast';
import { formatCurrency } from '../utils/formatters';

export default function Inventory() {
  const [stock, setStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Dedicated Stock Refill Modal states
  const [refillModalItem, setRefillModalItem] = useState(null);
  const [addQtyInput, setAddQtyInput] = useState(10);
  const [newRefillExpiry, setNewRefillExpiry] = useState('');
  const [refillNotes, setRefillNotes] = useState('');

  // Form states
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [batchNumber, setBatchNumber] = useState('');
  const [qty, setQty] = useState(0);
  const [lowStockLimit, setLowStockLimit] = useState(10);
  const [unit, setUnit] = useState('Bottles');
  const [expiry, setExpiry] = useState('');
  const [supplier, setSupplier] = useState('');
  const [notes, setNotes] = useState('');
  const [price, setPrice] = useState(0);
  const [tax, setTax] = useState(0);

  // Calculations
  const totalItems = stock.length;
  const outOfStockCount = stock.filter(item => item.qty === 0).length;
  const lowStockCount = stock.filter(item => item.qty > 0 && item.qty <= item.lowStockLimit).length;
  
  const getComputedStatus = (currentQty, limit, expDateStr) => {
    if (currentQty === 0) return 'Out of Stock';
    if (currentQty <= Math.ceil(limit / 2)) return 'Critical Stock';
    if (currentQty <= limit) return 'Low Stock';
    
    const expDate = new Date(expDateStr);
    const today = new Date();
    const diffMonths = (expDate.getFullYear() - today.getFullYear()) * 12 + (expDate.getMonth() - today.getMonth());
    if (diffMonths <= 2) return 'Expiring Soon';
    
    return 'In Stock';
  };

  const expiringSoonCount = stock.filter(item => getComputedStatus(item.qty, item.lowStockLimit, item.expiry) === 'Expiring Soon').length;

  const fetchInventory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await apiFetch('http://localhost:5000/api/v1/inventory');
      const data = await response.json();
      if (data.status === 'success') {
        const formattedStock = data.data.map(item => ({
          ...item,
          batchNumber: item.sku,
          qty: item.quantity,
          lowStockLimit: item.low_stock_threshold,
          unit: item.unit || 'Pieces',
          price: parseFloat(item.selling_price) || 0,
          expiry: item.expiry_date ? item.expiry_date.split('T')[0] : ''
        }));
        setStock(formattedStock);
      } else {
        toast.error('Failed to load inventory data');
      }
    } catch (err) {
      console.error('Failed to fetch inventory:', err);
      toast.error('Network error loading inventory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleAddStock = async (e) => {
    e.preventDefault();
    if (!name || !category || !batchNumber || !expiry) {
      toast.error('Please fill out all mandatory inventory details.');
      return;
    }

    const payload = {
      sku: batchNumber,
      name,
      category,
      supplier,
      quantity: parseInt(qty) || 0,
      low_stock_threshold: parseInt(lowStockLimit) || 10,
      cost_price: 0,
      selling_price: parseFloat(price) || 0,
      is_taxable: tax > 0,
      expiry_date: expiry
    };

    const token = localStorage.getItem('token');

    try {
      if (editingItem) {
        const response = await apiFetch(`http://localhost:5000/api/v1/inventory/${editingItem.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(payload)
        });
        const data = await response.json();
        
        if (data.status === 'success') {
          toast.success('Stock updated successfully.');
          fetchInventory();
          resetForm();
        } else {
          toast.error(data.message || 'Failed to update stock. Note: Only Admins & Managers can do this.');
        }
      } else {
        const response = await apiFetch('http://localhost:5000/api/v1/inventory', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(payload)
        });
        const data = await response.json();
        
        if (data.status === 'success') {
          toast.success('New medicine added to inventory successfully.');
          fetchInventory();
          resetForm();
        } else {
          toast.error(data.message || 'Failed to add stock. Note: Only Admins & Managers can do this.');
        }
      }
    } catch (err) {
      console.error('API Error:', err);
      toast.error('Network error. Check backend connection.');
    }
  };

  const handleEditClick = (item) => {
    setEditingItem(item);
    setName(item.name);
    setCategory(item.category);
    setBatchNumber(item.batchNumber || '');
    setQty(item.qty);
    setLowStockLimit(item.lowStockLimit || 10);
    setUnit(item.unit);
    setExpiry(item.expiry);
    setSupplier(item.supplier);
    setPrice(item.price || 0);
    setTax(item.tax || 0);
    setNotes('');
    setShowAddForm(true);
  };

  const handleDeleteClick = (itemId) => {
    setDeleteConfirmId(itemId);
  };

  const confirmDelete = async () => {
    if (deleteConfirmId) {
      try {
        const token = localStorage.getItem('token');
        const response = await apiFetch(`http://localhost:5000/api/v1/inventory/${deleteConfirmId}`, {
          method: 'DELETE',
          
        });
        const data = await response.json();
        
        if (data.status === 'success') {
           setDeleteConfirmId(null);
           toast.success('Item removed successfully.');
           fetchInventory();
        } else {
           toast.error(data.message || 'Failed to delete item. Note: Only Admins & Managers can do this.');
           setDeleteConfirmId(null);
        }
      } catch (err) {
        console.error('API Error:', err);
        toast.error('Network error. Check backend.');
      }
    }
  };

  const handleConfirmRefill = async (e) => {
    if (e) e.preventDefault();
    if (!refillModalItem) return;

    const added = parseInt(addQtyInput) || 0;
    if (added <= 0) {
      toast.error('Please enter a quantity greater than 0.');
      return;
    }

    const currentQty = parseInt(refillModalItem.qty) || 0;
    const newQty = currentQty + added;
    const token = localStorage.getItem('token');

    const payload = {
      name: refillModalItem.name,
      category: refillModalItem.category,
      supplier: refillModalItem.supplier,
      quantity: newQty,
      low_stock_threshold: refillModalItem.lowStockLimit || 10,
      cost_price: refillModalItem.cost_price || 0,
      selling_price: refillModalItem.price || 0,
      is_taxable: true,
      expiry_date: newRefillExpiry || refillModalItem.expiry
    };

    try {
      const response = await apiFetch(`http://localhost:5000/api/v1/inventory/${refillModalItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      const data = await response.json();

      if (data.status === 'success') {
        toast.success(`Successfully added +${added} ${refillModalItem.unit || 'Units'} to ${refillModalItem.name}! New Total: ${newQty} Units.`);
        setRefillModalItem(null);
        setAddQtyInput(10);
        fetchInventory();
      } else {
        toast.error(data.message || 'Failed to add stock quantity. Note: Only Admins & Managers can do this.');
      }
    } catch (err) {
      console.error('Refill error:', err);
      toast.error('Network error updating stock.');
    }
  };

  const resetForm = () => {
    setName(''); setCategory(''); setBatchNumber(''); setQty(0); setLowStockLimit(10); setUnit('Bottles'); setExpiry(''); setSupplier(''); setPrice(0); setTax(0); setNotes(''); setEditingItem(null); setShowAddForm(false);
  };

  const getStatusBadge = (status) => {
    const badgeStyle = {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      whiteSpace: 'nowrap',
      fontSize: '0.72rem',
      fontWeight: 700,
      padding: '3px 10px',
      borderRadius: '9999px',
      textTransform: 'none',
      letterSpacing: '0.01em'
    };

    switch (status) {
      case 'Out of Stock':
        return <span style={{ ...badgeStyle, backgroundColor: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }}><AlertTriangle size={12}/> Out of Stock</span>;
      case 'Critical Stock':
        return <span style={{ ...badgeStyle, backgroundColor: '#fff7ed', color: '#ea580c', border: '1px solid #ffedd5' }}><ShieldAlert size={12}/> Critical Stock</span>;
      case 'Low Stock':
        return <span style={{ ...badgeStyle, backgroundColor: '#fefce8', color: '#ca8a04', border: '1px solid #fef08a' }}><Activity size={12}/> Low Stock</span>;
      case 'Expiring Soon':
        return <span style={{ ...badgeStyle, backgroundColor: '#fffbeb', color: '#d97706', border: '1px solid #fde68a' }}><Clock size={12}/> Expiring Soon</span>;
      default:
        return <span style={{ ...badgeStyle, backgroundColor: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0' }}><CheckCircle size={12}/> In Stock</span>;
    }
  };

  const getCategoryBadge = (cat) => {
    const style = {
      display: 'inline-block',
      whiteSpace: 'nowrap',
      fontSize: '0.73rem',
      fontWeight: 600,
      padding: '3px 10px',
      borderRadius: '8px',
      textTransform: 'none',
      letterSpacing: 'normal'
    };

    switch (cat) {
      case 'Medicine':
        return <span style={{ ...style, backgroundColor: '#f3e8ff', color: '#7e22ce', border: '1px solid #e9d5ff' }}>💊 Medicine</span>;
      case 'Accessories & Toys':
        return <span style={{ ...style, backgroundColor: '#eff6ff', color: '#1d4ed8', border: '1px solid #dbeafe' }}>🧸 Accessories & Toys</span>;
      case 'Food & Snacks':
        return <span style={{ ...style, backgroundColor: '#fff7ed', color: '#c2410c', border: '1px solid #ffedd5' }}>🥩 Food & Snacks</span>;
      case 'Service':
        return <span style={{ ...style, backgroundColor: '#ecfeff', color: '#0e7490', border: '1px solid #cffaff' }}>🩺 Service</span>;
      case 'Vitamins & Supplements':
        return <span style={{ ...style, backgroundColor: '#ecfdf5', color: '#047857', border: '1px solid #d1fae5' }}>🧪 Vitamins</span>;
      case 'Hygiene Items':
        return <span style={{ ...style, backgroundColor: '#f0fdfa', color: '#0f766e', border: '1px solid #ccfbf1' }}>🧼 Hygiene</span>;
      default:
        return <span style={{ ...style, backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0' }}>{cat || 'General'}</span>;
    }
  };

  const categoryCounts = {
    'All': stock.length,
    'Medicine': stock.filter(i => i.category === 'Medicine').length,
    'Accessories & Toys': stock.filter(i => i.category === 'Accessories & Toys').length,
    'Food & Snacks': stock.filter(i => i.category === 'Food & Snacks').length,
    'Service': stock.filter(i => i.category === 'Service').length,
    'Vitamins & Supplements': stock.filter(i => i.category === 'Vitamins & Supplements').length,
    'Hygiene Items': stock.filter(i => i.category === 'Hygiene Items').length,
  };

  const activeFilterCount = (categoryFilter ? 1 : 0) + (statusFilter ? 1 : 0) + (minPrice ? 1 : 0) + (maxPrice ? 1 : 0);

  const resetAllFilters = () => {
    setCategoryFilter('');
    setStatusFilter('');
    setMinPrice('');
    setMaxPrice('');
    setSearchQuery('');
  };

  const filteredStock = stock.filter(item => {
    const statusText = getComputedStatus(item.qty, item.lowStockLimit, item.expiry);
    
    const matchesSearch = !searchQuery || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (item.batchNumber && item.batchNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.supplier && item.supplier.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = categoryFilter ? item.category === categoryFilter : true;
    
    let matchesStatus = true;
    if (statusFilter === 'In Stock') matchesStatus = statusText === 'In Stock';
    else if (statusFilter === 'Low Stock') matchesStatus = statusText === 'Low Stock' || statusText === 'Critical Stock';
    else if (statusFilter === 'Out of Stock') matchesStatus = statusText === 'Out of Stock';
    else if (statusFilter === 'Expiring Soon') matchesStatus = statusText === 'Expiring Soon';
    else if (statusFilter === 'Active') matchesStatus = item.status === 'Active' || !item.name.toLowerCase().includes('inactive');
    else if (statusFilter === 'Inactive') matchesStatus = item.status === 'Inactive' || item.name.toLowerCase().includes('inactive');

    const itemPrice = item.price || 0;
    const matchesMinPrice = minPrice !== '' ? itemPrice >= parseFloat(minPrice) : true;
    const matchesMaxPrice = maxPrice !== '' ? itemPrice <= parseFloat(maxPrice) : true;

    return matchesSearch && matchesCategory && matchesStatus && matchesMinPrice && matchesMaxPrice;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Inventory Alerts & Stock Management
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            ERP-level control over pharmaceutical stock, batch tracking, and real-time alerts.
          </p>
        </div>
        {!showAddForm && (
          <button onClick={() => setShowAddForm(true)} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={16} /> Manual Stock Refill
          </button>
        )}
      </div>

      {showAddForm ? (
        /* Manual Stock Refill Flow Modal/Form */
        <div className="card animate-fade-in" style={{ maxWidth: '850px', margin: '0 auto', width: '100%', borderTop: '4px solid var(--primary-teal)' }}>
          <h3 className="font-bold text-lg mb-6" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Package size={20} className="text-primary" /> {editingItem ? 'Adjust Inventory Stock' : 'Manual Stock Refill'}
          </h3>
          <form onSubmit={handleAddStock}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Medicine Name *</label>
                <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Rabies Vaccine" required />
              </div>
              <div className="form-group">
                <label className="form-label">Category *</label>
                <FormSelect
                  value={category}
                  onChange={setCategory}
                  placeholder="-- Choose Category --"
                  required
                  options={[
                    { value: '', label: '-- Choose Category --' },
                    { value: 'Medicine', label: 'Medicine' },
                    { value: 'Vaccine', label: 'Vaccine' },
                    { value: 'Accessories & Toys', label: 'Accessories & Toys' },
                    { value: 'Hygiene Items', label: 'Hygiene Items' },
                    { value: 'Food & Snacks', label: 'Food & Snacks' },
                    { value: 'Vitamins', label: 'Vitamins' },
                    { value: 'Parasiticide', label: 'Parasiticide' },
                    { value: 'Consumables', label: 'Consumables' },
                  ]}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Batch Number *</label>
                <input type="text" className="form-control" value={batchNumber} onChange={(e) => setBatchNumber(e.target.value)} placeholder="e.g. RB-9920K" required />
              </div>
              <div className="form-group">
                <label className="form-label">Expiry Date *</label>
                <input type="date" className="form-control" value={expiry} onChange={(e) => setExpiry(e.target.value)} required />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">New Quantity *</label>
                <input type="number" className="form-control" value={qty} onChange={(e) => setQty(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Low Stock Limit *</label>
                <input type="number" className="form-control" value={lowStockLimit} onChange={(e) => setLowStockLimit(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Measurement Unit</label>
                <FormSelect
                  value={unit}
                  onChange={setUnit}
                  options={[
                    { value: 'Vials', label: 'Vials' },
                    { value: 'Bottles', label: 'Bottles' },
                    { value: 'Strips', label: 'Strips' },
                    { value: 'Ampoules', label: 'Ampoules' },
                    { value: 'Pairs', label: 'Pairs' },
                    { value: 'Bags', label: 'Bags' },
                    { value: 'Items', label: 'Items' },
                    { value: 'Packets', label: 'Packets' },
                  ]}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Unit Price (Rs) *</label>
                <input type="number" className="form-control" value={price} onChange={(e) => setPrice(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Tax (%)</label>
                <input type="number" className="form-control" value={tax} onChange={(e) => setTax(e.target.value)} placeholder="0" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Supplier Brand</label>
                <input type="text" className="form-control" value={supplier} onChange={(e) => setSupplier(e.target.value)} placeholder="e.g. Zoetis Sri Lanka" />
              </div>
              <div className="form-group">
                <label className="form-label">Update Notes</label>
                <input type="text" className="form-control" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g. Monthly refill from primary supplier" />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
              <button type="button" onClick={resetForm} className="btn btn-secondary">Cancel</button>
              <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={16} /> Update Stock
              </button>
            </div>
          </form>
        </div>
      ) : (
        <>
          {/* Top KPI Cards (Interactive Filters) */}
          <div className="kpi-grid-responsive">
            <div 
              className="card" 
              onClick={() => setStatusFilter('')} 
              style={{ 
                display: 'flex', alignItems: 'center', gap: '1rem', 
                borderBottom: '3px solid var(--primary-teal)', cursor: 'pointer',
                outline: statusFilter === '' ? '2px solid var(--primary-teal)' : 'none',
                transition: 'all 0.2s' 
              }}
              title="Click to view all items"
            >
              <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--primary-teal-light)', color: 'var(--primary-teal)' }}><Package size={24} /></div>
              <div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Total Medicines</p>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '2px 0 0 0' }}>{totalItems}</h3>
              </div>
            </div>

            <div 
              className="card" 
              onClick={() => setStatusFilter(statusFilter === 'Low Stock' ? '' : 'Low Stock')} 
              style={{ 
                display: 'flex', alignItems: 'center', gap: '1rem', 
                borderBottom: '3px solid var(--warning)', cursor: 'pointer',
                outline: statusFilter === 'Low Stock' ? '2px solid var(--warning)' : 'none',
                transition: 'all 0.2s' 
              }}
              title="Click to filter low stock items"
            >
              <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--warning-light)', color: 'var(--warning)' }}><Activity size={24} /></div>
              <div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Low Stock Items</p>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '2px 0 0 0' }}>{lowStockCount}</h3>
              </div>
            </div>

            <div 
              className="card" 
              onClick={() => setStatusFilter(statusFilter === 'Expiring Soon' ? '' : 'Expiring Soon')} 
              style={{ 
                display: 'flex', alignItems: 'center', gap: '1rem', 
                borderBottom: '3px solid #f59e0b', cursor: 'pointer',
                outline: statusFilter === 'Expiring Soon' ? '2px solid #f59e0b' : 'none',
                transition: 'all 0.2s' 
              }}
              title="Click to filter expiring soon items"
            >
              <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-lg)', backgroundColor: '#fef3c7', color: '#d97706' }}><Clock size={24} /></div>
              <div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Expiring Soon</p>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '2px 0 0 0' }}>{expiringSoonCount}</h3>
              </div>
            </div>

            <div 
              className="card" 
              onClick={() => setStatusFilter(statusFilter === 'Out of Stock' ? '' : 'Out of Stock')} 
              style={{ 
                display: 'flex', alignItems: 'center', gap: '1rem', 
                borderBottom: '3px solid var(--danger)', cursor: 'pointer',
                outline: statusFilter === 'Out of Stock' ? '2px solid var(--danger)' : 'none',
                transition: 'all 0.2s' 
              }}
              title="Click to filter out of stock items"
            >
              <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--danger-light)', color: 'var(--danger)' }}><AlertTriangle size={24} /></div>
              <div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Out of Stock</p>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '2px 0 0 0' }}>{outOfStockCount}</h3>
              </div>
            </div>
          </div>

          {/* ERP Style Inventory Table */}
          {(() => {
            const renderTableCard = (inPortal = false) => (
              <div 
                className="card animate-fade-in-up" 
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '1.25rem',
                  ...(inPortal ? {
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    width: '100vw',
                    height: '100vh',
                    zIndex: 9999999,
                    borderRadius: 0,
                    overflowY: 'auto',
                    backgroundColor: '#f8fafc',
                    padding: '1.5rem 2.5rem',
                    boxSizing: 'border-box'
                  } : {})
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <h3 className="font-bold text-lg" style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                      <Package size={20} /> Clinic Stock
                    </h3>
                    <span className="badge badge-secondary" style={{ fontSize: '0.75rem' }}>
                      {filteredStock.length} / {totalItems}
                    </span>

                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                      {/* Full Screen Toggle Button */}
                      <button
                        type="button"
                        onClick={() => setIsFullScreen(!isFullScreen)}
                        className={`btn btn-sm ${inPortal ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '5px 10px', fontWeight: 700, fontSize: '0.75rem' }}
                        title={inPortal ? "Exit Fullscreen View" : "View Table in Fullscreen"}
                      >
                        {inPortal ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                        <span>{inPortal ? "Exit Fullscreen" : "Full Screen"}</span>
                      </button>

                      {/* Add New Product Button */}
                      <button
                        type="button"
                        onClick={() => { resetForm(); setShowAddForm(true); if (isFullScreen) setIsFullScreen(false); }}
                        className="btn btn-primary btn-sm"
                        style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '5px 10px', fontWeight: 700, fontSize: '0.75rem' }}
                      >
                        <Plus size={14} />
                        <span>+ Add Product</span>
                      </button>
                    </div>
                  </div>

                  {/* Action & Filter Controls Toolbar */}
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap', width: '100%', maxWidth: '100%', justifyContent: 'flex-start' }}>
                    <div style={{ flex: '1 1 140px', minWidth: '120px' }}>
                      <FormSelect
                        value={categoryFilter}
                        onChange={setCategoryFilter}
                        options={[
                          { value: '', label: 'All Categories' },
                          { value: 'Medicine', label: 'Medicine' },
                          { value: 'Accessories & Toys', label: 'Accessories & Toys' },
                          { value: 'Food & Snacks', label: 'Food & Snacks' },
                          { value: 'Vitamins & Supplements', label: 'Vitamins & Supplements' },
                          { value: 'Hygiene Items', label: 'Hygiene Items' },
                          { value: 'Service', label: 'Service' },
                        ]}
                      />
                    </div>

                    <div style={{ position: 'relative', flex: '2 1 180px', minWidth: '140px' }}>
                      <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Search name/batch..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ paddingLeft: '2.25rem', backgroundColor: '#fff', fontSize: '0.85rem' }}
                      />
                    </div>

                    {/* Main Filter Toggle Button */}
                    <button
                      type="button"
                      onClick={() => setShowFilterDrawer(!showFilterDrawer)}
                      className={`btn ${showFilterDrawer || activeFilterCount > 0 ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap', padding: '6px 12px', fontSize: '0.85rem' }}
                    >
                      <SlidersHorizontal size={14} />
                      <span>Filter</span>
                      {activeFilterCount > 0 && (
                        <span style={{
                          backgroundColor: showFilterDrawer || activeFilterCount > 0 ? '#fff' : 'var(--primary-teal)',
                          color: showFilterDrawer || activeFilterCount > 0 ? 'var(--primary-teal)' : '#fff',
                          borderRadius: '9999px',
                          padding: '1px 6px',
                          fontSize: '0.72rem',
                          fontWeight: 800
                        }}>
                          {activeFilterCount}
                        </span>
                      )}
                    </button>
                  </div>
                </div>

                {/* Primary Category Division Navigation Tabs (Scrollable on Mobile) */}
                <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', WebkitOverflowScrolling: 'touch', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem', paddingTop: '0.25rem', maxWidth: '100%' }}>
                  {[
                    { id: '', label: 'All Items', icon: '📦', count: categoryCounts['All'] },
                    { id: 'Medicine', label: 'Medicine', icon: '💊', count: categoryCounts['Medicine'] },
                    { id: 'Accessories & Toys', label: 'Accessories & Toys', icon: '🧸', count: categoryCounts['Accessories & Toys'] },
                    { id: 'Food & Snacks', label: 'Food & Snacks', icon: '🥩', count: categoryCounts['Food & Snacks'] },
                    { id: 'Service', label: 'Services', icon: '🩺', count: categoryCounts['Service'] },
                    { id: 'Vitamins & Supplements', label: 'Vitamins', icon: '🧪', count: categoryCounts['Vitamins & Supplements'] },
                    { id: 'Hygiene Items', label: 'Hygiene Items', icon: '🧼', count: categoryCounts['Hygiene Items'] },
                  ].map(cat => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategoryFilter(categoryFilter === cat.id ? '' : cat.id)}
                      className={`btn ${categoryFilter === cat.id ? 'btn-primary' : 'btn-secondary'}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '0.8rem',
                        fontWeight: categoryFilter === cat.id ? 700 : 500,
                        padding: '6px 14px',
                        borderRadius: 'var(--radius-lg)',
                        transition: 'all 0.15s'
                      }}
                    >
                      <span>{cat.icon} {cat.label}</span>
                      <span style={{
                        backgroundColor: categoryFilter === cat.id ? '#fff' : 'var(--primary-teal-light)',
                        color: 'var(--primary-teal)',
                        borderRadius: '9999px',
                        padding: '1px 7px',
                        fontSize: '0.72rem',
                        fontWeight: 800
                      }}>
                        {cat.count}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Quick Status Filter Pills Row (Scrollable on Mobile) */}
                <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', WebkitOverflowScrolling: 'touch', alignItems: 'center', paddingTop: '0.25rem', maxWidth: '100%' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginRight: '4px' }}>Quick Filter:</span>
                  {[
                    { id: '', label: 'All Items' },
                    { id: 'In Stock', label: 'In Stock' },
                    { id: 'Low Stock', label: 'Low Stock' },
                    { id: 'Out of Stock', label: 'Out of Stock' },
                    { id: 'Expiring Soon', label: 'Expiring Soon' },
                    { id: 'Active', label: 'Active Only' },
                    { id: 'Inactive', label: 'Inactive Only' },
                  ].map(tab => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setStatusFilter(statusFilter === tab.id ? '' : tab.id)}
                      className={`btn btn-sm ${statusFilter === tab.id ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ padding: '4px 10px', fontSize: '0.75rem', borderRadius: 'var(--radius-full)' }}
                    >
                      {tab.label}
                    </button>
                  ))}

                  {activeFilterCount > 0 && (
                    <button
                      type="button"
                      onClick={resetAllFilters}
                      className="btn btn-sm"
                      style={{ border: '1px border var(--border)', color: 'var(--danger)', background: '#fef2f2', padding: '4px 10px', fontSize: '0.75rem', borderRadius: 'var(--radius-full)', marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <RotateCcw size={12} /> Clear Filters
                    </button>
                  )}
                </div>

                {/* Advanced Filter Drawer */}
                {showFilterDrawer && (
                  <div 
                    className="animate-fade-in-up"
                    style={{
                      backgroundColor: '#fff',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-md)',
                      padding: '1.25rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1rem',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h4 style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Filter size={16} /> Advanced Inventory Search Filters
                      </h4>
                      <button type="button" onClick={() => setShowFilterDrawer(false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)' }}>
                        <X size={18} />
                      </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Stock Availability Status</label>
                        <FormSelect
                          value={statusFilter}
                          onChange={setStatusFilter}
                          options={[
                            { value: '', label: 'All Statuses' },
                            { value: 'In Stock', label: 'In Stock' },
                            { value: 'Low Stock', label: 'Low Stock / Critical' },
                            { value: 'Out of Stock', label: 'Out of Stock' },
                            { value: 'Expiring Soon', label: 'Expiring Soon' },
                            { value: 'Active', label: 'Active Items' },
                            { value: 'Inactive', label: 'Inactive / Non-Selling' },
                          ]}
                        />
                      </div>

                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Minimum Price (Rs)</label>
                        <input 
                          type="number" 
                          className="form-control" 
                          placeholder="e.g. 100"
                          value={minPrice}
                          onChange={(e) => setMinPrice(e.target.value)}
                        />
                      </div>

                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Maximum Price (Rs)</label>
                        <input 
                          type="number" 
                          className="form-control" 
                          placeholder="e.g. 5000"
                          value={maxPrice}
                          onChange={(e) => setMaxPrice(e.target.value)}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border)' }}>
                      <button type="button" onClick={resetAllFilters} className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <RotateCcw size={14} /> Reset Filters
                      </button>
                      <button type="button" onClick={() => setShowFilterDrawer(false)} className="btn btn-primary btn-sm">
                        Apply Filters ({filteredStock.length} Results)
                      </button>
                    </div>
                  </div>
                )}

                {/* Table Responsive Scroll View */}
                <div className="table-responsive" style={{ maxHeight: inPortal ? 'calc(100vh - 240px)' : '550px', overflowY: 'auto', overflowX: 'auto' }}>
                  <table className="custom-table" style={{ width: '100%', minWidth: '950px', borderCollapse: 'separate', borderSpacing: '0 4px' }}>
                    <thead style={{ position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 10 }}>
                      <tr>
                        <th>Medicine Name</th>
                        <th>Category</th>
                        <th>Batch No.</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Expiry Date</th>
                        <th>Supplier</th>
                        <th>Status</th>
                        <th style={{ textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan="9" style={{ textAlign: 'center', padding: '3rem' }}>
                            <Loader size={32} className="animate-spin text-primary" style={{ margin: '0 auto', color: 'var(--primary-teal)' }} />
                            <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Loading inventory data...</p>
                          </td>
                        </tr>
                      ) : filteredStock.length === 0 ? (
                        <tr>
                          <td colSpan="9" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                            No items found matching your criteria.
                          </td>
                        </tr>
                      ) : filteredStock.map((item) => {
                        const statusText = getComputedStatus(item.qty, item.lowStockLimit, item.expiry);
                        const isAlert = statusText === 'Out of Stock' || statusText === 'Low Stock' || statusText === 'Critical Stock';
                        return (
                          <tr key={item.id} style={{ 
                            backgroundColor: statusText === 'Out of Stock' ? 'rgba(239, 68, 68, 0.05)' : statusText === 'Critical Stock' ? 'rgba(234, 88, 12, 0.05)' : statusText === 'Low Stock' ? '#fefce8' : (statusText === 'Expiring Soon' ? '#fffbeb' : '#fff'),
                            transition: 'all 0.2s'
                          }}>
                            <td><span className="font-bold">{item.name}</span></td>
                            <td>{getCategoryBadge(item.category)}</td>
                            <td style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{item.batchNumber}</td>
                            <td className="font-bold text-lg" style={{ color: isAlert ? 'var(--danger)' : 'var(--text-primary)' }}>{item.qty} <span style={{ fontSize: '0.75rem', fontWeight: 500 }}>{item.unit}</span></td>
                            <td className="font-bold font-mono" style={{ color: 'var(--primary-teal)' }}>{formatCurrency(item.price)}</td>
                            <td style={{ color: statusText === 'Expiring Soon' ? '#d97706' : 'var(--text-primary)', fontWeight: statusText === 'Expiring Soon' ? 'bold' : 'normal' }}>{item.expiry}</td>
                            <td style={{ fontSize: '0.8rem' }}>{item.supplier}</td>
                            <td>{getStatusBadge(statusText)}</td>
                            <td style={{ textAlign: 'right' }}>
                              <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                                <button 
                                  onClick={() => {
                                    setRefillModalItem(item);
                                    setAddQtyInput(10);
                                    setNewRefillExpiry(item.expiry || '');
                                    setRefillNotes('');
                                  }} 
                                  className="btn btn-secondary btn-sm" 
                                  style={{ padding: '6px', backgroundColor: 'var(--primary-teal-light)', border: '1px solid var(--primary-teal-light)' }} 
                                  title="Add Quantity / Refill Stock"
                                >
                                  <Plus size={14} style={{ color: 'var(--primary-teal)' }} />
                                </button>
                                <button onClick={() => handleEditClick(item)} className="btn btn-secondary btn-sm" style={{ padding: '6px' }} title="Adjust Stock">
                                  <Edit3 size={14} style={{ color: 'var(--secondary-blue)' }} />
                                </button>
                                <button onClick={() => handleDeleteClick(item.id)} className="btn btn-secondary btn-sm" style={{ padding: '6px' }} title="Remove Item">
                                  <Trash2 size={14} style={{ color: 'var(--danger)' }} />
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

            if (isFullScreen) {
              return (
                <>
                  <div className="card" style={{ padding: '2.5rem', textAlign: 'center', backgroundColor: '#f1f5f9', borderRadius: 'var(--radius-lg)' }}>
                    <p style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '1.1rem', margin: '0 0 0.5rem 0' }}>
                      📺 Inventory Table is currently active in Full Screen Mode
                    </p>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: '0 0 1rem 0' }}>
                      Table is displayed edge-to-edge covering the full browser window.
                    </p>
                    <button onClick={() => setIsFullScreen(false)} className="btn btn-primary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <Minimize2 size={16} /> Exit Full Screen
                    </button>
                  </div>
                  {createPortal(renderTableCard(true), document.body)}
                </>
              );
            }

            return renderTableCard(false);
          })()}
        </>
      )}

      {/* Custom Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', backdropFilter: 'blur(4px)' }}>
          <div className="animate-fade-in-up" style={{ backgroundColor: '#fff', borderRadius: 'var(--radius-xl)', padding: '2rem', width: '100%', maxWidth: '400px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1rem' }}>
              <div style={{ padding: '1rem', backgroundColor: 'var(--danger-light)', borderRadius: '50%', color: 'var(--danger)' }}>
                <AlertTriangle size={32} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 0.5rem 0' }}>Remove Item</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5' }}>
                  Are you sure you want to delete this inventory item? This action cannot be undone.
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', width: '100%', marginTop: '1rem' }}>
                <button 
                  onClick={() => setDeleteConfirmId(null)} 
                  className="btn btn-secondary" 
                  style={{ flex: 1, padding: '0.75rem', fontWeight: 600 }}
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDelete} 
                  className="btn" 
                  style={{ flex: 1, padding: '0.75rem', backgroundColor: 'var(--danger)', color: '#fff', fontWeight: 600, border: 'none' }}
                >
                  Yes, Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dedicated Stock Refill / Quantity Addition Modal */}
      {refillModalItem && createPortal(
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.65)', zIndex: 999999999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', backdropFilter: 'blur(6px)' }}>
          <div className="animate-fade-in-up" style={{ backgroundColor: '#fff', borderRadius: 'var(--radius-xl)', padding: '2rem', width: '100%', maxWidth: '540px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)', borderTop: '5px solid var(--primary-teal)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
              <div>
                <div style={{ marginBottom: '4px' }}>{getCategoryBadge(refillModalItem.category)}</div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                  Add Stock Quantity
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
                  {refillModalItem.name} <span style={{ fontFamily: 'monospace', color: 'var(--text-muted)' }}>(Batch: {refillModalItem.batchNumber || 'N/A'})</span>
                </p>
              </div>
              <button onClick={() => setRefillModalItem(null)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            {/* Inventory Item Quick Summary Box */}
            <div style={{ backgroundColor: '#f8fafc', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', display: 'block' }}>Current Price</span>
                <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--primary-teal)' }}>{formatCurrency(refillModalItem.price)}</span>
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', display: 'block' }}>Supplier</span>
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>{refillModalItem.supplier || 'Aldo Pet'}</span>
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', display: 'block' }}>Expiry Date</span>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>{refillModalItem.expiry || 'Not set'}</span>
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', display: 'block' }}>Current Available Stock</span>
                <span style={{ fontSize: '1rem', fontWeight: 800, color: refillModalItem.qty === 0 ? 'var(--danger)' : 'var(--text-primary)' }}>
                  {refillModalItem.qty} <span style={{ fontSize: '0.75rem', fontWeight: 500 }}>{refillModalItem.unit || 'Units'}</span>
                </span>
              </div>
            </div>

            <form onSubmit={handleConfirmRefill} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Quantity to Add Input */}
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                  Quantity to Add ({refillModalItem.unit || 'Units'}) *
                </label>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input 
                    type="number" 
                    className="form-control" 
                    min="1" 
                    value={addQtyInput} 
                    onChange={(e) => setAddQtyInput(e.target.value)} 
                    required 
                    style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-teal)', padding: '0.6rem 1rem' }}
                  />
                </div>
              </div>

              {/* Live Calculation Preview Box */}
              <div style={{ backgroundColor: 'var(--primary-teal-light)', border: '1.5px dashed var(--primary-teal)', borderRadius: 'var(--radius-md)', padding: '0.85rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--primary-teal)', textTransform: 'uppercase' }}>NEW TOTAL STOCK PREVIEW</span>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Current: <strong>{refillModalItem.qty}</strong> + Adding: <strong style={{ color: 'var(--success)' }}>+{parseInt(addQtyInput) || 0}</strong>
                  </div>
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--primary-teal)' }}>
                  {(parseInt(refillModalItem.qty) || 0) + (parseInt(addQtyInput) || 0)} <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{refillModalItem.unit || 'Units'}</span>
                </div>
              </div>

              {/* Optional Expiry Update */}
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Updated Expiry Date (Optional)</label>
                <input 
                  type="date" 
                  className="form-control" 
                  value={newRefillExpiry} 
                  onChange={(e) => setNewRefillExpiry(e.target.value)} 
                />
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                <button type="button" onClick={() => setRefillModalItem(null)} className="btn btn-secondary" style={{ flex: 1, fontWeight: 600 }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1.5, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <Plus size={18} /> Confirm Stock Addition
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
}
