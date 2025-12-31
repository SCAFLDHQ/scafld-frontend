import React from 'react';

const ApiEndpointPreview = ({ view, mockResponse, routes = [], project }) => {
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

  const getEndpointUrl = () => {
    // Use the route path if available, otherwise generate default
    if (matchingRoute) {
      return matchingRoute.path;
    }
    
    // Fallback to default generation
    const base = `/api/${view.model.toLowerCase()}s/`;
    return view.type === 'Detail' ? `${base}{id}/` : base;
  };

  const getHttpMethod = () => {
    // Use the route HTTP method if available
    if (matchingRoute?.http_method) {
      return matchingRoute.http_method;
    }
    
    // Default based on view type
    return view.type === 'Detail' ? 'GET' : 'GET';
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

  const getGeneratedCode = () => {
    const framework = project?.framework || 'django';

    if (framework === 'django') {
      const permissionClasses = view.permissions.length > 0
        ? `permissions.${view.permissions.join(', permissions.')}`
        : 'permissions.AllowAny';

      let code = `from rest_framework import generics, permissions\n`;
      code += `from .models import ${view.model}\n`;
      code += `from .serializers import ${view.model}Serializer\n\n`;

      code += `class ${view.name}(generics.${view.type === 'List' ? 'ListAPIView' : 'RetrieveAPIView'}):\n`;
      code += `    queryset = ${view.model}.objects.all()\n`;
      code += `    serializer_class = ${view.model}Serializer\n`;
      code += `    permission_classes = [${permissionClasses}]\n`;

      if (view.pagination && view.type === 'List') {
        code += `    pagination_class = PageNumberPagination\n`;
      }

      if (view.filters.length > 0) {
        code += `    filterset_fields = ${JSON.stringify(view.filters.map(f => f.split('__')[0]))}\n`;
      }

      if (view.fields.length > 0) {
        code += `    # Fields: ${view.fields.join(', ')}\n`;
      }

      return code;
    } else if (framework === 'flask') {
      const permissionDecorator = view.permissions.length > 0
        ? `@${view.permissions.join('@')}\n`
        : '';

      let code = `from flask import Blueprint, jsonify\n`;
      code += `from flask_jwt_extended import jwt_required\n`;
      code += `from .models import ${view.model}\n`;
      code += `from .serializers import ${view.model}Serializer\n\n`;

      code += `bp = Blueprint('${view.name.toLowerCase()}', __name__)\n\n`;

      code += `${permissionDecorator}@bp.route('/${view.model.toLowerCase()}${view.type === 'List' ? 's' : '/<int:id>'}', methods=['GET'])\n`;
      code += `def ${view.name.toLowerCase()}():\n`;
      code += `    ${view.type === 'List' ? `items = ${view.model}.query.all()` : `item = ${view.model}.query.get_or_404(id)`}\n`;
      code += `    ${view.type === 'List' ? `return jsonify([item.serialize() for item in items])` : `return jsonify(item.serialize())`}\n`;

      return code;
    } else if (framework === 'express') {
      const authMiddleware = view.permissions.length > 0
        ? `, ${view.permissions.map(p => `authMiddleware.${p.toLowerCase()}`).join(', ')}`
        : '';

      let code = `const express = require('express');\n`;
      code += `const router = express.Router();\n`;
      code += `const ${view.model} = require('../models/${view.model}');\n\n`;

      code += `router.get('/${view.model.toLowerCase()}${view.type === 'List' ? 's' : '/:id'}${authMiddleware}, async (req, res) => {\n`;
      code += `  try {\n`;
      code += `    ${view.type === 'List' ? `const items = await ${view.model}.find();` : `const item = await ${view.model}.findById(req.params.id);`}\n`;
      code += `    ${view.type === 'List' ? `res.json(items);` : `if (!item) return res.status(404).json({ message: '${view.model} not found' }); res.json(item);`}\n`;
      code += `  } catch (error) {\n`;
      code += `    res.status(500).json({ message: error.message });\n`;
      code += `  }\n`;
      code += `});\n\n`;

      code += `module.exports = router;\n`;

      return code;
    }

    return '// Unsupported framework';
  };

  const getResponseSchema = () => {
    if (view.type === 'List' && view.pagination) {
      return {
        count: 42,
        next: view.pagination ? `/api/${view.model.toLowerCase()}s/?page=2` : null,
        previous: null,
        results: view.fields.map(field => ({
          [field]: getFieldExample(field, view.model)
        }))
      };
    } else {
      const schema = {};
      view.fields.forEach(field => {
        schema[field] = getFieldExample(field, view.model);
      });
      return schema;
    }
  };

  const getFieldExample = (field, model) => {
    const examples = {
      User: {
        id: 1,
        username: "john_doe",
        email: "john@example.com",
        first_name: "John",
        last_name: "Doe",
        is_active: true,
        date_joined: "2023-01-15T10:30:00Z",
        last_login: "2023-12-01T08:20:00Z"
      },
      Product: {
        id: 1,
        name: "Wireless Headphones",
        description: "High-quality wireless headphones",
        price: "199.99",
        category: "electronics",
        in_stock: true,
        created_at: "2023-11-01T14:20:00Z",
        updated_at: "2023-12-01T09:15:00Z"
      },
      Order: {
        id: 1,
        user: 1,
        products: [1, 2, 3],
        total_amount: "299.97",
        status: "completed",
        created_at: "2023-12-01T10:00:00Z",
        updated_at: "2023-12-01T10:30:00Z"
      }
    };

    return examples[model]?.[field] !== undefined 
      ? examples[model][field] 
      : field.includes('id') ? 1 
      : field.includes('name') ? "example"
      : field.includes('email') ? "example@example.com"
      : field.includes('date') || field.includes('_at') ? "2023-01-01T00:00:00Z"
      : null;
  };

  return (
    <div className="lg:col-span-1 glassmorphism rounded-xl p-6 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">API Endpoint Preview</h2>
        {matchingRoute && (
          <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded">
            Route Linked
          </span>
        )}
      </div>
      
      {/* Dynamic Endpoint Card */}
      <div className="p-4 rounded-lg bg-[#121212] neumorphic-inset">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-semibold text-primary bg-primary/20 px-2 py-1 rounded">
            {getHttpMethod()}
          </span>
          <span className="text-xs text-gray-400 bg-gray-700/50 px-2 py-1 rounded">
            {view.type === 'List' ? 'LIST' : 'DETAIL'}
          </span>
          {matchingRoute && (
            <span className="text-xs text-green-400 bg-green-400/20 px-2 py-1 rounded">
              ROUTED
            </span>
          )}
        </div>
        <p className="font-mono text-sm text-gray-300 break-all">{getEndpointUrl()}</p>
        <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
          <span>Permissions: {getPermissionLevel()}</span>
          <span>•</span>
          <span>Fields: {view.fields.length}</span>
          {matchingRoute && (
            <>
              <span>•</span>
              <span className="text-green-400">Route: {matchingRoute.name}</span>
            </>
          )}
        </div>
        
        {/* Route Information */}
        {matchingRoute && (
          <div className="mt-3 pt-3 border-t border-gray-700">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span className="material-symbols-outlined text-sm text-green-400">link</span>
              <span>Connected to route: </span>
              <span className="text-green-300 font-medium">{matchingRoute.name}</span>
            </div>
            {matchingRoute.description && (
              <p className="text-xs text-gray-500 mt-1">{matchingRoute.description}</p>
            )}
          </div>
        )}
        
        {!matchingRoute && (
          <div className="mt-3 pt-3 border-t border-gray-700">
            <div className="flex items-center gap-2 text-xs text-yellow-400">
              <span className="material-symbols-outlined text-sm">link_off</span>
              <span>No route connected</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Create a route in the URLs section to connect this view
            </p>
          </div>
        )}
      </div>

      {/* Dynamic Generated Code */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-white">Generated Code</h3>
          <span className="text-xs text-gray-400">
            {project?.framework === 'django' ? 'Django REST Framework' :
             project?.framework === 'express' ? 'Express.js' :
             project?.framework === 'flask' ? 'Flask' : 'Django REST Framework'}
          </span>
        </div>
        <div className="p-4 rounded-lg bg-[#121212] neumorphic-inset text-sm font-mono overflow-x-auto max-h-64">
          <pre><code className="text-gray-300">{getGeneratedCode()}</code></pre>
        </div>
      </div>

      {/* Dynamic Response Schema */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-white">Response Schema</h3>
          <span className="text-xs text-gray-400">
            {view.type === 'List' && view.pagination ? 'Paginated' : 'Single'}
          </span>
        </div>
        <div className="p-4 rounded-lg bg-[#121212] neumorphic-inset text-sm font-mono overflow-x-auto max-h-64">
          <pre><code className="text-gray-300">
            {JSON.stringify(getResponseSchema(), null, 2)}
          </code></pre>
        </div>
      </div>
      
      {/* URL Configuration Info */}
      {matchingRoute && (
        <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-blue-400 text-sm">info</span>
            <h4 className="text-blue-300 text-sm font-semibold">URL Configuration</h4>
          </div>
          <p className="text-xs text-blue-200/80">
            This view is connected to the <strong>{matchingRoute.name}</strong> route. 
            The endpoint URL and permissions are inherited from the route configuration.
          </p>
        </div>
      )}
    </div>
  );
};

export default ApiEndpointPreview;