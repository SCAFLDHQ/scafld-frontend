import React, { useState, useEffect } from 'react';

const ApiTestConsole = ({ view, mockResponse, routes = [] }) => {
  const [requestMethod, setRequestMethod] = useState('GET');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [requestBody, setRequestBody] = useState('');
  const [requestParams, setRequestParams] = useState('');

  // Find the route that matches this view
  const findMatchingRoute = () => {
    if (!routes || routes.length === 0) return null;
    
    // Try to find a route by view name
    const routeByViewName = routes.find(route => 
      route.view === view.name || route.associated_view === view.name
    );
    
    if (routeByViewName) return routeByViewName;
    
    // Fallback: try to find by path pattern
    const basePath = `/api/${view.model.toLowerCase()}${view.type === 'List' ? 's/' : 's/{id}/'}`;
    const routeByPath = routes.find(route => {
      const normalizedRoutePath = route.path.replace(/{(\w+)}/g, '{id}');
      return normalizedRoutePath === basePath;
    });
    
    return routeByPath || null;
  };

  const matchingRoute = findMatchingRoute();

  useEffect(() => {
    // Reset when view changes
    setRequestMethod(matchingRoute?.http_method || 'GET');
    setResponse(null);
    setRequestBody('');
    setRequestParams('');
  }, [view, matchingRoute]);

  const getEndpointUrl = () => {
    // Use the route path if available, otherwise generate default
    if (matchingRoute) {
      let url = matchingRoute.path;
      
      // Replace {id} with example ID for detail views
      if (view.type === 'Detail') {
        url = url.replace(/{(\w+)}/g, '1');
      }
      
      // Add query params for list views
      if (view.type === 'List' && requestParams) {
        const separator = url.includes('?') ? '&' : '?';
        url += `${separator}${requestParams}`;
      }
      
      return url;
    }
    
    // Fallback to default generation
    const base = `/api/${view.model.toLowerCase()}s/`;
    let url = view.type === 'Detail' ? `${base}1/` : base;
    
    // Add query params for list views
    if (view.type === 'List' && requestParams) {
      url += `?${requestParams}`;
    }
    
    return url;
  };

  const getHttpMethodOptions = () => {
    if (matchingRoute?.http_method) {
      // If we have a matching route, only show its HTTP method
      return [matchingRoute.http_method];
    }
    
    // Default methods based on view type
    const baseMethods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];
    return view.type === 'Detail' ? ['GET', 'PUT', 'PATCH', 'DELETE'] : ['GET', 'POST'];
  };

  const handleSendRequest = async () => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Generate dynamic mock response based on view configuration
    const dynamicResponse = generateMockResponse();
    setResponse({
      status: 200,
      statusText: 'OK',
      data: dynamicResponse,
      time: Math.floor(Math.random() * 200) + 50 // Random response time 50-250ms
    });
    
    setIsLoading(false);
  };

  const generateMockResponse = () => {
    if (view.type === 'List') {
      // Generate multiple items for list view
      const results = Array.from({ length: Math.min(view.pageSize || 3, 5) }, (_, index) => {
        const item = {};
        view.fields.forEach(field => {
          item[field] = generateMockFieldValue(field, index + 1);
        });
        return item;
      });

      if (view.pagination) {
        return {
          count: 42,
          next: results.length < 42 ? `/api/${view.model.toLowerCase()}s/?page=2` : null,
          previous: null,
          results
        };
      }
      return results;
    } else {
      // Single item for detail view
      const item = {};
      view.fields.forEach(field => {
        item[field] = generateMockFieldValue(field, 1);
      });
      return item;
    }
  };

  const generateMockFieldValue = (field, id) => {
    const fieldExamples = {
      id: id,
      username: `user${id}`,
      email: `user${id}@example.com`,
      first_name: ['John', 'Jane', 'Bob', 'Alice'][id % 4],
      last_name: ['Doe', 'Smith', 'Wilson', 'Johnson'][id % 4],
      is_active: true,
      date_joined: `2023-${String((id % 12) + 1).padStart(2, '0')}-15T10:30:00Z`,
      last_login: `2023-12-${String(id).padStart(2, '0')}T08:20:00Z`,
      name: `Product ${id}`,
      description: `Description for product ${id}`,
      price: (id * 25.99).toFixed(2),
      category: ['electronics', 'clothing', 'books', 'home'][id % 4],
      in_stock: id % 3 !== 0,
      created_at: `2023-11-${String(id).padStart(2, '0')}T14:20:00Z`,
      updated_at: `2023-12-${String(id).padStart(2, '0')}T09:15:00Z`,
      user: id,
      products: [1, 2, 3],
      total_amount: (id * 99.99).toFixed(2),
      status: ['pending', 'completed', 'cancelled'][id % 3]
    };

    return fieldExamples[field] !== undefined 
      ? fieldExamples[field] 
      : `mock_${field}`;
  };

  const getCurlCommand = () => {
    let curl = `curl -X ${requestMethod} \\\n`;
    curl += `  "http://localhost:8000${getEndpointUrl()}" \\\n`;
    
    // Add authentication header if required
    const permissionLevel = matchingRoute?.permission || 
      (view.permissions.includes('IsAdminUser') ? 'Admin Only' :
       view.permissions.includes('IsAuthenticated') ? 'Authenticated' : 'Public');
    
    if (permissionLevel !== 'Public') {
      curl += `  -H "Authorization: Bearer <your_token>" \\\n`;
    }
    
    curl += `  -H "Content-Type: application/json"`;
    
    if (requestBody && requestMethod !== 'GET') {
      curl += ` \\\n  -d '${requestBody}'`;
    }
    
    return curl;
  };

  const getPermissionLevel = () => {
    if (matchingRoute?.permission) {
      return matchingRoute.permission;
    }
    
    // Map view permissions to route permission levels
    if (view.permissions.includes('IsAdminUser')) {
      return 'Admin Only';
    } else if (view.permissions.includes('IsAuthenticated')) {
      return 'Authenticated';
    } else {
      return 'Public';
    }
  };

  return (
    <div className="lg:col-span-1 glassmorphism rounded-xl p-6 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">API Test Console</h2>
        {matchingRoute && (
          <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded">
            Route Linked
          </span>
        )}
      </div>
      
      {/* Route Connection Info */}
      {matchingRoute && (
        <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
          <div className="flex items-center gap-2 text-sm">
            <span className="material-symbols-outlined text-blue-400 text-sm">link</span>
            <span className="text-blue-300">Testing route: </span>
            <span className="text-blue-200 font-medium">{matchingRoute.name}</span>
          </div>
        </div>
      )}

      {/* Method and URL */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <select 
            value={requestMethod}
            onChange={(e) => setRequestMethod(e.target.value)}
            className="flex-none w-24 rounded-lg h-10 px-3 text-sm focus:outline-none bg-[#2C2C2C] border border-[#4A4A4A] text-white focus:border-primary focus:ring-2 focus:ring-primary/30"
            disabled={matchingRoute?.http_method} // Disable if route has fixed method
          >
            {getHttpMethodOptions().map(method => (
              <option key={method} value={method} className="text-black">
                {method}
              </option>
            ))}
          </select>
          <div className="flex-1 font-mono text-sm text-gray-300 bg-[#121212] p-2 rounded border border-gray-600 break-all">
            {getEndpointUrl()}
          </div>
        </div>

        {/* Permission Badge */}
        <div className="flex items-center justify-between">
          <span className={`text-xs px-2 py-1 rounded ${
            getPermissionLevel() === 'Admin Only' ? 'bg-red-500/20 text-red-300' :
            getPermissionLevel() === 'Authenticated' ? 'bg-yellow-500/20 text-yellow-300' :
            'bg-green-500/20 text-green-300'
          }`}>
            {getPermissionLevel()} Access
          </span>
          {matchingRoute?.http_method && (
            <span className="text-xs text-gray-400">
              Method fixed by route
            </span>
          )}
        </div>

        <button 
          onClick={handleSendRequest}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-primary text-black font-bold neumorphic-outset hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-black border-t-transparent"></div>
              Testing...
            </>
          ) : (
            <>
              <span className="material-symbols-outlined">send</span>
              Test Endpoint
            </>
          )}
        </button>
      </div>

      {/* Request Parameters */}
      {view.type === 'List' && (
        <div>
          <h3 className="text-sm font-medium text-gray-300 mb-2">Query Parameters</h3>
          <input
            type="text"
            placeholder="page=1&amp;search=example&amp;ordering=-created_at"
            value={requestParams}
            onChange={(e) => setRequestParams(e.target.value)}
            className="w-full rounded-lg h-10 p-2 text-sm focus:outline-none font-mono bg-[#2C2C2C] border border-[#4A4A4A] text-white focus:border-primary focus:ring-2 focus:ring-primary/30"
          />
          <p className="text-xs text-gray-400 mt-1">
            Common: page, limit, search, ordering, filters
          </p>
        </div>
      )}

      {/* Request Body */}
      {requestMethod !== 'GET' && (
        <div>
          <h3 className="text-sm font-medium text-gray-300 mb-2">Request Body</h3>
          <textarea
            placeholder={`Enter JSON request body...\nExample:\n{\n  "name": "Example",\n  "description": "Sample data"\n}`}
            value={requestBody}
            onChange={(e) => setRequestBody(e.target.value)}
            className="w-full rounded-lg h-24 p-3 text-sm focus:outline-none font-mono resize-none bg-[#2C2C2C] border border-[#4A4A4A] text-white focus:border-primary focus:ring-2 focus:ring-primary/30"
          />
        </div>
      )}

      {/* cURL Command */}
      <div>
        <h3 className="text-sm font-medium text-gray-300 mb-2">cURL Command</h3>
        <div className="p-3 rounded-lg bg-[#121212] neumorphic-inset">
          <pre className="text-xs text-gray-300 whitespace-pre-wrap font-mono">
            {getCurlCommand()}
          </pre>
        </div>
      </div>

      {/* Response Viewer */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-white">Response</h3>
          {response && (
            <span className="text-xs font-semibold text-green-400">
              Status: {response.status} {response.statusText}
            </span>
          )}
        </div>
        
        <div className="p-4 rounded-lg bg-[#121212] neumorphic-inset">
          {response ? (
            <>
              <div className="flex items-center justify-between text-sm mb-3">
                <span className="text-green-400">✓ Success</span>
                <span className="text-gray-400">Time: {response.time}ms</span>
              </div>
              <div className="text-sm font-mono overflow-auto max-h-64">
                <pre className="text-gray-300">{JSON.stringify(response.data, null, 2)}</pre>
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <span className="material-symbols-outlined text-4xl mb-2">api</span>
              <p className="text-sm">Click "Test Endpoint" to see the response</p>
              {matchingRoute && (
                <p className="text-xs text-gray-400 mt-2">
                  Testing route: <strong>{matchingRoute.name}</strong>
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApiTestConsole;