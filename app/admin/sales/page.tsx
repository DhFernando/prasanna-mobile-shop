/**
 * Sales Management Page
 * Track and manage all sales with filters and printable invoices
 */

'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Modal, ConfirmDialog, FormInput } from '@/components/admin';
import { Icon } from '@/components/atoms';
import { Sale, SaleFormData } from '@/lib/types';

const ITEMS_PER_PAGE = 15;

const initialFormData: SaleFormData = {
  itemName: '',
  quantity: 1,
  unitPrice: 0,
  customerName: '',
  customerPhone: '',
  notes: '',
  saleDate: new Date().toISOString().split('T')[0],
};

export default function SalesPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Summary stats
  const [summary, setSummary] = useState({ totalSales: 0, totalRevenue: 0, totalItems: 0 });
  
  // Pagination & Filters
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isBillModalOpen, setIsBillModalOpen] = useState(false);
  const [editingSale, setEditingSale] = useState<Sale | null>(null);
  const [deletingSale, setDeletingSale] = useState<Sale | null>(null);
  const [billSale, setBillSale] = useState<Sale | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<SaleFormData>(initialFormData);
  
  // Print ref
  const printRef = useRef<HTMLDivElement>(null);

  // Fetch sales
  const fetchSales = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: ITEMS_PER_PAGE.toString(),
      });
      
      if (searchQuery) params.append('search', searchQuery);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const res = await fetch(`/api/sales?${params}`);
      const data = await res.json();
      
      setSales(data.data || []);
      setTotalPages(data.pagination?.totalPages || 1);
      setSummary(data.summary || { totalSales: 0, totalRevenue: 0, totalItems: 0 });
    } catch (error) {
      console.error('Error fetching sales:', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchQuery, startDate, endDate]);

  useEffect(() => {
    fetchSales();
  }, [fetchSales]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, startDate, endDate]);

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (parseFloat(value) || 0) : value,
    }));
  };

  // Open add modal
  const openAddModal = () => {
    setEditingSale(null);
    setFormData({
      ...initialFormData,
      saleDate: new Date().toISOString().split('T')[0],
    });
    setIsModalOpen(true);
  };

  // Open edit modal
  const openEditModal = (sale: Sale) => {
    setEditingSale(sale);
    setFormData({
      itemName: sale.itemName,
      quantity: sale.quantity,
      unitPrice: sale.unitPrice,
      customerName: sale.customerName || '',
      customerPhone: sale.customerPhone || '',
      notes: sale.notes || '',
      saleDate: new Date(sale.saleDate).toISOString().split('T')[0],
    });
    setIsModalOpen(true);
  };

  // Open bill modal
  const openBillModal = (sale: Sale) => {
    setBillSale(sale);
    setIsBillModalOpen(true);
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = editingSale 
        ? `/api/sales/${editingSale.id}` 
        : '/api/sales';
      const method = editingSale ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          saleDate: new Date(formData.saleDate).toISOString(),
        }),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchSales();
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to save sale');
      }
    } catch (error) {
      console.error('Error saving sale:', error);
      alert('An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!deletingSale) return;
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/sales/${deletingSale.id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setIsDeleteDialogOpen(false);
        setDeletingSale(null);
        fetchSales();
      }
    } catch (error) {
      console.error('Error deleting sale:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Print bill
  const handlePrint = () => {
    const printContent = printRef.current;
    if (!printContent) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice - Prasanna Mobile Center</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 20px; max-width: 400px; margin: 0 auto; }
            .header { text-align: center; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 2px dashed #ccc; }
            .header h1 { font-size: 18px; color: #333; margin-bottom: 5px; }
            .header p { font-size: 11px; color: #666; line-height: 1.4; }
            .details { margin-bottom: 15px; }
            .details-row { display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 5px; }
            .details-row span:first-child { color: #666; }
            .items { border-top: 1px dashed #ccc; border-bottom: 1px dashed #ccc; padding: 15px 0; margin-bottom: 15px; }
            .item { margin-bottom: 10px; }
            .item-name { font-weight: 600; font-size: 13px; color: #333; }
            .item-details { font-size: 11px; color: #666; margin-top: 3px; }
            .totals { margin-bottom: 20px; }
            .totals-row { display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 5px; }
            .totals-row.total { font-size: 16px; font-weight: 700; color: #333; border-top: 1px solid #333; padding-top: 10px; margin-top: 10px; }
            .footer { text-align: center; font-size: 11px; color: #666; padding-top: 15px; border-top: 2px dashed #ccc; }
            .footer p { margin-bottom: 3px; }
            @media print { body { padding: 0; } }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  // Format date
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-LK', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Format time
  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString('en-LK', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Calculate total
  const calculateTotal = () => formData.quantity * formData.unitPrice;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-stone-900 mb-1">
            Sales
          </h1>
          <p className="text-stone-500">
            Track and manage your sales records
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="
            inline-flex items-center gap-2
            px-5 py-2.5
            bg-gradient-to-r from-teal-600 to-teal-500
            text-white font-semibold rounded-xl
            shadow-lg shadow-teal-500/25
            hover:from-teal-500 hover:to-teal-400
            transition-all
          "
        >
          <Icon name="zap" size={18} />
          Record Sale
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-stone-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center">
              <Icon name="tag" size={20} className="text-teal-600" />
            </div>
            <div>
              <p className="text-sm text-stone-500">Total Sales</p>
              <p className="text-xl font-bold text-stone-900">{summary.totalSales}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-stone-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
              <Icon name="zap" size={20} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-stone-500">Total Revenue</p>
              <p className="text-xl font-bold text-stone-900">Rs. {summary.totalRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-stone-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <Icon name="smartphone" size={20} className="text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-stone-500">Items Sold</p>
              <p className="text-xl font-bold text-stone-900">{summary.totalItems}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-stone-200 p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Icon name="search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search by item or customer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
          </div>

          {/* Start Date */}
          <div>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              placeholder="Start Date"
            />
          </div>

          {/* End Date */}
          <div>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              placeholder="End Date"
            />
          </div>

          {/* Clear Filters */}
          {(searchQuery || startDate || endDate) && (
            <button
              onClick={() => {
                setSearchQuery('');
                setStartDate('');
                setEndDate('');
              }}
              className="px-4 py-2.5 text-stone-600 hover:text-stone-800 border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Sales Table */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-stone-500">Loading sales...</p>
          </div>
        ) : sales.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-stone-100 flex items-center justify-center">
              <Icon name="tag" size={28} className="text-stone-400" />
            </div>
            <p className="text-stone-600 font-medium mb-1">No sales found</p>
            <p className="text-sm text-stone-500">
              {searchQuery || startDate || endDate 
                ? 'Try adjusting your filters' 
                : 'Record your first sale!'}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-stone-50 border-b border-stone-200">
                  <tr>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-stone-500 uppercase tracking-wider">Date</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-stone-500 uppercase tracking-wider">Item</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-stone-500 uppercase tracking-wider">Customer</th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-stone-500 uppercase tracking-wider">Qty</th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-stone-500 uppercase tracking-wider">Unit Price</th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-stone-500 uppercase tracking-wider">Total</th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-stone-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {sales.map((sale) => (
                    <tr key={sale.id} className="hover:bg-stone-50 transition-colors">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-stone-900">{formatDate(sale.saleDate)}</p>
                          <p className="text-xs text-stone-500">{formatTime(sale.saleDate)}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-medium text-stone-900">{sale.itemName}</p>
                        {sale.notes && (
                          <p className="text-xs text-stone-500 line-clamp-1">{sale.notes}</p>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {sale.customerName ? (
                          <div>
                            <p className="text-stone-700">{sale.customerName}</p>
                            {sale.customerPhone && (
                              <p className="text-xs text-stone-500">{sale.customerPhone}</p>
                            )}
                          </div>
                        ) : (
                          <span className="text-stone-400">Walk-in</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="font-medium text-stone-900">{sale.quantity}</span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="text-stone-600">Rs. {sale.unitPrice.toLocaleString()}</span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="font-bold text-teal-600">Rs. {sale.totalPrice.toLocaleString()}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openBillModal(sale)}
                            className="p-2 text-stone-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                            title="Print Bill"
                          >
                            <Icon name="tag" size={16} />
                          </button>
                          <button
                            onClick={() => openEditModal(sale)}
                            className="p-2 text-stone-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Icon name="tools" size={16} />
                          </button>
                          <button
                            onClick={() => {
                              setDeletingSale(sale);
                              setIsDeleteDialogOpen(true);
                            }}
                            className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Icon name="close" size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-stone-200">
                <p className="text-sm text-stone-500">
                  Page {currentPage} of {totalPages}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 text-sm text-stone-600 bg-stone-100 hover:bg-stone-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 text-sm text-stone-600 bg-stone-100 hover:bg-stone-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Add/Edit Sale Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSale ? 'Edit Sale' : 'Record New Sale'}
        size="lg"
      >
        <form onSubmit={handleSubmit}>
          <FormInput
            label="Item Name"
            name="itemName"
            value={formData.itemName}
            onChange={handleInputChange}
            placeholder="e.g. iPhone 15 Pro Case"
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Quantity"
              name="quantity"
              type="number"
              value={formData.quantity}
              onChange={handleInputChange}
              min={1}
              required
            />

            <FormInput
              label="Unit Price (Rs.)"
              name="unitPrice"
              type="number"
              value={formData.unitPrice}
              onChange={handleInputChange}
              min={0}
              required
            />
          </div>

          {/* Total Display */}
          <div className="bg-teal-50 border border-teal-200 rounded-lg p-3 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-teal-700 font-medium">Total Amount:</span>
              <span className="text-xl font-bold text-teal-700">Rs. {calculateTotal().toLocaleString()}</span>
            </div>
          </div>

          <FormInput
            label="Sale Date"
            name="saleDate"
            type="date"
            value={formData.saleDate}
            onChange={handleInputChange}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Customer Name (optional)"
              name="customerName"
              value={formData.customerName}
              onChange={handleInputChange}
              placeholder="Leave empty for walk-in"
            />

            <FormInput
              label="Phone (optional)"
              name="customerPhone"
              value={formData.customerPhone}
              onChange={handleInputChange}
              placeholder="e.g. 077 123 4567"
            />
          </div>

          <FormInput
            label="Notes (optional)"
            name="notes"
            type="textarea"
            value={formData.notes}
            onChange={handleInputChange}
            placeholder="Any additional notes..."
            rows={2}
          />

          <div className="flex gap-3 mt-6 pt-4 border-t border-stone-200">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 py-3 px-4 rounded-xl font-semibold bg-stone-100 text-stone-700 hover:bg-stone-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 px-4 rounded-xl font-semibold bg-gradient-to-r from-teal-600 to-teal-500 text-white hover:from-teal-500 hover:to-teal-400 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Icon name="check" size={18} />
                  {editingSale ? 'Update Sale' : 'Record Sale'}
                </>
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* Bill/Invoice Modal */}
      <Modal
        isOpen={isBillModalOpen}
        onClose={() => {
          setIsBillModalOpen(false);
          setBillSale(null);
        }}
        title="Invoice"
        size="md"
      >
        {billSale && (
          <>
            {/* Printable Invoice Content */}
            <div ref={printRef} className="bg-white">
              <div className="header">
                <h1>Prasanna Mobile Center</h1>
                <p>No 16, Old Negombo Rd, Ja-Ela, Sri Lanka</p>
                <p>Phone: 072 290 2299</p>
              </div>

              <div className="details">
                <div className="details-row">
                  <span>Invoice #:</span>
                  <span>{billSale.id.toUpperCase()}</span>
                </div>
                <div className="details-row">
                  <span>Date:</span>
                  <span>{formatDate(billSale.saleDate)} {formatTime(billSale.saleDate)}</span>
                </div>
                {billSale.customerName && (
                  <div className="details-row">
                    <span>Customer:</span>
                    <span>{billSale.customerName}</span>
                  </div>
                )}
                {billSale.customerPhone && (
                  <div className="details-row">
                    <span>Phone:</span>
                    <span>{billSale.customerPhone}</span>
                  </div>
                )}
              </div>

              <div className="items">
                <div className="item">
                  <div className="item-name">{billSale.itemName}</div>
                  <div className="item-details">
                    {billSale.quantity} x Rs. {billSale.unitPrice.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="totals">
                <div className="totals-row">
                  <span>Subtotal:</span>
                  <span>Rs. {billSale.totalPrice.toLocaleString()}</span>
                </div>
                <div className="totals-row total">
                  <span>Total:</span>
                  <span>Rs. {billSale.totalPrice.toLocaleString()}</span>
                </div>
              </div>

              <div className="footer">
                <p>Thank you for your purchase!</p>
                <p>Visit us again</p>
              </div>
            </div>

            {/* Preview (styled version) */}
            <div className="mt-6 p-4 bg-stone-50 rounded-lg border border-stone-200">
              <div className="text-center mb-4 pb-4 border-b-2 border-dashed border-stone-300">
                <h3 className="font-bold text-lg text-stone-900">Prasanna Mobile Center</h3>
                <p className="text-xs text-stone-500">No 16, Old Negombo Rd, Ja-Ela, Sri Lanka</p>
                <p className="text-xs text-stone-500">Phone: 072 290 2299</p>
              </div>

              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-stone-500">Invoice #:</span>
                  <span className="font-mono text-stone-700">{billSale.id.toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Date:</span>
                  <span className="text-stone-700">{formatDate(billSale.saleDate)}</span>
                </div>
                {billSale.customerName && (
                  <div className="flex justify-between">
                    <span className="text-stone-500">Customer:</span>
                    <span className="text-stone-700">{billSale.customerName}</span>
                  </div>
                )}
              </div>

              <div className="py-4 border-t border-b border-dashed border-stone-300 mb-4">
                <p className="font-semibold text-stone-900">{billSale.itemName}</p>
                <p className="text-sm text-stone-500">{billSale.quantity} x Rs. {billSale.unitPrice.toLocaleString()}</p>
              </div>

              <div className="flex justify-between items-center text-lg font-bold text-stone-900">
                <span>Total:</span>
                <span className="text-teal-600">Rs. {billSale.totalPrice.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setIsBillModalOpen(false);
                  setBillSale(null);
                }}
                className="flex-1 py-3 px-4 rounded-xl font-semibold bg-stone-100 text-stone-700 hover:bg-stone-200 transition-colors"
              >
                Close
              </button>
              <button
                onClick={handlePrint}
                className="flex-1 py-3 px-4 rounded-xl font-semibold bg-gradient-to-r from-purple-600 to-purple-500 text-white hover:from-purple-500 hover:to-purple-400 transition-all flex items-center justify-center gap-2"
              >
                <Icon name="tag" size={18} />
                Print Invoice
              </button>
            </div>
          </>
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setDeletingSale(null);
        }}
        onConfirm={handleDelete}
        title="Delete Sale"
        message={`Are you sure you want to delete this sale record for "${deletingSale?.itemName}"? This action cannot be undone.`}
        confirmText="Delete"
        confirmVariant="danger"
        isLoading={isSubmitting}
      />
    </div>
  );
}

