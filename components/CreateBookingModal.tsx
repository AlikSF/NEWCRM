import React, { useState, useEffect } from 'react';
import { X, Calendar, MapPin, Users, FileText, Flag, User } from 'lucide-react';
import { Booking } from '../types';
import { RECENT_LEADS, AVAILABLE_TOURS } from '../constants';
import SearchableSelect from './SearchableSelect';
import { useTheme } from '../context/ThemeContext';

interface CreateBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  leadName?: string;
  onBookingCreated?: (booking: Booking) => void;
  bookingToEdit?: Booking | null;
  onBookingUpdated?: (booking: Booking) => void;
}

const CreateBookingModal: React.FC<CreateBookingModalProps> = ({ 
  isOpen, 
  onClose, 
  leadName = '', 
  onBookingCreated,
  bookingToEdit,
  onBookingUpdated
}) => {
  const { formatCurrency } = useTheme();
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [selectedTourId, setSelectedTourId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    date: '',
    pax: 2,
    pickupLocation: '',
    notes: ''
  });

  // Prepare options for SearchableSelect
  const leadOptions = RECENT_LEADS.map(lead => ({
    id: lead.id,
    label: lead.name,
    sublabel: `${lead.status} · ${lead.channel}`,
  }));

  const tourOptions = AVAILABLE_TOURS.map(tour => ({
    id: tour.id,
    label: tour.name,
    sublabel: `${tour.duration} · ${formatCurrency(tour.price)}`,
  }));

  // Populate form when editing or reset when creating
  useEffect(() => {
    if (bookingToEdit) {
      setSelectedLeadId(bookingToEdit.leadId || null);
      setSelectedTourId(bookingToEdit.tourId || null);
      setFormData({
        date: bookingToEdit.date,
        pax: bookingToEdit.people,
        pickupLocation: bookingToEdit.pickupLocation || '',
        notes: bookingToEdit.notes || ''
      });
    } else {
      setSelectedLeadId(null);
      setSelectedTourId(null);
      setFormData({
        date: new Date().toISOString().split('T')[0],
        pax: 2,
        pickupLocation: '',
        notes: ''
      });
    }
  }, [bookingToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedLeadId || !selectedTourId) {
      return;
    }

    const selectedLead = RECENT_LEADS.find(l => l.id === selectedLeadId);
    const selectedTour = AVAILABLE_TOURS.find(t => t.id === selectedTourId);

    if (!selectedLead || !selectedTour) return;

    if (bookingToEdit && onBookingUpdated) {
      // Handle Update
      const updatedBooking: Booking = {
        ...bookingToEdit,
        tourName: selectedTour.name,
        clientName: selectedLead.name,
        date: formData.date,
        people: formData.pax,
        pickupLocation: formData.pickupLocation,
        notes: formData.notes,
        leadId: selectedLeadId,
        tourId: selectedTourId
      };
      onBookingUpdated(updatedBooking);
    } else {
      // Handle Create
      const newBooking: Booking = {
        id: `B${Date.now()}`,
        tourName: selectedTour.name,
        date: formData.date,
        clientName: selectedLead.name,
        people: formData.pax,
        status: 'Pending',
        pickupLocation: formData.pickupLocation,
        notes: formData.notes,
        leadId: selectedLeadId,
        tourId: selectedTourId
      };

      if (onBookingCreated) {
        onBookingCreated(newBooking);
      }
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-[70] overflow-y-auto" role="dialog" aria-modal="true">
      <div 
        className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>

      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="relative bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md border border-gray-100 dark:border-gray-700 shadow-2xl transform transition-all">
          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 dark:border-gray-700">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {bookingToEdit ? 'Edit Booking' : 'Create New Booking'}
              </h3>
              {(leadName || bookingToEdit) && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  For {bookingToEdit ? bookingToEdit.clientName : leadName}
                </p>
              )}
            </div>
            <button 
              onClick={onClose} 
              className="text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <SearchableSelect
              options={leadOptions}
              value={selectedLeadId}
              onChange={setSelectedLeadId}
              placeholder="Select a client"
              label="Client / Lead"
              icon={<User className="w-4 h-4" />}
              required
            />

            <SearchableSelect
              options={tourOptions}
              value={selectedTourId}
              onChange={setSelectedTourId}
              placeholder="Select a tour"
              label="Tour"
              icon={<Flag className="w-4 h-4" />}
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1.5">Date</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                     <Calendar className="w-4 h-4 text-gray-400" />
                  </div>
                  <input 
                    type="date" 
                    required
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-700/50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={formData.date}
                    onChange={e => setFormData({...formData, date: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1.5">Pax</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                     <Users className="w-4 h-4 text-gray-400" />
                  </div>
                  <input 
                    type="number" 
                    min="1"
                    required
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-700/50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={formData.pax}
                    onChange={e => setFormData({...formData, pax: parseInt(e.target.value)})}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1.5">Pickup Location</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                   <MapPin className="w-4 h-4 text-gray-400" />
                </div>
                <input 
                  type="text" 
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-700/50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="e.g. Hotel Grand Central"
                  value={formData.pickupLocation}
                  onChange={e => setFormData({...formData, pickupLocation: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1.5">Notes</label>
              <div className="relative">
                <div className="absolute left-3 top-3 pointer-events-none">
                   <FileText className="w-4 h-4 text-gray-400" />
                </div>
                <textarea 
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-700/50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm resize-none"
                  rows={3}
                  placeholder="Dietary requirements, special requests..."
                  value={formData.notes}
                  onChange={e => setFormData({...formData, notes: e.target.value})}
                />
              </div>
            </div>

            <div className="pt-4 flex flex-row-reverse gap-3">
              <button 
                type="submit" 
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm active:scale-95"
              >
                {bookingToEdit ? 'Save Changes' : 'Create Booking'}
              </button>
              <button 
                type="button" 
                onClick={onClose} 
                className="flex-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 py-2.5 rounded-lg text-sm font-semibold transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateBookingModal;