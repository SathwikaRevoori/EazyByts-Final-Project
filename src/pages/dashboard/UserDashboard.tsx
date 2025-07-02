import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Users, Ticket, Filter } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useEvents } from '../../contexts/EventContext';
import CalendarComponent from '../../components/dashboard/Calendar';

const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const { getUserRegistrations } = useEvents();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'calendar'>('upcoming');

  const userRegistrations = user ? getUserRegistrations(user.id) : [];
  
  const now = new Date();
  const upcomingRegistrations = userRegistrations.filter(reg => 
    reg.event && new Date(reg.event.date) >= now
  );
  const pastRegistrations = userRegistrations.filter(reg => 
    reg.event && new Date(reg.event.date) < now
  );

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date));
  };

  const RegistrationCard = ({ registration }: { registration: any }) => {
    if (!registration.event) return null;

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
        <div className="flex">
          <img
            src={registration.event.image}
            alt={registration.event.title}
            className="w-24 h-24 object-cover"
          />
          <div className="flex-1 p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-gray-800 text-lg">
                {registration.event.title}
              </h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                registration.status === 'confirmed' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {registration.status}
              </span>
            </div>
            
            <div className="space-y-1 text-sm text-gray-600 mb-3">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                <span>{formatDate(registration.event.date)} at {registration.event.time}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                <span>{registration.event.location}</span>
              </div>
              <div className="flex items-center">
                <Ticket className="h-4 w-4 mr-2" />
                <span>{registration.quantity} ticket(s) - ${registration.totalPrice}</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">
                Registered on {new Date(registration.registrationDate).toLocaleDateString()}
              </span>
              <span className="text-sm font-medium text-blue-600">
                by {registration.event.organizer}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600">
            Manage your event registrations and discover new experiences
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Upcoming Events</p>
                <p className="text-2xl font-bold text-gray-900">{upcomingRegistrations.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Past Events</p>
                <p className="text-2xl font-bold text-gray-900">{pastRegistrations.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Ticket className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Registrations</p>
                <p className="text-2xl font-bold text-gray-900">{userRegistrations.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'upcoming'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Upcoming Events ({upcomingRegistrations.length})
              </button>
              <button
                onClick={() => setActiveTab('past')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'past'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Past Events ({pastRegistrations.length})
              </button>
              <button
                onClick={() => setActiveTab('calendar')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'calendar'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Calendar View
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'calendar' ? (
              <CalendarComponent registrations={userRegistrations} />
            ) : (
              <div className="space-y-4">
                {(activeTab === 'upcoming' ? upcomingRegistrations : pastRegistrations).length > 0 ? (
                  (activeTab === 'upcoming' ? upcomingRegistrations : pastRegistrations).map((registration) => (
                    <RegistrationCard key={registration.id} registration={registration} />
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No {activeTab} events
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {activeTab === 'upcoming' 
                        ? "You haven't registered for any upcoming events yet."
                        : "You haven't attended any events yet."
                      }
                    </p>
                    <a
                      href="/events"
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Browse Events
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;