import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { projectsAPI, modelsAPI, viewsAPI, urlsAPI } from '../services/api'; // Add urlsAPI import
import Sidebar from '../components/Projects/Sidebar';
import Breadcrumbs from '../components/Projects/Breadcrumbs';
import ViewConfiguration from '../components/Views/ViewConfiguration';
import ApiEndpointPreview from '../components/Views/ApiEndpointPreview';
import ApiTestConsole from '../components/Views/ApiTestConsole';
import ViewsList from '../components/Views/ViewsList';

const Views = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [models, setModels] = useState([]);
  const [views, setViews] = useState([]);
  const [routes, setRoutes] = useState([]); // Add routes state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  
  const [selectedView, setSelectedView] = useState(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [showMobileViewsList, setShowMobileViewsList] = useState(false);

  // Fetch project, models, views, and routes data
  useEffect(() => {
    fetchProjectData();
  }, [projectId]);

  const fetchProjectData = async () => {
    try {
      setLoading(true);
      
      // Fetch project details
      const projectData = await projectsAPI.getProject(projectId);
      setProject(projectData);
      
      // Fetch models for this project
      const modelsData = await modelsAPI.getModels(projectId);
      setModels(modelsData.results || modelsData);
      
      // Fetch views for this project
      const viewsData = await viewsAPI.getViews(projectId);
      const transformedViews = transformViewsData(viewsData.results || viewsData);
      setViews(transformedViews);
      
      // Fetch routes for endpoint preview
      try {
        const routesData = await urlsAPI.getUrls(projectId);
        const transformedRoutes = transformRoutesData(routesData.results || routesData);
        setRoutes(transformedRoutes);
      } catch (routesError) {
        console.warn('Could not fetch routes:', routesError);
        setRoutes([]); // Set empty array if routes endpoint doesn't exist yet
      }
      
      // Set initial selected view
      if (transformedViews.length > 0) {
        setSelectedView(transformedViews[0]);
      }
      
    } catch (err) {
      console.error('Error fetching project data:', err);
      setError('Failed to load project data');
    } finally {
      setLoading(false);
    }
  };

  // Transform backend data to frontend format for views
  const transformViewsData = (backendViews) => {
    return backendViews.map(view => ({
      id: view.id,
      name: view.name,
      model: view.model, // This should be the model ID
      type: view.view_type === 'list' ? 'List' : 'Detail',
      permissions: view.permissions || [],
      pagination: view.pagination_enabled || false, // Ensure boolean
      pageSize: view.page_size || 20,
      fields: view.included_fields?.map(field => 
        typeof field === 'string' ? field : field.field_name || field.name
      ) || [],
      filters: view.filter_fields || [],
      searchFields: view.search_fields || [],
      ordering: view.ordering_fields || [],
      description: view.description || '',
      created_at: view.created_at,
      updated_at: view.updated_at
    }));
  };

  // Transform routes data to frontend format
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
  const transformToBackendFormat = (frontendView) => {
    return {
      name: frontendView.name,
      model: frontendView.model, // This should be the model ID
      view_type: frontendView.type.toLowerCase(), // Convert to backend format
      description: frontendView.description || '',
      permissions: frontendView.permissions,
      pagination_enabled: frontendView.pagination,
      page_size: frontendView.pageSize,
      ordering_fields: frontendView.ordering,
      search_fields: frontendView.searchFields,
      filter_fields: frontendView.filters
    };
  };

  const handleAddView = async () => {
    try {
      if (models.length === 0) {
        alert('No models available. Please create a model first.');
        return;
      }
  
      const defaultModel = models[0];
      const newViewData = {
        name: `NewView${views.length + 1}`,
        model: defaultModel.id,
        view_type: 'list',
        permissions: ['IsAuthenticated'],
        pagination_enabled: true,
        page_size: 20,
        ordering_fields: [],
        search_fields: [],
        filter_fields: [],
        description: ''
      };
  
      console.log('Creating new view:', newViewData);
      
      const createdView = await viewsAPI.createView(projectId, newViewData);
      console.log('View created:', createdView);
      
      // Transform the created view to frontend format and add to local state
      const transformedView = transformViewsData([createdView])[0];
      
      setViews(prevViews => [...prevViews, transformedView]);
      setSelectedView(transformedView);
      
      setIsCreatingNew(true);
      if (isMobile) setShowMobileViewsList(false);
      
    } catch (err) {
      console.error('Error creating view:', err);
      setError(`Failed to create view: ${err.response?.data ? JSON.stringify(err.response.data) : err.message}`);
    }
  };

  const handleDeleteView = async (viewId) => {
    try {
      if (views.length <= 1) {
        alert("You must have at least one view");
        return;
      }
      
      await viewsAPI.deleteView(projectId, viewId);
      
      // Update local state
      const updatedViews = views.filter(view => view.id !== viewId);
      setViews(updatedViews);
      
      if (selectedView?.id === viewId) {
        setSelectedView(updatedViews[0] || null);
      }
      
    } catch (err) {
      console.error('Error deleting view:', err);
      setError(`Failed to delete view: ${err.response?.data ? JSON.stringify(err.response.data) : err.message}`);
    }
  };

  const handleUpdateView = async (updatedView) => {
    try {
      console.log('Updating view:', updatedView);
      
      const backendData = transformToBackendFormat(updatedView);
      const response = await viewsAPI.updateView(projectId, updatedView.id, backendData);
      
      // Update local state instead of refetching
      setViews(prevViews => 
        prevViews.map(view => 
          view.id === updatedView.id ? updatedView : view
        )
      );
      
      // Update selected view if it's the one being edited
      if (selectedView?.id === updatedView.id) {
        setSelectedView(updatedView);
      }
      
      setIsCreatingNew(false);
      
      console.log('View updated successfully');
      
    } catch (err) {
      console.error('Error updating view:', err);
      setError(`Failed to update view: ${err.response?.data ? JSON.stringify(err.response.data) : err.message}`);
      throw err;
    }
  };    

  const handleDuplicateView = async (viewId) => {
    try {
      const viewToDuplicate = views.find(view => view.id === viewId);
      if (viewToDuplicate) {
        const duplicatedViewData = {
          ...transformToBackendFormat(viewToDuplicate),
          name: `${viewToDuplicate.name}_Copy`
        };
        
        const duplicatedView = await viewsAPI.createView(projectId, duplicatedViewData);
        console.log('View duplicated:', duplicatedView);
        
        // Transform and add to local state
        const transformedView = transformViewsData([duplicatedView])[0];
        setViews(prevViews => [...prevViews, transformedView]);
      }
    } catch (err) {
      console.error('Error duplicating view:', err);
      setError(`Failed to duplicate view: ${err.response?.data ? JSON.stringify(err.response.data) : err.message}`);
    }
  };

  const handlePublish = () => {
    // Simulate publishing
    console.log("Publishing views configuration...", views);
    alert(`Successfully published ${views.length} views!`);
  };

  const handleGenerateCode = () => {
    const code = generateDjangoCode(views);
    downloadCode(code, 'views.py');
  };

  const generateDjangoCode = (views) => {
    let code = `from rest_framework import generics, permissions\nfrom .models import ${[...new Set(views.map(v => v.model))].join(', ')}\nfrom .serializers import ${[...new Set(views.map(v => `${v.model}Serializer`))].join(', ')}\n\n`;
    
    views.forEach(view => {
      code += `class ${view.name}(generics.${view.type === 'List' ? 'ListAPIView' : 'RetrieveAPIView'}):\n`;
      code += `    queryset = ${view.model}.objects.all()\n`;
      code += `    serializer_class = ${view.model}Serializer\n`;
      
      if (view.permissions.length > 0) {
        code += `    permission_classes = [permissions.${view.permissions.join(', permissions.')}]\n`;
      }
      
      if (view.pagination && view.type === 'List') {
        code += `    pagination_class = PageNumberPagination\n`;
      }
      
      if (view.searchFields.length > 0) {
        code += `    search_fields = ${JSON.stringify(view.searchFields)}\n`;
      }
      
      if (view.ordering.length > 0) {
        code += `    ordering_fields = ${JSON.stringify(view.ordering.map(f => f.replace('-', '')))}\n`;
        code += `    ordering = ${JSON.stringify(view.ordering)}\n`;
      }
      
      code += `\n`;
    });
    
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

  // Check screen size on mount and resize
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen w-full bg-background-dark font-body text-primary-text overflow-hidden">
        <Sidebar activeTab="views" />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen w-full bg-background-dark font-body text-primary-text overflow-hidden">
        <Sidebar activeTab="views" />
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

  // Prepare available models data for the form
  const availableModels = models.map(model => ({
    name: model.name,
    id: model.id,
    fields: model.fields?.map(field => field.name) || []
  }));

  return (
    <div className="flex h-screen w-full bg-background-dark font-body text-primary-text overflow-hidden">
      <Sidebar 
        onPublish={handlePublish} 
        onGenerateCode={handleGenerateCode}
        activeTab="views" 
      />
      
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex-shrink-0 p-4 lg:p-8">
          <Breadcrumbs 
            projectName={project?.name || "Project"} 
            currentPage="Views" 
            projectId={projectId} 
          />
          
          {/* Mobile Views List Toggle */}
          {isMobile && (
            <button
              onClick={() => setShowMobileViewsList(!showMobileViewsList)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-primary text-black font-bold mb-4 lg:hidden"
            >
              <span className="material-symbols-outlined">
                {showMobileViewsList ? 'close' : 'list'}
              </span>
              {showMobileViewsList ? 'Close Views List' : 'Show Views List'}
            </button>
          )}
        </div>
        
        <div className="flex-1 flex min-h-0">
          {/* Views List Sidebar - Responsive behavior */}
          <div className={`
            ${isMobile 
              ? `fixed inset-0 z-50 bg-[#1A1A1A] transform transition-transform duration-300 ${
                  showMobileViewsList ? 'translate-x-0' : '-translate-x-full'
                }` 
              : 'w-80 border-r border-gray-700 bg-[#1A1A1A]'
            } flex flex-col`}
          >
            <ViewsList
              views={views}
              selectedView={selectedView}
              onSelectView={(view) => {
                setSelectedView(view);
                if (isMobile) setShowMobileViewsList(false);
              }}
              onAddView={handleAddView}
              onDeleteView={handleDeleteView}
              onDuplicateView={handleDuplicateView}
            />
          </div>
          
          {/* Main Content - Scrollable area */}
          <div className={`
            flex-1 overflow-auto p-4 lg:p-8 transition-all duration-300
            ${isMobile && showMobileViewsList ? 'opacity-0 pointer-events-none' : 'opacity-100'}
          `}>
            {selectedView ? (
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 min-h-0">
                <ViewConfiguration 
                  view={selectedView}
                  onUpdateView={handleUpdateView}
                  availableModels={availableModels}
                  isCreatingNew={isCreatingNew}
                />
                <ApiEndpointPreview 
                  view={selectedView}
                  project={project}
                  routes={routes} // Now routes is defined
                />
                <ApiTestConsole 
                  view={selectedView}
                  project={project}
                  routes={routes}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <span className="material-symbols-outlined text-6xl text-gray-500 mb-4">api</span>
                  <h3 className="text-xl text-white mb-2">No Views Yet</h3>
                  <p className="text-gray-400 mb-4">Create your first view to get started</p>
                  <button 
                    onClick={handleAddView}
                    className="bg-primary text-black font-bold py-3 px-6 rounded-lg hover:bg-primary/80 transition-colors"
                  >
                    Create First View
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

export default Views;