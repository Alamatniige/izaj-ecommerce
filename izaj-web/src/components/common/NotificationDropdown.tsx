import { useState, useRef, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useNotifications } from '@/context/NotificationsContext';

interface User {
  firstName: string;
  lastName: string;
  email: string;
}

interface NotificationDropdownProps {
  user: User | null;
  onOpenAuthModal: () => void;
}

// Helper function to format time ago
function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks} ${diffInWeeks === 1 ? 'week' : 'weeks'} ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  return `${diffInMonths} ${diffInMonths === 1 ? 'month' : 'months'} ago`;
}

export default function NotificationDropdown({ user, onOpenAuthModal }: NotificationDropdownProps) {
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification, isLoading } = useNotifications();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <Icon icon="mdi:package-variant" className="h-5 w-5 text-blue-600" />;
      case 'promo':
        return <Icon icon="mdi:tag" className="h-5 w-5 text-green-600" />;
      case 'review':
        return <Icon icon="mdi:comment-text" className="h-5 w-5 text-purple-600" />;
      case 'system':
        return <Icon icon="mdi:information" className="h-5 w-5 text-gray-600" />;
      case 'favorite':
        return <Icon icon="mdi:heart" className="h-5 w-5 text-red-600" />;
      case 'payment':
        return <Icon icon="mdi:credit-card" className="h-5 w-5 text-yellow-600" />;
      default:
        return <Icon icon="mdi:bell" className="h-5 w-5 text-gray-600" />;
    }
  };

  const handleMarkAsRead = async (id: string) => {
    await markAsRead(id);
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  const handleDeleteNotification = async (id: string) => {
    await deleteNotification(id);
  };

  useEffect(() => {
    if (!isNotificationDropdownOpen) return;
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsNotificationDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isNotificationDropdownOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsNotificationDropdownOpen(!isNotificationDropdownOpen)}
        className="relative text-black hover:text-gray-600 transition-all duration-200 hover:scale-110 font-jost"
        aria-label="Notifications"
      >
        <Icon 
          icon={isNotificationDropdownOpen ? "mdi:bell" : "mdi:bell-outline"} 
          width="28" 
          height="28" 
        />

        {user && unreadCount > 0 && (
          <span className={`absolute -top-1 -right-1 bg-gradient-to-r from-gray-800 to-black text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center font-bold shadow-lg ${
            unreadCount > 9 ? 'px-1' : ''
          }`} style={{ fontFamily: 'Jost, sans-serif' }}>
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isNotificationDropdownOpen && (
        <div className="absolute right-0 sm:right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl z-50 overflow-hidden border border-gray-100 transform origin-top-right animate-scale-in max-w-[calc(100vw-2rem)] font-jost">
          <div className="py-3 px-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2 font-jost">
              <Icon icon="mdi:bell-outline" className="w-5 h-5 text-black" />
              Notifications
            </h3>
            {user && unreadCount > 0 && (
              <button 
                onClick={handleMarkAllAsRead}
                className="text-sm text-gray-600 hover:text-black font-medium transition-colors duration-200 flex items-center gap-1 hover:bg-gray-100 px-2 py-1 rounded-lg font-jost"
              >
                <Icon icon="mdi:check-all" className="w-4 h-4" />
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 sm:max-h-96 overflow-y-auto custom-scrollbar">
            {user ? (
              isLoading ? (
                <div className="py-8 text-center px-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
                  <p className="text-sm text-gray-500 mt-2 font-jost">Loading notifications...</p>
                </div>
              ) : notifications.length > 0 ? (
                <div className="py-1">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`px-4 py-3 hover:bg-gray-50 transition-all duration-200 group relative cursor-pointer ${
                        !notification.is_read ? 'bg-gray-50/50' : 'bg-white'
                      }`}
                      onClick={() => {
                        if (!notification.is_read) {
                          handleMarkAsRead(notification.id);
                        }
                        if (notification.link) {
                          window.location.href = notification.link;
                        }
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`flex-shrink-0 p-2 rounded-lg ${
                          notification.type === 'order' ? 'bg-blue-50' :
                          notification.type === 'promo' ? 'bg-green-50' :
                          notification.type === 'review' ? 'bg-purple-50' :
                          notification.type === 'favorite' ? 'bg-red-50' :
                          notification.type === 'payment' ? 'bg-yellow-50' :
                          'bg-gray-50'
                        }`}>
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm leading-relaxed font-jost ${
                            notification.is_read
                              ? 'text-gray-600'
                              : 'text-gray-800 font-medium'
                          }`}>
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <p className="text-xs text-gray-500 flex items-center gap-1 font-jost">
                              <Icon icon="mdi:clock-outline" className="w-3.5 h-3.5" />
                              {formatTimeAgo(notification.created_at)}
                            </p>
                            {!notification.is_read && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-black text-white font-jost">
                                New
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteNotification(notification.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-gray-400 hover:text-red-500 p-1 hover:bg-red-50 rounded-lg"
                        >
                          <Icon icon="mdi:close" className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center px-4">
                  <div className="bg-gray-50 rounded-full w-16 h-16 mx-auto flex items-center justify-center mb-4">
                    <Icon icon="mdi:bell-off-outline" className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-800 mb-2 font-jost">No notifications yet</h3>
                  <p className="text-sm text-gray-500 font-jost">
                    We'll notify you about your orders, promotions, and updates
                  </p>
                </div>
              )
            ) : (
              <div className="py-6 px-4 text-center bg-gradient-to-b from-gray-50 to-white">
                <div className="bg-gray-50 rounded-full w-16 h-16 mx-auto flex items-center justify-center mb-4">
                  <Icon icon="mdi:account-alert-outline" className="h-8 w-8 text-gray-600" />
                </div>
                <h3 className="text-base font-semibold text-gray-800 mb-2 font-jost">Sign in to view notifications</h3>
                <p className="text-sm text-gray-600 mb-4 font-jost">
                  Stay updated with your orders and promotions
                </p>
                <button 
                  className="inline-flex items-center px-6 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-300 font-medium text-sm font-jost"
                  onClick={() => {
                    setIsNotificationDropdownOpen(false);
                    onOpenAuthModal();
                  }}
                >
                  <Icon icon="mdi:login" className="w-4 h-4 mr-2" />
                  Sign in
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Add custom CSS for animations
const styles = `
  @keyframes scale-in {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  .animate-scale-in {
    animation: scale-in 0.2s ease-out;
  }

  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }

  .custom-scrollbar::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #4b5563;
    border-radius: 3px;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #000000;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

