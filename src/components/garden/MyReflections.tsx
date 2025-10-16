'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

/**
 * MyReflections - User's daily reflection calendar page
 * Based on the reflection calendar design
 */
export const MyReflections = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showComingSoonModal, setShowComingSoonModal] = useState(false);
  const router = useRouter();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = (firstDay.getDay() + 6) % 7; // Convert Sunday=0 to Monday=0

    const days = [];
    
    // Add days from previous month
    const prevMonth = new Date(year, month - 1, 0);
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        day: prevMonth.getDate() - i,
        isCurrentMonth: false,
        date: new Date(year, month - 1, prevMonth.getDate() - i)
      });
    }

    // Add days from current month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        day,
        isCurrentMonth: true,
        date: new Date(year, month, day)
      });
    }

    // Add days from next month to fill the grid
    const remainingDays = 42 - days.length; // 6 weeks * 7 days
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        day,
        isCurrentMonth: false,
        date: new Date(year, month + 1, day)
      });
    }

    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const handleDateClick = (date: Date) => {
    // Don't allow selection of future dates
    const today = new Date();
    today.setHours(23, 59, 59, 999); // End of today
    
    if (date > today) {
      return; // Don't select future dates
    }
    
    setSelectedDate(date);
  };

  const handleStartJournaling = () => {
    console.log('📝 Starting journaling for reflection');
    setShowComingSoonModal(true);
  };

  const days = getDaysInMonth(currentDate);
  const today = new Date();
  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString();
  };

  return (
    <div className="min-h-screen relative">
      {/* Background Image */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/garden_background.png)',
          filter: 'brightness(0.4) contrast(1.1)',
        }}
      />
      
      {/* Dark Overlay */}
      <div className="fixed inset-0 bg-black/40" />
      
      {/* Header */}
      <div className="relative z-10 flex items-center justify-between p-4 border-b border-white/20 backdrop-blur-sm">
        <button
          onClick={() => router.back()}
          className="text-white hover:text-gray-300 transition-colors"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <h1 className="text-white text-lg font-medium">My reflections</h1>
        <div className="w-6"></div> {/* Spacer for centering */}
      </div>

      {/* Content */}
      <div className="relative z-10 p-4">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white text-xl font-medium">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => navigateMonth('prev')}
              className="text-white hover:text-gray-300"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6"/>
              </svg>
            </button>
            <button
              onClick={() => navigateMonth('next')}
              className="text-white hover:text-gray-300"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="mb-8">
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map((day) => (
              <div key={day} className="text-center text-gray-400 text-sm py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => {
              const isFutureDate = day.date > new Date();
              const isDisabled = isFutureDate;
              
              return (
                <button
                  key={index}
                  onClick={() => handleDateClick(day.date)}
                  disabled={isDisabled}
                  className={`
                    aspect-square flex items-center justify-center text-sm rounded-lg transition-colors
                    ${isDisabled 
                      ? 'text-gray-400 cursor-not-allowed opacity-50' 
                      : day.isCurrentMonth 
                        ? 'text-white hover:bg-gray-700' 
                        : 'text-gray-500'
                    }
                    ${isToday(day.date) 
                      ? 'bg-gray-600 font-semibold' 
                      : ''
                    }
                    ${selectedDate && day.date.toDateString() === selectedDate.toDateString()
                      ? 'bg-green-600 text-white'
                      : ''
                    }
                  `}
                >
                  {day.day}
                </button>
              );
            })}
          </div>
        </div>

        {/* Daily Reflection Section */}
        <div className="innerview-card">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-white font-medium">DAILY REFLECTION</h3>
            <span className="text-xl">🍃</span>
          </div>
          
          <div className="mb-4">
            <p className="text-white text-sm mb-3">
              What is one thing you wish people really know about you?
            </p>
            <div className="text-gray-400 text-sm leading-relaxed">
              You don't have any reflection for that date
            </div>
          </div>

          <button
            onClick={handleStartJournaling}
            className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-4 w-full flex items-center justify-center gap-2 hover:bg-white/15 transition-colors"
          >
            <span className="text-white text-sm">start journaling</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/70">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Coming Soon Modal */}
      {showComingSoonModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white/10 border border-white/20 rounded-lg p-6 max-w-sm mx-4 backdrop-blur-sm">
            <h3 className="text-white text-lg font-medium mb-4">Coming Soon</h3>
            <p className="text-white/80 text-sm mb-6">
              The chat feature is currently under development. Stay tuned for updates!
            </p>
            <button
              onClick={() => setShowComingSoonModal(false)}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white hover:bg-white/20 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
