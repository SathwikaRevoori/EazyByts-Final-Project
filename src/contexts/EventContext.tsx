import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Event, Registration } from '../types';
import { mockEvents } from '../data/mockData';

interface EventContextType {
  events: Event[];
  registrations: Registration[];
  addEvent: (event: Omit<Event, 'id' | 'createdAt' | 'bookings'>) => void;
  registerForEvent: (eventId: string, userId: string, userName: string, userEmail: string, quantity: number) => boolean;
  getUserRegistrations: (userId: string) => Registration[];
  getEventRegistrations: (eventId: string) => Registration[];
  getOrganizerEvents: (organizerId: string) => Event[];
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const useEvents = () => {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
};

interface EventProviderProps {
  children: ReactNode;
}

export const EventProvider: React.FC<EventProviderProps> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);

  useEffect(() => {
    // Load initial data
    const savedEvents = localStorage.getItem('eventhub_events');
    const savedRegistrations = localStorage.getItem('eventhub_registrations');
    
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
    } else {
      setEvents(mockEvents);
      localStorage.setItem('eventhub_events', JSON.stringify(mockEvents));
    }
    
    if (savedRegistrations) {
      setRegistrations(JSON.parse(savedRegistrations));
    }
  }, []);

  const addEvent = (eventData: Omit<Event, 'id' | 'createdAt' | 'bookings'>) => {
    const newEvent: Event = {
      ...eventData,
      id: Date.now().toString(),
      createdAt: new Date(),
      bookings: 0
    };
    
    const updatedEvents = [...events, newEvent];
    setEvents(updatedEvents);
    localStorage.setItem('eventhub_events', JSON.stringify(updatedEvents));
  };

  const registerForEvent = (eventId: string, userId: string, userName: string, userEmail: string, quantity: number): boolean => {
    const event = events.find(e => e.id === eventId);
    if (!event) return false;

    // Check if user already registered
    const existingRegistration = registrations.find(r => r.eventId === eventId && r.userId === userId);
    if (existingRegistration) return false;

    // Check capacity
    if (event.bookings + quantity > event.capacity) return false;

    const registration: Registration = {
      id: Date.now().toString(),
      eventId,
      userId,
      userName,
      userEmail,
      quantity,
      totalPrice: event.price * quantity,
      status: 'confirmed',
      registrationDate: new Date(),
      event
    };

    const updatedRegistrations = [...registrations, registration];
    setRegistrations(updatedRegistrations);
    localStorage.setItem('eventhub_registrations', JSON.stringify(updatedRegistrations));

    // Update event bookings
    const updatedEvents = events.map(e => 
      e.id === eventId ? { ...e, bookings: e.bookings + quantity } : e
    );
    setEvents(updatedEvents);
    localStorage.setItem('eventhub_events', JSON.stringify(updatedEvents));

    return true;
  };

  const getUserRegistrations = (userId: string): Registration[] => {
    return registrations.filter(r => r.userId === userId);
  };

  const getEventRegistrations = (eventId: string): Registration[] => {
    return registrations.filter(r => r.eventId === eventId);
  };

  const getOrganizerEvents = (organizerId: string): Event[] => {
    return events.filter(e => e.organizerId === organizerId);
  };

  const value: EventContextType = {
    events,
    registrations,
    addEvent,
    registerForEvent,
    getUserRegistrations,
    getEventRegistrations,
    getOrganizerEvents
  };

  return (
    <EventContext.Provider value={value}>
      {children}
    </EventContext.Provider>
  );
};