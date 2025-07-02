import React, { useState } from 'react';
import { Plus, Calendar, Users, DollarSign, Eye, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useEvents } from '../../contexts/EventContext';
import { Link } from 'react-router-dom';

const OrganizerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { getOrganizerEvents, getEventRegistrations } = useEvents();
  const [activeTab, setActiveTab] = useState<'events' | 'registrations'>('events');

  const organizerEvents = user ? getOrganizerEvents(user.id) : [];
  const totalRegistrations = organizerEvents.reduce((sum, event) => sum + event.bookings, 0);
  const totalRevenue = organizerEvents.reduce((sum, event) => sum + (event.bookings * event.price), 0);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(new Date(date));
  };

  const EventCard = ({ event }: { event: any }) => {
    const registrations = getEventRegistrations(event.id);
    
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex">
          <img
            src={event.image}
            alt={event.title}
            className="w-32 h-32 object-cover"
          />
          <div className="flex-1 p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{event.title}</h3>
                <p className="text-gray-600 text-sm mb-2">{event.description}</p>
                <div className="flex items-center text-sm text-gray-500 space-x-4">
                  <span className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatDate(event.date)} at {event.time}
                  </span>
                  <span className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {event.bookings}/{event.capacity}
                  </span>
                  <span className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-1" />
                    ${event.price}
                  </span>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                  <Eye className="h-4 w-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-green-600 transition-colors">
                  <Edit className="h-4 w-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                event.status === 'active' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {event.status}
              </span>
              <div className="text-sm text-gray-600">
                Revenue: ${event.bookings * event.price}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const RegistrationsList = () => {
    const allRegistrations = organizerEvents.flatMap(event => 
      getEventRegistrations(event.id).map(reg => ({ ...reg, event }))
    );

    return (
      <div className="space-y-4">
        {allRegistrations.length > 0 ? (
          allRegistrations.map((registration) => (
            <div key={registration.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-800 text-lg mb-1">
                    {registration.userName}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">{registration.userEmail}</p>
                  <p className="text-sm text-gray-500">
                    Event: <span className="font-medium">{registration.event.title}</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Registered: {new Date(registration.registrationDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-800">
                    ${registration.totalPrice}
                  </p>
                  <p className="text-sm text-gray-500">
                    {registration.quantity} ticket(s)
                  </p>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                    registration.status === 'confirmed' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {registration.status}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No registrations yet</h3>
            <p className="text-gray-600">
              When people register for your events, they'll appear here.
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Organizer Dashboard
            </h1>
            <p className="text-gray-600">
              Manage your events and track registrations
            </p>
          </div>
          <Link
            to="/create-event"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create Event
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Events</p>
                <p className="text-2xl font-bold text-gray-900">{organizerEvents.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Registrations</p>
                <p className="text-2xl font-bold text-gray-900">{totalRegistrations}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-lg">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${totalRevenue}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="bg-orange-100 p-3 rounded-lg">
                <Calendar className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Events</p>
                <p className="text-2xl font-bold text-gray-900">
                  {organizerEvents.filter(e => e.status === 'active').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('events')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'events'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                My Events ({organizerEvents.length})
              </button>
              <button
                onClick={() => setActiveTab('registrations')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'registrations'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Registrations ({totalRegistrations})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'events' ? (
              <div className="space-y-6">
                {organizerEvents.length > 0 ? (
                  organizerEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No events created yet</h3>
                    <p className="text-gray-600 mb-4">
                      Create your first event to start accepting registrations.
                    </p>
                    <Link
                      to="/create-event"
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      Create Event
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <RegistrationsList />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizerDashboard;