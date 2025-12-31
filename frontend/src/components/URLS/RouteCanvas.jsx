// RouteCanvas.jsx
import React from 'react';

const RouteCanvas = ({ routes, selectedRoute, onSelectRoute, onAddRoute, onDeleteRoute }) => {
  return (
    <div className="flex-1 relative bg-background-dark overflow-auto p-8">
      {/* Route Nodes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {routes.map(route => (
          <RouteNode
            key={route.id}
            route={route}
            isSelected={selectedRoute.id === route.id}
            onSelect={() => onSelectRoute(route)}
            onDelete={() => onDeleteRoute(route.id)}
          />
        ))}
      </div>
      
      {/* Add Route FAB */}
      <div className="absolute bottom-8 right-8">
        <button
          onClick={onAddRoute}
          className="flex items-center justify-center gap-3 h-14 pl-5 pr-6 bg-primary text-background-dark text-base font-bold leading-normal tracking-[0.015em] rounded-full shadow-neumorphic-out hover:shadow-neumorphic-in transition-shadow"
        >
          <span className="material-symbols-outlined text-2xl">add</span>
          <span className="truncate">Add Route</span>
        </button>
      </div>
    </div>
  );
};

const RouteNode = ({ route, isSelected, onSelect, onDelete }) => {
  const getPermissionColor = (permission) => {
    switch (permission) {
      case 'Admin Only':
        return 'text-red-400';
      case 'Authenticated':
        return 'text-yellow-400';
      case 'Public':
        return 'text-green-400';
      default:
        return 'text-text-light/70';
    }
  };

  const formatPath = (path) => {
    return path.replace(/{(\w+)}/g, (match, p1) =>
      `<span class="text-primary">{${p1}}</span>`
    );
  };

  const requiredParams = route.parameters?.filter(param => param.required) || [];
  const optionalParams = route.parameters?.filter(param => !param.required) || [];

  return (
    <div
      className={`bg-surface-dark rounded-xl p-5 shadow-neumorphic-out space-y-4 relative cursor-pointer transition-all ${
        isSelected ? 'border-2 border-primary' : 'border-2 border-transparent hover:border-white/20'
      }`}
      onClick={onSelect}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <p className={`text-sm font-normal leading-normal ${getPermissionColor(route.permission)}`}>
            {route.permission}
          </p>
          <p
            className="text-white tracking-light text-xl font-bold leading-tight"
            dangerouslySetInnerHTML={{ __html: formatPath(route.path) }}
          />
          <p className="text-text-light text-base font-medium leading-normal">
            {route.name}
          </p>
        </div>
        <div className="flex gap-1">
          <button
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              // Edit functionality would go here
              console.log('Edit route:', route.id);
            }}
          >
            <span className="material-symbols-outlined text-text-light/80 text-xl">edit</span>
          </button>
          <button
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <span className="material-symbols-outlined text-text-light/80 text-xl">delete</span>
          </button>
        </div>
      </div>

      {/* Parameters Section */}
      {(requiredParams.length > 0 || optionalParams.length > 0) && (
        <div className="space-y-2">
          {requiredParams.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {requiredParams.map(param => (
                <span
                  key={param.id}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-red-500/20 text-red-300 text-xs rounded-full"
                  title={`${param.description || param.name} (${param.parameter_type})`}
                >
                  <span className="material-symbols-outlined text-xs">asterisk</span>
                  {param.name}
                </span>
              ))}
            </div>
          )}
          {optionalParams.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {optionalParams.map(param => (
                <span
                  key={param.id}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-gray-500/20 text-gray-300 text-xs rounded-full"
                  title={`${param.description || param.name} (${param.parameter_type})`}
                >
                  {param.name}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      <p className="text-text-light/70 text-sm leading-relaxed">
        {route.description}
      </p>
    </div>
  );
};

export default RouteCanvas;