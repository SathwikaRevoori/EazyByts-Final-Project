import React, { useState } from 'react';
import { Calendar, MapPin, Users, DollarSign, Check } from 'lucide-react';
import { Event } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { useEvents } from '../../contexts/EventContext';
import toast from 'react-hot-toast';

interface EventCardProps {
  event: Event;
  className?: string;
  showRegisterButton?: boolean;
}

const EventCard: React.FC<EventCardProps> = ({ event, className = '', showRegisterButton = true }) => {
  const { user } = useAuth();
  const { registerForEvent, getUserRegistrations } = useEvents();
  const [isRegistering, setIsRegistering] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(new Date(date));
  };

  const getAvailableSpots = () => {
    return event.capacity - event.bookings;
  };

  const isUserRegistered = () => {
    if (!user) return false;
    const userRegistrations = getUserRegistrations(user.id);
    return userRegistrations.some(reg => reg.eventId === event.id);
  };

  const handleRegister = async () => {
    if (!user) {
      toast.error('Please login to register for events');
      return;
    }

    if (isUserRegistered()) {
      toast.error('You are already registered for this event');
      return;
    }

    setIsRegistering(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const success = registerForEvent(event.id, user.id, user.name, user.email, 1);
    
    if (success) {
      setShowSuccess(true);
      toast.success('Successfully registered for the event!');
      setTimeout(() => setShowSuccess(false), 3000);
    } else {
      toast.error('Failed to register. Event might be full or you are already registered.');
    }
    
    setIsRegistering(false);
  };

  return (
    <div className={`bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden ${className}`}>
      <div className="relative">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
            {event.category}
          </span>
        </div>
        <div className="absolute top-4 right-4">
          <span className="bg-white text-gray-800 px-3 py-1 rounded-full text-xs font-medium">
            ${event.price}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
          {event.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {event.description}
        </p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="h-4 w-4 mr-2" />
            <span>{formatDate(event.date)} at {event.time}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="h-4 w-4 mr-2" />
            <span className="truncate">{event.location}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-500">
            <Users className="h-4 w-4 mr-2" />
            <span>{getAvailableSpots()} spots available</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            by {event.organizer}
          </div>
          
          {showRegisterButton && (
            <div className="flex items-center space-x-2">
              {showSuccess && (
                <div className="flex items-center text-green-600 text-sm">
                  <Check className="h-4 w-4 mr-1" />
                  Registered!
                </div>
              )}
              <button
                onClick={handleRegister}
                disabled={isRegistering || isUserRegistered() || getAvailableSpots() === 0}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isUserRegistered()
                    ? 'bg-green-100 text-green-700 cursor-not-allowed'
                    : getAvailableSpots() === 0
                    ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isRegistering ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : isUserRegistered() ? (
                  'Registered'
                ) : getAvailableSpots() === 0 ? (
                  'Full'
                ) : (
                  'Register'
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;