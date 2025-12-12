import React, { useState, useRef, useEffect } from 'react';
import {
  Users,
  MessageSquare,
  PhoneOutgoing,
  Map as MapIcon,
  ArrowRight,
  Plus,
  MoreVertical,
  Filter,
  Calendar,
  X,
  MessageCircle,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';
import { KPI_DATA, RECENT_LEADS, UPCOMING_BOOKINGS } from '../constants';
import { Booking, BookingStatus, LeadStatus, Lead } from '../types';
import AddLeadModal from './AddLeadModal';
import CreateBookingModal from './CreateBookingModal';

// --- Sub-components for Cleaner Code ---

const Avatar = ({ name, url }: { name: string; url?: string }) => {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
    
  // Generate a deterministic color based on name length
  const colors = ['bg-blue-100 text-blue-700', 'bg-indigo-100 text-indigo-700', 'bg-emerald-100 text-emerald-700', 'bg-amber-100 text-amber-700'];
  const colorClass = colors[name.length % colors.length];

  if (url) {
    return <img src={url} alt={name} className="w-8 h-8 rounded-full object-cover ring-2 ring-white dark:ring-gray-800" />;
  }
  
  return (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ring-2 ring-white dark:ring-gray-800 ${colorClass}`}>
      {initials}
    </div>
  );
};

const StatusBadge = ({ status, type }: { status: string; type: 'lead' | 'booking' }) => {
  let colorClass = 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
  let dotColor = 'bg-gray-400';

  if (type === 'lead') {
    switch (status as LeadStatus) {
      case 'New': 
        colorClass = 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'; 
        dotColor = 'bg-blue-500';
        break;
      case 'Contacted': 
        colorClass = 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400'; 
        dotColor = 'bg-amber-500';
        break;
      case 'Qualified': 
        colorClass = 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'; 
        dotColor = 'bg-emerald-500';
        break;
      case 'Lost': 
        colorClass = 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'; 
        dotColor = 'bg-gray-500';
        break;
    }
  } else {
    switch (status as BookingStatus) {
      case 'Confirmed': 
        colorClass = 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'; 
        dotColor = 'bg-emerald-500';
        break;
      case 'Pending': 
        colorClass = 'bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400'; 
        dotColor = 'bg-orange-500';
        break;
      case 'Completed': 
        colorClass = 'bg-gray-50 text-gray-600 dark:bg-gray-800/50 dark:text-gray-400'; 
        dotColor = 'bg-gray-400';
        break;
      case 'Cancelled': 
        colorClass = 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'; 
        dotColor = 'bg-red-500';
        break;
    }
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border border-transparent ${colorClass}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`}></span>
      {status}
    </span>
  );
};

// Map KPI labels to icons
const getKpiIcon = (label: string) => {
  if (label.includes('leads')) return Users;
  if (label.includes('conversations')) return MessageSquare;
  if (label.includes('Follow-ups')) return PhoneOutgoing;
  return MapIcon;
};

// --- Main Dashboard Component ---

interface DashboardProps {
  bookings?: Booking[];
  searchTerm?: string;
  onNavigate?: (page: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ bookings = UPCOMING_BOOKINGS, searchTerm = '', onNavigate }) => {
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [leadFilterTab, setLeadFilterTab] = useState<'all' | 'new' | 'priority'>('all');
  const [bookingFilterOpen, setBookingFilterOpen] = useState(false);
  const [bookingMoreOpen, setBookingMoreOpen] = useState(false);
  const [bookingTimeFilter, setBookingTimeFilter] = useState<'7days' | '30days' | 'all'>('7days');

  const bookingFilterRef = useRef<HTMLDivElement>(null);
  const bookingMoreRef = useRef<HTMLDivElement>(null);

  const activeLead = RECENT_LEADS.find(l => l.id === selectedLeadId);

  const filteredLeads = RECENT_LEADS.filter(lead => {
    if (leadFilterTab === 'new') return lead.status === 'New';
    if (leadFilterTab === 'priority') return lead.status === 'Qualified';
    return true;
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (bookingFilterRef.current && !bookingFilterRef.current.contains(event.target as Node)) {
        setBookingFilterOpen(false);
      }
      if (bookingMoreRef.current && !bookingMoreRef.current.contains(event.target as Node)) {
        setBookingMoreOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKpiClick = (label: string) => {
    if (label.includes('leads') && onNavigate) {
      onNavigate('leads');
    } else if (label.includes('conversations') && onNavigate) {
      onNavigate('inbox');
    } else if (label.includes('Follow-ups') && onNavigate) {
      onNavigate('leads');
    } else if (label.includes('tours') && onNavigate) {
      onNavigate('bookings');
    }
  };

  return (
    <div className="min-h-screen pb-10">
      
      {/* Header moved to App.tsx */}

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        
        {/* 2. Welcome & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Dashboard</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Good morning, Alex. Here's what's happening today.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate?.('reports')}
              className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition shadow-sm"
            >
              View Report
            </button>
            <button 
              onClick={() => setIsLeadModalOpen(true)}
              className="group flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition shadow-sm active:scale-95 duration-150"
            >
              <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
              Add Lead
            </button>
          </div>
        </div>

        {/* 3. KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {KPI_DATA.map((kpi, idx) => {
            const Icon = getKpiIcon(kpi.label);
            return (
              <div
                key={kpi.id}
                onClick={() => handleKpiClick(kpi.label)}
                className="relative group bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700/50 shadow-sm hover:shadow-md hover:border-indigo-100 dark:hover:border-indigo-900/50 transition-all duration-300 cursor-pointer active:scale-95"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-2.5 rounded-lg ${
                    idx === 0 ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' :
                    idx === 1 ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400' :
                    idx === 2 ? 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400' :
                    'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  {kpi.trend && (
                    <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
                      kpi.trendUp
                        ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {kpi.trendUp ? '↑' : '↓'} {kpi.trend}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">{kpi.value}</h3>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">{kpi.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* 4. Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          
          {/* Leads Panel */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col h-full">
            {/* Panel Header */}
            <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Leads to follow up</h2>
                <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs px-2 py-0.5 rounded-full font-medium">{RECENT_LEADS.length}</span>
              </div>
              
              {/* Tabs */}
              <div className="flex items-center p-1 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <button
                  onClick={() => setLeadFilterTab('all')}
                  className={`px-3 py-1 text-xs font-medium transition-all rounded-md ${
                    leadFilterTab === 'all'
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setLeadFilterTab('new')}
                  className={`px-3 py-1 text-xs font-medium transition-all rounded-md ${
                    leadFilterTab === 'new'
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                  }`}
                >
                  New
                </button>
                <button
                  onClick={() => setLeadFilterTab('priority')}
                  className={`px-3 py-1 text-xs font-medium transition-all rounded-md ${
                    leadFilterTab === 'priority'
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                  }`}
                >
                  Priority
                </button>
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50/50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 font-medium text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3 border-b border-gray-100 dark:border-gray-700">Lead</th>
                    <th className="px-6 py-3 border-b border-gray-100 dark:border-gray-700">Status</th>
                    <th className="hidden sm:table-cell px-6 py-3 border-b border-gray-100 dark:border-gray-700">Channel</th>
                    <th className="px-6 py-3 border-b border-gray-100 dark:border-gray-700 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                  {filteredLeads.map((lead) => (
                    <tr
                      key={lead.id}
                      onClick={() => setSelectedLeadId(lead.id)}
                      className="group hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors cursor-pointer"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar name={lead.name} />
                          <div>
                            <p className="font-semibold text-sm text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{lead.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{lead.lastMessageTime}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={lead.status} type="lead" />
                      </td>
                      <td className="hidden sm:table-cell px-6 py-4">
                         <span className="inline-flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-300">
                           {lead.channel === 'WhatsApp' ? <div className="w-2 h-2 rounded-full bg-green-500" /> : <div className="w-2 h-2 rounded-full bg-gray-300" />}
                           {lead.channel}
                         </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="opacity-0 group-hover:opacity-100 text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-900/30 p-2 rounded-lg transition-all">
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t border-gray-100 dark:border-gray-700">
              <button
                onClick={() => onNavigate?.('leads')}
                className="w-full py-2 flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors border border-dashed border-gray-200 dark:border-gray-700"
              >
                 View all leads
              </button>
            </div>
          </div>

          {/* Bookings Panel */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col h-full">
            <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Upcoming Bookings</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Next 7 days schedule</p>
              </div>
              <div className="flex gap-2">
                 <div className="relative" ref={bookingFilterRef}>
                   <button
                     onClick={() => setBookingFilterOpen(!bookingFilterOpen)}
                     className="p-2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                   >
                     <Filter className="w-4 h-4" />
                   </button>
                   {bookingFilterOpen && (
                     <div className="absolute right-0 top-10 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 py-1">
                       <button
                         onClick={() => {
                           setBookingTimeFilter('7days');
                           setBookingFilterOpen(false);
                         }}
                         className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                           bookingTimeFilter === '7days' ? 'text-indigo-600 dark:text-indigo-400 font-medium' : 'text-gray-700 dark:text-gray-300'
                         }`}
                       >
                         Next 7 days
                       </button>
                       <button
                         onClick={() => {
                           setBookingTimeFilter('30days');
                           setBookingFilterOpen(false);
                         }}
                         className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                           bookingTimeFilter === '30days' ? 'text-indigo-600 dark:text-indigo-400 font-medium' : 'text-gray-700 dark:text-gray-300'
                         }`}
                       >
                         Next 30 days
                       </button>
                       <button
                         onClick={() => {
                           setBookingTimeFilter('all');
                           setBookingFilterOpen(false);
                         }}
                         className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                           bookingTimeFilter === 'all' ? 'text-indigo-600 dark:text-indigo-400 font-medium' : 'text-gray-700 dark:text-gray-300'
                         }`}
                       >
                         All
                       </button>
                     </div>
                   )}
                 </div>
                 <div className="relative" ref={bookingMoreRef}>
                   <button
                     onClick={() => setBookingMoreOpen(!bookingMoreOpen)}
                     className="p-2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                   >
                     <MoreVertical className="w-4 h-4" />
                   </button>
                   {bookingMoreOpen && (
                     <div className="absolute right-0 top-10 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 py-1">
                       <button
                         onClick={() => {
                           onNavigate?.('bookings');
                           setBookingMoreOpen(false);
                         }}
                         className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                       >
                         View all bookings
                       </button>
                       <button
                         disabled
                         className="w-full px-4 py-2 text-left text-sm text-gray-400 dark:text-gray-600 cursor-not-allowed"
                       >
                         Export
                       </button>
                     </div>
                   )}
                 </div>
              </div>
            </div>
            
            <div className="flex-1 overflow-x-auto">
               <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50/50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 font-medium text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3 border-b border-gray-100 dark:border-gray-700">Tour</th>
                    <th className="px-6 py-3 border-b border-gray-100 dark:border-gray-700">Client</th>
                    <th className="hidden sm:table-cell px-6 py-3 border-b border-gray-100 dark:border-gray-700 text-center">Pax</th>
                    <th className="px-6 py-3 border-b border-gray-100 dark:border-gray-700 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                  {bookings.map((booking) => (
                    <tr
                      key={booking.id}
                      onClick={() => setEditingBooking(booking)}
                      className="group hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors cursor-pointer"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400 shrink-0">
                            <MapIcon className="w-5 h-5" />
                          </div>
                          <div className="min-w-0 max-w-[180px]">
                            <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">{booking.tourName}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 flex items-center gap-1">
                              <Calendar className="w-3 h-3" /> {booking.date}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                         <div className="flex items-center gap-2">
                           <Avatar name={booking.clientName} />
                           <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{booking.clientName}</p>
                         </div>
                      </td>
                      <td className="hidden sm:table-cell px-6 py-4 text-center">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 text-xs font-medium text-gray-600 dark:text-gray-300">
                          {booking.people}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                         <StatusBadge status={booking.status} type="booking" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modals & Drawers */}
        <AddLeadModal isOpen={isLeadModalOpen} onClose={() => setIsLeadModalOpen(false)} />

        {/* Lead Details Drawer */}
        {selectedLeadId && activeLead && (
          <>
            <div
              className="fixed inset-0 z-[60] bg-gray-900/40 backdrop-blur-sm transition-opacity duration-300"
              onClick={() => setSelectedLeadId(null)}
            />
            <div className="fixed right-0 top-0 bottom-0 z-[70] w-full max-w-md bg-white dark:bg-gray-800 shadow-2xl overflow-y-auto">
              <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Lead Details</h3>
                <button
                  onClick={() => setSelectedLeadId(null)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="flex items-center gap-4">
                  <Avatar name={activeLead.name} />
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{activeLead.name}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{activeLead.lastMessageTime}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</span>
                    <StatusBadge status={activeLead.status} type="lead" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Channel</span>
                    <span className="text-sm text-gray-900 dark:text-white">{activeLead.channel}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex gap-2">
                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
                      <MessageCircle className="w-4 h-4" />
                      Message
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <Phone className="w-4 h-4" />
                      Call
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Booking Edit Modal */}
        {editingBooking && (
          <CreateBookingModal
            isOpen={true}
            onClose={() => setEditingBooking(null)}
            existingBooking={editingBooking}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;