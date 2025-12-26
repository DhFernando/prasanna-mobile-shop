/**
 * Announcements Management Page
 * CRUD operations for announcements
 * Supports dark/light mode
 */

'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Modal, ConfirmDialog, DataTable, FormInput, FormCheckbox } from '@/components/admin';
import { Icon } from '@/components/atoms';
import { Announcement, AnnouncementFormData } from '@/lib/types';
import { useTheme } from '@/lib/theme';

const initialFormData: AnnouncementFormData = {
  title: '',
  message: '',
  type: 'info',
  active: true,
  expiresAt: null,
};

export default function AnnouncementsPage() {
  const { isDark, currentTheme } = useTheme();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [deletingAnnouncement, setDeletingAnnouncement] = useState<Announcement | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<AnnouncementFormData>(initialFormData);

  // Fetch announcements
  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/announcements');
      const data = await res.json();
      setAnnouncements(data.data || []);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle checkbox change
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  // Open add modal
  const openAddModal = () => {
    setEditingAnnouncement(null);
    setFormData(initialFormData);
    setIsModalOpen(true);
  };

  // Open edit modal
  const openEditModal = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setFormData({
      title: announcement.title,
      message: announcement.message,
      type: announcement.type,
      active: announcement.active,
      expiresAt: announcement.expiresAt 
        ? announcement.expiresAt.split('T')[0] 
        : null,
    });
    setIsModalOpen(true);
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = editingAnnouncement 
        ? `/api/announcements/${editingAnnouncement.id}` 
        : '/api/announcements';
      const method = editingAnnouncement ? 'PUT' : 'POST';

      // Format expires date if provided
      const submitData = {
        ...formData,
        expiresAt: formData.expiresAt 
          ? new Date(formData.expiresAt).toISOString() 
          : null,
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchData();
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to save announcement');
      }
    } catch (error) {
      console.error('Error saving announcement:', error);
      alert('An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!deletingAnnouncement) return;
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/announcements/${deletingAnnouncement.id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setIsDeleteDialogOpen(false);
        setDeletingAnnouncement(null);
        fetchData();
      }
    } catch (error) {
      console.error('Error deleting announcement:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle active status
  const handleToggleActive = async (announcement: Announcement) => {
    try {
      await fetch(`/api/announcements/${announcement.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !announcement.active }),
      });
      fetchData();
    } catch (error) {
      console.error('Error toggling active:', error);
    }
  };

  // Get type badge styles
  const getTypeBadge = (type: string) => {
    const lightStyles = {
      info: 'bg-blue-100 text-blue-700',
      promo: 'bg-purple-100 text-purple-700',
      warning: 'bg-amber-100 text-amber-700',
      success: 'bg-emerald-100 text-emerald-700',
    };
    const darkStyles = {
      info: 'bg-blue-500/20 text-blue-400',
      promo: 'bg-purple-500/20 text-purple-400',
      warning: 'bg-amber-500/20 text-amber-400',
      success: 'bg-emerald-500/20 text-emerald-400',
    };
    const styles = isDark ? darkStyles : lightStyles;
    return styles[type as keyof typeof styles] || styles.info;
  };

  // Table columns
  const columns = [
    {
      key: 'title',
      header: 'Announcement',
      render: (ann: Announcement) => (
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${currentTheme.primaryHex}20` }}
          >
            <Icon name="sparkles" size={18} style={{ color: currentTheme.primaryHex }} />
          </div>
          <div className="min-w-0">
            <p className={`font-medium truncate ${isDark ? 'text-white' : 'text-stone-900'}`}>{ann.title}</p>
            <p className={`text-xs truncate max-w-xs ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>{ann.message}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      render: (ann: Announcement) => (
        <span className={`
          px-2.5 py-1 rounded-full text-xs font-medium capitalize
          ${getTypeBadge(ann.type)}
        `}>
          {ann.type}
        </span>
      ),
    },
    {
      key: 'active',
      header: 'Status',
      render: (ann: Announcement) => (
        <span className={`
          inline-flex items-center gap-1.5
          px-2.5 py-1 rounded-full text-xs font-medium
          ${ann.active 
            ? isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-700' 
            : isDark ? 'bg-stone-700 text-stone-400' : 'bg-stone-100 text-stone-500'
          }
        `}>
          <span className={`w-1.5 h-1.5 rounded-full ${ann.active ? 'bg-emerald-500' : isDark ? 'bg-stone-500' : 'bg-stone-400'}`} />
          {ann.active ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'expiresAt',
      header: 'Expires',
      render: (ann: Announcement) => (
        <span className={`text-sm ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
          {ann.expiresAt 
            ? new Date(ann.expiresAt).toLocaleDateString() 
            : 'Never'
          }
        </span>
      ),
    },
  ];

  const announcementTypes = [
    { value: 'info', label: 'Information' },
    { value: 'promo', label: 'Promotion' },
    { value: 'warning', label: 'Warning' },
    { value: 'success', label: 'Success' },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className={`font-display text-2xl sm:text-3xl font-bold mb-1 ${isDark ? 'text-white' : 'text-stone-900'}`}>
            Announcements
          </h1>
          <p className={isDark ? 'text-stone-400' : 'text-stone-500'}>
            Create announcements to display on your website
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-white font-semibold rounded-xl shadow-lg transition-all hover:opacity-90"
          style={{ 
            background: `linear-gradient(135deg, ${currentTheme.primaryHex}, ${currentTheme.primaryDark})`,
            boxShadow: `0 4px 14px ${currentTheme.primaryHex}40`
          }}
        >
          <Icon name="sparkles" size={18} />
          Add Announcement
        </button>
      </div>

      {/* Announcements Table */}
      <DataTable
        data={announcements}
        columns={columns}
        getRowId={(a) => a.id}
        onEdit={openEditModal}
        onDelete={(a) => {
          setDeletingAnnouncement(a);
          setIsDeleteDialogOpen(true);
        }}
        onTogglePublish={handleToggleActive}
        isLoading={isLoading}
        emptyMessage="No announcements yet. Create your first announcement!"
      />

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingAnnouncement ? 'Edit Announcement' : 'New Announcement'}
        size="lg"
      >
        <form onSubmit={handleSubmit}>
          <FormInput
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="e.g. Christmas Sale - 30% Off!"
            required
          />

          <FormInput
            label="Message"
            name="message"
            type="textarea"
            value={formData.message}
            onChange={handleInputChange}
            placeholder="Enter the full announcement message..."
            rows={4}
            required
          />

          <FormInput
            label="Type"
            name="type"
            type="select"
            value={formData.type}
            onChange={handleInputChange}
            options={announcementTypes}
          />

          <FormInput
            label="Expires On (Optional)"
            name="expiresAt"
            type="text"
            value={formData.expiresAt || ''}
            onChange={handleInputChange}
            placeholder="YYYY-MM-DD (leave empty for no expiry)"
          />

          <FormCheckbox
            label="Active"
            name="active"
            checked={formData.active}
            onChange={handleCheckboxChange}
            description="Show this announcement on the website"
          />

          <div className={`flex gap-3 mt-6 pt-4 border-t ${isDark ? 'border-stone-700' : 'border-stone-200'}`}>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-colors ${
                isDark 
                  ? 'bg-stone-700 text-stone-300 hover:bg-stone-600' 
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 px-4 rounded-xl font-semibold text-white disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              style={{ 
                background: `linear-gradient(135deg, ${currentTheme.primaryHex}, ${currentTheme.primaryDark})`
              }}
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Icon name="check" size={18} />
                  {editingAnnouncement ? 'Update' : 'Create Announcement'}
                </>
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setDeletingAnnouncement(null);
        }}
        onConfirm={handleDelete}
        title="Delete Announcement"
        message={`Are you sure you want to delete "${deletingAnnouncement?.title}"?`}
        confirmText="Delete"
        confirmVariant="danger"
        isLoading={isSubmitting}
      />
    </div>
  );
}


