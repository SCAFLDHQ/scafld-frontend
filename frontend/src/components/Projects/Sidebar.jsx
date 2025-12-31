import { Link } from "react-router-dom";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useState } from "react";

const Sidebar = ({ onPublish, activeTab = 'dashboard' }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { projectId } = useParams();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const mainNavItems = [
    { icon: 'dashboard', label: 'Dashboard', active: activeTab === 'dashboard', path: `/project/${projectId}` },
    { icon: 'database', label: 'Database', active: activeTab === 'database', path: `/project/${projectId}/database` },
    { icon: 'api', label: 'Views', active: activeTab === 'views', path: `/project/${projectId}/views` },
    { icon: 'route', label: 'URLs', active: activeTab === 'urls', path: `/project/${projectId}/urls` },
    { icon: 'lock', label: 'Permissions', active: activeTab === 'permissions', path: `/project/${projectId}/permissions` },
  ];

  const bottomNavItems = [
    { icon: 'settings', label: 'Settings', path: `/project/${projectId}/settings` },
  ];

  const handlePublish = () => {
    // Pass projectId to the publish page
    navigate(`/project/${projectId}/publish`);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getUserInitials = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
    } else if (user?.username) {
      return user.username.substring(0, 2).toUpperCase();
    }
    return "RS";
  };

  const getUserDisplayName = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name} ${user.last_name}`;
    } else if (user?.username) {
      return user.username;
    }
    return "User";
  };

  const getSubscriptionTier = () => {
    return user?.profile?.subscription_tier?.name || user?.profile?.subscription_tier || 'Loading...';
  };

  return (
    <aside 
      className={`flex-shrink-0 p-6 flex flex-col justify-between bg-[#1A1A1A] border-r border-gray-800 h-screen overflow-hidden transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
      onMouseEnter={() => setIsCollapsed(false)}
      onMouseLeave={() => setIsCollapsed(true)}
    >
      {/* Top Section - Fixed height */}
      <div className="flex-shrink-0">
        <Link to='/dashboard'>
        <div className={`flex items-center gap-3 mb-10 ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 bg-primary/20 flex items-center justify-center">
            {user?.avatar ? (
              <img 
                src={user.avatar} 
                alt="User avatar" 
                className="rounded-full w-full h-full object-cover"
              />
            ) : (
              <span className="text-primary font-bold text-sm">
                {getUserInitials()}
              </span>
            )}
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="text-white text-lg font-display font-bold">SCAFLD</h1>
              <p className="text-gray-400 text-sm">
                {getSubscriptionTier()}
              </p>
            </div>
          )}
        </div>
        </Link>
        
        <nav className="flex flex-col gap-2">
          {mainNavItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors flex-shrink-0 group ${
                item.active 
                  ? 'bg-black/20 shadow-neumorphic-inset' 
                  : 'hover:bg-white/5'
              } ${isCollapsed ? 'justify-center' : ''}`}
              title={isCollapsed ? item.label : ''}
            >
              <span className={`material-symbols-outlined ${
                item.active ? 'text-primary' : 'text-gray-400'
              }`}>
                {item.icon}
              </span>
              {!isCollapsed && (
                <>
                  <p className={`font-medium ${
                    item.active ? 'text-primary' : 'text-primary-text'
                  }`}>
                    {item.label}
                  </p>
                  {item.label === 'Permissions' && (
                    <span className="text-xs bg-yellow-500/20 text-yellow-300 px-1.5 py-0.5 rounded ml-auto">
                      SOON
                    </span>
                  )}
                </>
              )}
              
              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap">
                  {item.label}
                  {item.label === 'Permissions' && ' (SOON)'}
                </div>
              )}
            </Link>
          ))}
        </nav>
      </div>
      
      {/* Bottom Section - Fixed height */}
      <div className="flex-shrink-0 space-y-3">
        {/* User Info - Only show when expanded */}
        {!isCollapsed && (
          <Link to="/profile" className="block mb-2">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
              <div className="bg-primary/20 rounded-full size-8 flex items-center justify-center">
                {user?.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt="User avatar" 
                    className="rounded-full w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-primary font-bold text-xs">
                    {getUserInitials()}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">
                  {getUserDisplayName()}
                </p>
                <p className="text-gray-400 text-xs truncate">
                  {user?.email || 'user@example.com'}
                </p>
              </div>
            </div>
          </Link>
        )}

        {/* Publish Button */}
        <button 
          onClick={handlePublish}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors shadow-neumorphic border border-primary/20 flex-shrink-0 group ${
            isCollapsed ? 'justify-center' : ''
          }`}
          title={isCollapsed ? "Publish" : ""}
        >
          <span className="material-symbols-outlined text-primary">publish</span>
          {!isCollapsed && <p className="text-primary font-medium">Publish</p>}
          
          {/* Tooltip for collapsed state */}
          {isCollapsed && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
              Publish
            </div>
          )}
        </button>

        {/* Settings Link */}
        {bottomNavItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors flex-shrink-0 group ${
              activeTab === 'settings' 
                ? 'bg-black/20 shadow-neumorphic-inset' 
                : 'hover:bg-white/5'
            } ${isCollapsed ? 'justify-center' : ''}`}
            title={isCollapsed ? item.label : ''}
          >
            <span className={`material-symbols-outlined ${
              activeTab === 'settings' ? 'text-primary' : 'text-gray-400'
            }`}>
              {item.icon}
            </span>
            {!isCollapsed && (
              <p className={`font-medium ${
                activeTab === 'settings' ? 'text-primary' : 'text-primary-text'
              }`}>
                {item.label}
              </p>
            )}
            
            {/* Tooltip for collapsed state */}
            {isCollapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                {item.label}
              </div>
            )}
          </Link>
        ))}

        {/* Logout Button */}
        <button 
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-500/10 transition-colors flex-shrink-0 text-gray-300 hover:text-red-300 border border-transparent hover:border-red-500/20 group ${
            isCollapsed ? 'justify-center' : ''
          }`}
          title={isCollapsed ? "Logout" : ""}
        >
          <span className="material-symbols-outlined">logout</span>
          {!isCollapsed && <p className="font-medium">Logout</p>}
          
          {/* Tooltip for collapsed state */}
          {isCollapsed && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
              Logout
            </div>
          )}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;