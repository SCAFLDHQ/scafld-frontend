import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { projectsAPI, urlsAPI, viewsAPI } from '../services/api';
import Sidebar from '../components/Projects/Sidebar';
import Breadcrumbs from '../components/Projects/Breadcrumbs';
import RouteCanvas from '../components/URLS/RouteCanvas';
import LiveUrlPreview from '../components/URLS/LiveUrlPreview';
import RouteConfiguration from '../components/URLS/RouteConfiguration';

const URLs = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [views, setViews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [isAddingRoute, setIsAddingRoute] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Fetch project, routes, and views data
  useEffect(() => {
    fetchProjectData();
  }, [projectId]);

  const fetchProjectData = async () => {
    try {
      setLoading(true);
      
      // Fetch project details
      const projectData = await projectsAPI.getProject(projectId);
      setProject(projectData);
      
      // Fetch routes for this project
      const routesData = await urlsAPI.getUrls(projectId);
      const transformedRoutes = transformRoutesData(routesData.results || routesData);
      setRoutes(transformedRoutes);
      
      // Fetch views for route assignment
      const viewsData = await viewsAPI.getViews(projectId);
      setViews(viewsData.results || viewsData);
      
      // Set initial selected route
      if (transformedRoutes.length > 0) {
        setSelectedRoute(transformedRoutes[0]);
      }
      
    } catch (err) {
      console.error('Error fetching project data:', err);
      setError('Failed to load project data');
    } finally {
      setLoading(false);
    }
  };

  // Transform backend data to frontend format
  const transformRoutesData = (backendRoutes) => {
    return backendRoutes.map(route => ({
      id: route.id,
      path: route.path,
      name: route.name,
      description: route.description || '',
      permission: route.permission_level || 'Public',
      view: route.associated_view || '',
      namespace: route.namespace || '',
      regex: route.custom_regex || '',
      http_method: route.http_method || 'GET',
      is_selected: route.is_selected || false,
      created_at: route.created_at,
      updated_at: route.updated_at
    }));
  };

  // Transform frontend data to backend format
  const transformToBackendFormat = (frontendRoute) => {
    return {
      path: frontendRoute.path,
      name: frontendRoute.name,
      description: frontendRoute.description,
      permission_level: frontendRoute.permission,
      associated_view: frontendRoute.view,
      namespace: frontendRoute.namespace,
      custom_regex: frontendRoute.regex,
      http_method: frontendRoute.http_method,
      is_selected: frontendRoute.is_selected
    };
  };

  const handleAddRoute = async () => {
    try {
      const newRouteData = {
        path: '/api/new/',
        name: `NewRoute${routes.length + 1}`,
        description: 'New route description',
        permission_level: 'Public',
        associated_view: '',
        namespace: '',
        custom_regex: '',
        http_method: 'GET',
        is_selected: true
      };

      console.log('Creating new route:', newRouteData);
      
      const createdRoute = await urlsAPI.createUrl(projectId, newRouteData);
      console.log('Route created:', createdRoute);
      
      // Transform and add to local state
      const transformedRoute = transformRoutesData([createdRoute])[0];
      
      // Update all routes to deselect them
      const updatedRoutes = routes.map(route => ({
        ...route,
        is_selected: false
      }));
      
      setRoutes([...updatedRoutes, transformedRoute]);
      setSelectedRoute(transformedRoute);
      setIsAddingRoute(true);
      setHasUnsavedChanges(false);
      
    } catch (err) {
      console.error('Error creating route:', err);
      setError(`Failed to create route: ${err.response?.data ? JSON.stringify(err.response.data) : err.message}`);
    }
  };

  const handleSelectRoute = (route) => {
    if (hasUnsavedChanges && selectedRoute) {
      const confirmSwitch = window.confirm('You have unsaved changes. Are you sure you want to switch routes?');
      if (!confirmSwitch) return;
    }

    const updatedRoutes = routes.map(r => ({
      ...r,
      is_selected: r.id === route.id
    }));
    setRoutes(updatedRoutes);
    setSelectedRoute(route);
    setIsAddingRoute(false);
    setHasUnsavedChanges(false);
  };

  const handleUpdateRouteLocal = (updatedRoute) => {
    // Only update local state, don't call API
    setSelectedRoute(updatedRoute);
    setHasUnsavedChanges(true);
  };

  const handleSaveRoute = async () => {
    if (!selectedRoute) return;

    try {
      console.log('Saving route:', selectedRoute);
      
      const backendData = transformToBackendFormat(selectedRoute);
      
      if (isAddingRoute) {
        // For new routes, we already created it, so update it
        await urlsAPI.updateUrl(projectId, selectedRoute.id, backendData);
      } else {
        // For existing routes, update
        await urlsAPI.updateUrl(projectId, selectedRoute.id, backendData);
      }
      
      // Update the route in the routes list
      const updatedRoutes = routes.map(route => 
        route.id === selectedRoute.id ? selectedRoute : route
      );
      
      setRoutes(updatedRoutes);
      setHasUnsavedChanges(false);
      setIsAddingRoute(false);
      
      console.log('Route saved successfully');
      
    } catch (err) {
      console.error('Error saving route:', err);
      setError(`Failed to save route: ${err.response?.data ? JSON.stringify(err.response.data) : err.message}`);
      throw err;
    }
  };

  const handleDeleteRoute = async (routeId) => {
    try {
      if (routes.length <= 1) {
        alert("You must have at least one route");
        return;
      }
      
      await urlsAPI.deleteUrl(projectId, routeId);
      
      // Update local state
      const updatedRoutes = routes.filter(route => route.id !== routeId);
      setRoutes(updatedRoutes);
      
      if (selectedRoute?.id === routeId) {
        setSelectedRoute(updatedRoutes[0] || null);
      }
      
      setHasUnsavedChanges(false);
      
    } catch (err) {
      console.error('Error deleting route:', err);
      setError(`Failed to delete route: ${err.response?.data ? JSON.stringify(err.response.data) : err.message}`);
    }
  };

  const handlePublish = () => {
    console.log("Publishing URL configuration...", routes);
    alert(`Successfully published ${routes.length} routes!`);
  };

  const handleGenerateCode = () => {
    const code = generateDjangoUrlsCode(routes);
    downloadCode(code, 'urls.py');
  };

  const generateDjangoUrlsCode = (routes) => {
    let code = `from django.urls import path\nfrom . import views\n\nurlpatterns = [\n`;
    
    routes.forEach(route => {
      const djangoPath = route.path
        .replace(/{(\w+)}/g, '<$1>')
        .replace(/\/$/, '');
      
      code += `    path('${djangoPath}', views.${route.view || route.name}, name='${route.name.toLowerCase()}'),\n`;
    });
    
    code += `]\n`;
    return code;
  };

  const downloadCode = (content, filename) => {
    const blob = new Blob([content], { type: 'text/x-python' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full bg-background-dark font-body text-primary-text overflow-hidden">
        <Sidebar activeTab="urls" />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen w-full bg-background-dark font-body text-primary-text overflow-hidden">
        <Sidebar activeTab="urls" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-400 text-xl mb-4">{error}</p>
            <button 
              onClick={fetchProjectData}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-background-dark font-body text-primary-text overflow-hidden">
      <Sidebar 
        onPublish={handlePublish} 
        onGenerateCode={handleGenerateCode}
        activeTab="urls" 
      />
      
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex-shrink-0 p-8">
          <Breadcrumbs 
            projectName={project?.name || "Project"} 
            currentPage="URLs" 
            projectId={projectId} 
          />
        </div>
        
        <div className="flex-1 flex min-h-0">
          {/* Main Canvas Area */}
          <div className="flex-1 flex flex-col min-h-0">
            <RouteCanvas
              routes={routes}
              selectedRoute={selectedRoute}
              onSelectRoute={handleSelectRoute}
              onAddRoute={handleAddRoute}
              onDeleteRoute={handleDeleteRoute}
            />
          </div>
          
          {/* Side Panel with Rounded Edges */}
          <div className="w-[380px] shrink-0 h-full flex flex-col glassmorphism border-l border-gray-700 rounded-l-2xl overflow-hidden">
            {selectedRoute ? (
              <>
                <RouteConfiguration
                  route={selectedRoute}
                  onUpdateRoute={handleUpdateRouteLocal}
                  onSaveChanges={handleSaveRoute}
                  isNew={isAddingRoute}
                  availableViews={views}
                  hasUnsavedChanges={hasUnsavedChanges}
                />
                {/* <LiveUrlPreview 
                  route={selectedRoute} 
                  framework={project?.framework}
                /> */}
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center p-6">
                <div className="text-center">
                  <span className="material-symbols-outlined text-6xl text-gray-500 mb-4">route</span>
                  <h3 className="text-xl text-white mb-2">No Routes Yet</h3>
                  <p className="text-gray-400 mb-4">Create your first route to get started</p>
                  <button 
                    onClick={handleAddRoute}
                    className="bg-primary text-black font-bold py-3 px-6 rounded-lg hover:bg-primary/80 transition-colors"
                  >
                    Create First Route
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default URLs;