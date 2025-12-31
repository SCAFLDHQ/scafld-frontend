// ViewsList.jsx
import React from 'react';

const ViewsList = ({ views, selectedView, onSelectView, onAddView, onDeleteView, onDuplicateView }) => {
  return (
    <div className="h-full flex flex-col">
      {/* Header - Fixed height */}
      <div className="flex-shrink-0 p-4 border-b border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-white">Views</h2>
          <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded">
            {views.length}
          </span>
        </div>
        <button
          onClick={onAddView}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-primary text-black font-bold hover:bg-primary/80 transition-colors text-sm"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          New View
        </button>
      </div>

      {/* Scrollable Views List */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="p-3 space-y-1">
          {views.map(view => (
            <div
              key={view.id}
              className={`p-3 rounded-lg cursor-pointer transition-all group ${
                selectedView.id === view.id
                  ? 'bg-primary/20 border border-primary/30'
                  : 'bg-gray-800/30 hover:bg-gray-700/50 border border-transparent'
              }`}
              onClick={() => onSelectView(view)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-white text-sm truncate">{view.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-1.5 py-0.5 rounded ${
                      view.type === 'List' ? 'bg-blue-500/20 text-blue-300' : 'bg-green-500/20 text-green-300'
                    }`}>
                      {view.type}
                    </span>
                    <span className="text-xs text-gray-400 truncate">{view.model}</span>
                  </div>
                </div>
                
                {/* Actions - Show on hover */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDuplicateView(view.id);
                    }}
                    className="p-1 text-gray-400 hover:text-white transition-colors"
                    title="Duplicate"
                  >
                    <span className="material-symbols-outlined text-xs">content_copy</span>
                  </button>
                  {views.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteView(view.id);
                      }}
                      className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                      title="Delete"
                    >
                      <span className="material-symbols-outlined text-xs">delete</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats Footer - Fixed height */}
      <div className="flex-shrink-0 p-3 border-t border-gray-700 bg-gray-800/20">
        <div className="flex justify-between text-xs">
          <div className="text-center">
            <div className="text-white font-semibold">{views.filter(v => v.type === 'List').length}</div>
            <div className="text-gray-400">List</div>
          </div>
          <div className="text-center">
            <div className="text-white font-semibold">{views.filter(v => v.type === 'Detail').length}</div>
            <div className="text-gray-400">Detail</div>
          </div>
          <div className="text-center">
            <div className="text-white font-semibold">{views.reduce((acc, v) => acc + v.fields.length, 0)}</div>
            <div className="text-gray-400">Fields</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewsList;