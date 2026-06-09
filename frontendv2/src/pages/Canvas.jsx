import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ReactFlow,
  Background,
  MiniMap,
  Panel,
  useNodesState,
  useEdgesState,
  useReactFlow,
  addEdge,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import {
  Loader2, Plus, Save, Sparkles, Database, CheckCircle2, AlertCircle,
  ZoomIn, ZoomOut, Maximize2, GitBranch, MousePointer2, MessageSquare, LayoutGrid, X,
} from 'lucide-react';

import apiService from '../services/api';
import ModelNode from '../components/Canvas/ModelNode';
import FieldModal from '../components/Canvas/FieldModal';
import AddModelModal from '../components/Canvas/AddModelModal';
import RelationshipModal from '../components/Canvas/RelationshipModal';
import CanvasSidebar from '../components/Canvas/CanvasSidebar';
import CanvasAIChat from '../components/Canvas/CanvasAIChat';
import ProjectSettingsModal from '../components/Canvas/ProjectSettingsModal';

const NODE_TYPES = { modelNode: ModelNode };

function CanvasDock({ onAddModel, saving, onSave, onToggleChat, chatOpen, onRearrange }) {
  const { zoomIn, zoomOut, fitView } = useReactFlow();

  const btn = 'flex items-center gap-1.5 px-3 py-2 text-xs text-white/60 hover:text-white transition-colors rounded-lg hover:bg-white/5 disabled:opacity-40';
  const divider = 'w-px h-5 bg-white/10 mx-1';

  return (
    <div className="flex items-center gap-0.5 bg-[#0d0d0d]/95 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl px-2 py-1.5 mb-3">

      {/* Add tools */}
      <button onClick={onAddModel} className={btn} title="Add model">
        <Plus className="w-4 h-4 text-[#a78bfa]" />
        <span>Add Model</span>
      </button>

      <button
        className={btn}
        title="Hover over a field then drag the purple dot to another model to create a relationship"
      >
        <GitBranch className="w-4 h-4 text-[#a78bfa]" />
        <span>Relationship</span>
      </button>

      <div className={divider} />

      {/* Zoom controls */}
      <button onClick={() => zoomOut({ duration: 200 })} className={btn} title="Zoom out">
        <ZoomOut className="w-4 h-4" />
      </button>

      <button onClick={() => fitView({ padding: 0.35, maxZoom: 0.65, duration: 300 })} className={btn} title="Fit view">
        <Maximize2 className="w-4 h-4" />
      </button>

      <button onClick={() => zoomIn({ duration: 200 })} className={btn} title="Zoom in">
        <ZoomIn className="w-4 h-4" />
      </button>

      <div className={divider} />

      {/* Rearrange */}
      <button onClick={onRearrange} className={btn} title="Auto-arrange all models into a grid">
        <LayoutGrid className="w-4 h-4 text-[#a78bfa]" />
        <span>Rearrange</span>
      </button>

      <div className={divider} />

      {/* AI Chat toggle */}
      <button
        onClick={onToggleChat}
        className={`${btn} ${chatOpen ? 'text-[#a78bfa] bg-[#29142e]/40' : ''}`}
        title="AI Chat — iterate on your schema with AI"
      >
        <MessageSquare className="w-4 h-4" />
        <span>AI Chat</span>
      </button>

      <div className={divider} />

      {/* Save */}
      <button onClick={onSave} disabled={saving} className={btn} title="Save positions">
        {saving
          ? <Loader2 className="w-4 h-4 animate-spin" />
          : <Save className="w-4 h-4" />
        }
        <span>{saving ? 'Saving…' : 'Save'}</span>
      </button>
    </div>
  );
}

const EDGE_STYLES = {
  ForeignKey: {
    style: { stroke: '#7c3aed', strokeWidth: 1.5, cursor: 'pointer' },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#7c3aed' },
  },
  ManyToManyField: {
    style: { stroke: '#06b6d4', strokeWidth: 1.5, strokeDasharray: '6 3', cursor: 'pointer' },
    markerEnd: { type: MarkerType.Arrow, color: '#06b6d4' },
    markerStart: { type: MarkerType.Arrow, color: '#06b6d4' },
  },
  OneToOneField: {
    style: { stroke: '#10b981', strokeWidth: 1.5, cursor: 'pointer' },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981' },
  },
};
const REL_ABBR = { ForeignKey: 'FK', ManyToManyField: 'M2M', OneToOneField: 'O2O' };

function irToFlow(ir, callbacks) {
  const models = ir?.models || [];
  const endpoints = ir?.endpoints || [];
  const endpointMap = {};
  endpoints.forEach(ep => { endpointMap[ep.model] = ep; });

  const nodes = models.map((model, i) => ({
    id: model.id || model.name,
    type: 'modelNode',
    position: {
      x: model.position_x ?? (i % 3) * 340 + 60,
      y: model.position_y ?? Math.floor(i / 3) * 300 + 60,
    },
    data: { model, endpoint: endpointMap[model.name], ...callbacks },
  }));

  const edges = [];
  models.forEach(model => {
    (model.relationships || []).forEach((rel, ri) => {
      const targetId = models.find(m => m.name === rel.to_model)?.id || rel.to_model;
      if (!targetId) return;
      const rtype = rel.type || rel.relationship_type || 'ForeignKey';
      const estyle = EDGE_STYLES[rtype] || EDGE_STYLES.ForeignKey;
      edges.push({
        id: rel.id || `${model.name}-${rel.field_name}-${ri}`,
        source: model.id || model.name,
        target: targetId,
        label: `${rel.field_name} (${REL_ABBR[rtype] || 'FK'})`,
        labelStyle: { fill: '#a78bfa', fontSize: 10 },
        labelBgStyle: { fill: '#1a1a1a', fillOpacity: 0.9 },
        ...estyle,
        data: { relId: rel.id },
      });
    });
  });

  return { nodes, edges };
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click();
  URL.revokeObjectURL(url); document.body.removeChild(a);
}

export default function Canvas() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [irData, setIrData] = useState(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [exporting, setExporting] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [promptCopied, setPromptCopied] = useState(false);
  const [toast, setToast] = useState(null); // { type: 'error'|'success', msg: string }

  const showToast = useCallback((type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  }, []);

  // Modals
  const [addModelOpen, setAddModelOpen] = useState(false);
  const [fieldModalModel, setFieldModalModel] = useState(null);
  const [pendingConnection, setPendingConnection] = useState(null);
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [projectSettingsOpen, setProjectSettingsOpen] = useState(false);

  const autoSaveTimer = useRef(null);
  const pendingPositions = useRef({});

  // ── Callbacks passed into each node ──────────────────────────────────────
  const handleAddField = useCallback((model) => setFieldModalModel(model), []);

  const handleDeleteModel = useCallback(async (model) => {
    if (!window.confirm(`Delete model "${model.name}"? This will remove all its fields and relationships.`)) return;
    const res = await apiService.deleteModel(model.id);
    if (res.ok || res.status === 204) {
      setNodes(ns => ns.filter(n => n.id !== (model.id || model.name)));
      setEdges(es => es.filter(e => e.source !== (model.id || model.name) && e.target !== (model.id || model.name)));
    }
  }, [setNodes, setEdges]);

  const handleDeleteField = useCallback(async (field, model) => {
    if (!window.confirm(`Delete field "${field.name}"?`)) return;
    const res = await apiService.deleteField(field.id);
    if (res.ok || res.status === 204) {
      setNodes(ns => ns.map(n => {
        if (n.id !== (model.id || model.name)) return n;
        const updatedModel = { ...n.data.model, fields: n.data.model.fields.filter(f => f.id !== field.id) };
        return { ...n, data: { ...n.data, model: updatedModel } };
      }));
    }
  }, [setNodes]);

  const handleEdgeClick = useCallback(async (event, edge) => {
    const relId = edge.data?.relId || edge.id;
    if (!relId || !window.confirm('Delete this relationship?')) return;
    const res = await apiService.deleteRelationship(relId);
    if (res.ok || res.status === 204) {
      setEdges(es => es.filter(e => e.id !== edge.id));
      // Also remove from source node's relationship list
      setNodes(ns => ns.map(n => {
        if (n.id !== edge.source) return n;
        const updatedModel = { ...n.data.model, relationships: (n.data.model.relationships || []).filter(r => r.id !== relId) };
        return { ...n, data: { ...n.data, model: updatedModel } };
      }));
    }
  }, [setEdges, setNodes]);

  const handleDeleteRelationship = useCallback(async (rel, model) => {
    if (!window.confirm(`Delete relationship "${rel.field_name}"?`)) return;
    const res = await apiService.deleteRelationship(rel.id);
    if (res.ok || res.status === 204) {
      // Remove edge from canvas
      setEdges(es => es.filter(e => e.id !== rel.id && e.data?.relId !== rel.id));
      // Remove from node's relationship list
      setNodes(ns => ns.map(n => {
        if (n.id !== (model.id || model.name)) return n;
        const updatedModel = { ...n.data.model, relationships: n.data.model.relationships.filter(r => r.id !== rel.id) };
        return { ...n, data: { ...n.data, model: updatedModel } };
      }));
    }
  }, [setEdges, setNodes]);

  const nodeCallbacks = useMemo(() => ({
    onAddField: handleAddField,
    onDeleteModel: handleDeleteModel,
    onDeleteField: handleDeleteField,
    onDeleteRelationship: handleDeleteRelationship,
  }), [handleAddField, handleDeleteModel, handleDeleteField, handleDeleteRelationship]);

  // ── Load ───────────────────────────────────────────────────────────────
  const loadCanvas = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const [projectRes, irRes] = await Promise.all([
        apiService.getProject(projectId),
        apiService.getProjectIR(projectId),
      ]);
      if (!projectRes.ok) { setError('Project not found.'); return; }
      if (!irRes.ok) { setError('Could not load project schema.'); return; }

      const proj = await projectRes.json();
      const ir = await irRes.json();
      setProject(proj);
      setIrData(ir);

      const { nodes: n, edges: e } = irToFlow(ir.ir || {}, nodeCallbacks);
      setNodes(n);
      setEdges(e);
    } catch (err) {
      if (!silent) setError('Failed to load canvas.');
    } finally {
      if (!silent) setLoading(false);
    }
  }, [projectId]);

  useEffect(() => { loadCanvas(); }, [loadCanvas]);
  useEffect(() => () => clearTimeout(autoSaveTimer.current), []);

  // ── Auto-save positions ─────────────────────────────────────────────────
  const scheduleAutoSave = useCallback(() => {
    clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(() => savePositions(), 30_000);
  }, []);

  const handleNodesChange = useCallback((changes) => {
    onNodesChange(changes);
    changes.forEach(c => {
      if (c.type === 'position' && c.position) {
        pendingPositions.current[c.id] = c.position;
        scheduleAutoSave();
      }
    });
  }, [onNodesChange, scheduleAutoSave]);

  const savePositions = useCallback(async () => {
    const positions = Object.entries(pendingPositions.current).map(([model_id, pos]) => ({
      model_id, x: pos.x, y: pos.y,
    }));
    if (!positions.length) return;
    setSaving(true);
    try {
      await apiService.updateModelPositions(positions);
      pendingPositions.current = {};
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(null), 2000);
    } catch { setSaveStatus('error'); }
    finally { setSaving(false); }
  }, []);

  // ── Rearrange (hierarchical tree by relationships) ──────────────────────
  const handleRearrange = useCallback(() => {
    if (nodes.length === 0) return;

    // Build adjacency and in-degree from current edges
    const adj = {};
    const inDegree = {};
    nodes.forEach(n => { adj[n.id] = []; inDegree[n.id] = 0; });
    edges.forEach(e => {
      if (adj[e.source] && inDegree[e.target] !== undefined) {
        adj[e.source].push(e.target);
        inDegree[e.target]++;
      }
    });

    // BFS from roots (in-degree 0) to assign depth levels — visited set prevents cycle loops
    const levels = {};
    const visited = new Set();
    const roots = nodes.map(n => n.id).filter(id => inDegree[id] === 0);
    const startNodes = roots.length > 0 ? roots : nodes.map(n => n.id);
    startNodes.forEach(id => { levels[id] = 0; visited.add(id); });

    const queue = [...startNodes];
    let qi = 0;
    while (qi < queue.length) {
      const cur = queue[qi++];
      for (const next of adj[cur]) {
        if (!visited.has(next)) {
          visited.add(next);
          levels[next] = levels[cur] + 1;
          queue.push(next);
        }
      }
    }

    // Any nodes not reached (isolated) go to the bottom
    const maxLevel = Object.values(levels).reduce((m, v) => Math.max(m, v), 0);
    nodes.forEach(n => { if (levels[n.id] === undefined) levels[n.id] = maxLevel + 1; });

    // Group by level
    const byLevel = {};
    nodes.forEach(n => {
      const lvl = levels[n.id];
      (byLevel[lvl] = byLevel[lvl] || []).push(n.id);
    });

    const NODE_W = 280;
    const H_GAP = 80;
    const V_GAP = 120;
    const COL_STEP = NODE_W + H_GAP;
    const ROW_STEP = 260 + V_GAP;

    const maxCount = Math.max(...Object.values(byLevel).map(arr => arr.length));
    const totalWidth = maxCount * COL_STEP - H_GAP;

    const updated = nodes.map(node => {
      const lvl = levels[node.id];
      const group = byLevel[lvl];
      const idx = group.indexOf(node.id);
      const groupWidth = group.length * COL_STEP - H_GAP;
      const x = (totalWidth - groupWidth) / 2 + idx * COL_STEP + 60;
      const y = lvl * ROW_STEP + 60;
      pendingPositions.current[node.id] = { x, y };
      return { ...node, position: { x, y } };
    });

    setNodes(updated);
    savePositions();
  }, [nodes, edges, setNodes, savePositions]);

  // ── Add model ───────────────────────────────────────────────────────────
  const handleAddModel = useCallback(async (name) => {
    const res = await apiService.createModel({
      project: projectId,
      name,
      position_x: 60 + nodes.length * 20,
      position_y: 60 + nodes.length * 20,
    });
    if (res.ok) {
      const model = await res.json();
      const newNode = {
        id: model.id,
        type: 'modelNode',
        position: { x: model.position_x, y: model.position_y },
        data: { model: { ...model, fields: [], relationships: [] }, ...nodeCallbacks },
      };
      setNodes(ns => [...ns, newNode]);
      setAddModelOpen(false);
    }
  }, [nodes.length, projectId, setNodes, nodeCallbacks]);

  // ── Add field ───────────────────────────────────────────────────────────
  const handleSaveField = useCallback(async (fieldData) => {
    const res = await apiService.createField(fieldData);
    if (res.ok) {
      const field = await res.json();
      setNodes(ns => ns.map(n => {
        if (n.id !== fieldModalModel.id) return n;
        const updatedModel = { ...n.data.model, fields: [...(n.data.model.fields || []), field] };
        return { ...n, data: { ...n.data, model: updatedModel } };
      }));
      setFieldModalModel(null);
    } else {
      const err = await res.json();
      throw new Error(JSON.stringify(err));
    }
  }, [fieldModalModel, setNodes]);

  // ── Connect → open relationship modal ──────────────────────────────────
  const onConnect = useCallback((params) => {
    const fromNode = nodes.find(n => n.id === params.source);
    const toNode = nodes.find(n => n.id === params.target);
    if (!fromNode || !toNode || fromNode.id === toNode.id) return;

    // Resolve which field the drag started from (handle id: f-{fieldId|idxN})
    let sourceField = null;
    const hid = params.sourceHandle;
    if (hid?.startsWith('f-')) {
      const key = hid.slice(2);
      const flds = fromNode.data.model.fields || [];
      if (key.startsWith('idx')) {
        sourceField = flds[parseInt(key.slice(3))] ?? null;
      } else {
        sourceField = flds.find(f => String(f.id) === key) ?? null;
      }
    }

    setPendingConnection({ fromNode, toNode, sourceField, params });
  }, [nodes]);

  const handleRelationshipSave = useCallback(async ({ relationship_type, field_name, on_delete }) => {
    if (!pendingConnection) return;
    const { fromNode, toNode, params } = pendingConnection;

    const res = await apiService.createRelationship({
      from_model: fromNode.data.model.id,
      to_model: toNode.data.model.id,
      relationship_type,
      field_name,
      on_delete,
    });

    if (res.ok) {
      const rel = await res.json();
      const estyle = EDGE_STYLES[relationship_type] || EDGE_STYLES.ForeignKey;
      const edge = {
        ...params,
        id: rel.id,
        label: `${field_name} (${REL_ABBR[relationship_type] || 'FK'})`,
        labelStyle: { fill: '#a78bfa', fontSize: 10 },
        labelBgStyle: { fill: '#1a1a1a', fillOpacity: 0.9 },
        ...estyle,
        data: { relId: rel.id },
      };
      setEdges(eds => addEdge(edge, eds));
      setNodes(ns => ns.map(n => {
        if (n.id !== fromNode.id) return n;
        return { ...n, data: { ...n.data, model: { ...n.data.model, relationships: [...(n.data.model.relationships || []), rel] } } };
      }));
    }
    setPendingConnection(null);
  }, [pendingConnection, setEdges, setNodes]);

  // ── Export ──────────────────────────────────────────────────────────────
  const handleExport = async (format) => {
    setExporting(true);
    try {
      const res = await apiService.exportProject(projectId, format);
      if (!res.ok) { showToast('error', 'Export failed. Try again.'); return; }
      if (format === 'yaml') {
        const text = await res.text();
        downloadBlob(new Blob([text], { type: 'text/yaml' }), `${project?.name || projectId}-spec.yaml`);
      } else {
        const data = await res.json();
        downloadBlob(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }), `${project?.name || projectId}-spec.json`);
      }
    } catch { showToast('error', 'Export failed. Check your connection.'); }
    finally { setExporting(false); }
  };

  // ── Copy AI Prompt ──────────────────────────────────────────────────────
  const handleCopyPrompt = async () => {
    const framework = project?.framework || 'django';
    const modelLines = nodes.map(n => {
      const m = n.data.model;
      const fields = (m.fields || []).map(f => `  - ${f.name}: ${f.field_type}`).join('\n');
      const rels = (m.relationships || []).map(r =>
        `  - ${r.field_name}: ${r.relationship_type || r.type} → ${r.to_model_name || r.to_model}`
      ).join('\n');
      return `### ${m.name}\nFields:\n${fields || '  (none)'}\nRelationships:\n${rels || '  (none)'}`;
    }).join('\n\n');

    const djangoInstructions = `Generate the following Django files from this schema:
- models.py (with all fields, relationships, Meta classes, __str__ methods)
- serializers.py (ModelSerializer for each model with nested reads)
- views.py (ModelViewSet for each model with filtering and pagination)
- urls.py (router-based URL conf)
- admin.py (register all models)

Follow these rules:
- Use UUID primary keys
- Add created_at / updated_at where missing
- Use IsAuthenticated for all viewsets
- Include proper on_delete for ForeignKey fields
- Add db_index=True for frequently filtered fields`;

    const expressInstructions = `Generate the following Express.js files from this schema:
- prisma/schema.prisma (full Prisma schema with all models and relations)
- src/app.js (Express app with all routes mounted)
- src/routes/<model>.js for each model (GET, POST, GET/:id, PATCH/:id, DELETE/:id)
- src/controllers/<model>Controller.js for each model (using Prisma)
- .env.example

Follow these rules:
- Use Prisma for all DB access
- JWT auth middleware on all routes
- Return paginated results on list endpoints
- Handle Prisma errors (P2025, P2002) with proper HTTP status codes`;

    const prompt = `You are a senior backend engineer. I have designed my backend schema in Scafld AI. Please generate production-ready code from this schema.

## Project: ${project?.name || 'My Project'}
## Framework: ${framework}

## Schema

${modelLines}

## Instructions

${framework === 'express' ? expressInstructions : djangoInstructions}

Generate all files. For each file, start with the filename as a comment or heading.`;

    try {
      await navigator.clipboard.writeText(prompt);
      setPromptCopied(true);
      setTimeout(() => setPromptCopied(false), 2500);
    } catch { alert('Could not copy to clipboard.'); }
  };

  // ── Clipboard copy ──────────────────────────────────────────────────────
  const handleCopySpec = async () => {
    try {
      const res = await apiService.exportProject(projectId, 'json');
      if (!res.ok) return;
      const data = await res.json();
      await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { showToast('error', 'Copy failed.'); }
  };

  // ── Code generation ─────────────────────────────────────────────────────
  const handleGenerateCode = async () => {
    setGenerating(true);
    try {
      const res = await apiService.generateCode(projectId);
      if (!res.ok) {
        const data = await res.json();
        showToast('error', data.error || data.errors?.join(' ') || 'Code generation failed.');
        return;
      }
      const blob = await res.blob();
      downloadBlob(blob, `${project?.name || projectId}-generated.zip`);
      showToast('success', 'Code generated — download started!');
    } catch { showToast('error', 'Code generation failed. Check your connection.'); }
    finally { setGenerating(false); }
  };

  // ── Render ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-[#7c3aed] animate-spin mx-auto mb-4" />
          <p className="text-white/60">Loading canvas…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-white text-lg mb-2">Could not load canvas</p>
          <p className="text-white/50 text-sm mb-6">{error}</p>
          <button onClick={() => navigate('/dashboard')}
            className="px-6 py-2 bg-[#29142e] text-white rounded-lg hover:bg-[#3a1f4a] transition-colors">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const modelCount = nodes.length;
  const fieldCount = nodes.reduce((s, n) => s + (n.data.model?.fields?.length || 0), 0);

  return (
    <div className="h-screen bg-black flex">

      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-[999] flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl text-sm border backdrop-blur-sm transition-all ${
          toast.type === 'error'
            ? 'bg-red-500/10 border-red-500/30 text-red-400'
            : 'bg-green-500/10 border-green-500/30 text-green-400'
        }`}>
          {toast.type === 'error'
            ? <AlertCircle className="w-4 h-4 flex-shrink-0" />
            : <CheckCircle2 className="w-4 h-4 flex-shrink-0" />}
          <span>{toast.msg}</span>
          <button onClick={() => setToast(null)} className="ml-1 opacity-60 hover:opacity-100 transition-opacity">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Sidebar */}
      <CanvasSidebar
        project={project}
        nodes={nodes}
        onExportJson={() => handleExport('json')}
        onExportYaml={() => handleExport('yaml')}
        onCopySpec={handleCopySpec}
        onGenerateCode={handleGenerateCode}
        onCopyPrompt={handleCopyPrompt}
        copied={copied}
        promptCopied={promptCopied}
        generating={generating}
        exporting={exporting}
        onOpenProjectSettings={() => setProjectSettingsOpen(true)}
      />

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top toolbar */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10 bg-[#0a0a0a] flex-shrink-0">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Database className="w-4 h-4 text-[#a78bfa] flex-shrink-0" />
            <span className="text-white font-medium text-sm truncate">{project?.name || 'Project'}</span>
            <span className="text-white/30 text-xs hidden sm:inline">
              {modelCount} model{modelCount !== 1 ? 's' : ''} · {fieldCount} fields
            </span>
          </div>

          {/* Save status */}
          <div className="flex items-center gap-1 text-xs">
            {saving && <Loader2 className="w-3 h-3 animate-spin text-white/40" />}
            {saveStatus === 'saved' && <><CheckCircle2 className="w-3 h-3 text-green-400" /><span className="text-green-400">Saved</span></>}
            {saveStatus === 'error' && <><AlertCircle className="w-3 h-3 text-red-400" /><span className="text-red-400">Error</span></>}
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => setAddModelOpen(true)}
              title="Add model"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#a78bfa] hover:text-white border border-[#a78bfa]/30 hover:border-[#a78bfa] rounded-lg transition-colors">
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Model</span>
            </button>

            <button onClick={() => savePositions()} disabled={saving}
              title="Save positions"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-white/60 hover:text-white border border-white/10 hover:border-white/20 rounded-lg transition-colors disabled:opacity-40">
              <Save className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Save</span>
            </button>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 relative">
        {/* AI Chat overlay — right side, doesn't affect dock/layout */}
        {aiChatOpen && (
          <div className="absolute right-0 top-0 bottom-0 z-20 w-80 shadow-2xl">
            <CanvasAIChat
              projectId={projectId}
              nodes={nodes}
              onClose={() => setAiChatOpen(false)}
              onSchemaUpdate={() => loadCanvas(true)}
            />
          </div>
        )}
        {nodes.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <Sparkles className="w-12 h-12 text-white/20 mx-auto mb-4" />
              <p className="text-white/40 text-lg">Canvas is empty</p>
              <p className="text-white/25 text-sm mt-2 mb-6">No models yet. Add one to get started.</p>
              <button onClick={() => setAddModelOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#29142e] text-white rounded-lg hover:bg-[#3a1f4a] transition-colors mx-auto text-sm">
                <Plus className="w-4 h-4" />
                Add first model
              </button>
            </div>
          </div>
        ) : (
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={handleNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onEdgeClick={handleEdgeClick}
            nodeTypes={NODE_TYPES}
            fitView
            fitViewOptions={{ padding: 0.35, maxZoom: 0.65 }}
            minZoom={0.15}
            maxZoom={2}
            deleteKeyCode={null}
            connectionLineStyle={{ stroke: '#a78bfa', strokeWidth: 2 }}
            connectionRadius={40}
          >
            <Background color="#333" gap={24} size={1} />
            <MiniMap
              position="bottom-right"
              nodeColor={() => '#29142e'}
              maskColor="rgba(0,0,0,0.6)"
              className="!bg-[#111]/90 !border-white/10 !rounded-xl !shadow-lg !backdrop-blur-sm"
            />
            <Panel position="bottom-center">
              <CanvasDock
                onAddModel={() => setAddModelOpen(true)}
                saving={saving}
                onSave={() => savePositions()}
                onToggleChat={() => setAiChatOpen(o => !o)}
                chatOpen={aiChatOpen}
                onRearrange={handleRearrange}
              />
            </Panel>
          </ReactFlow>
        )}
      </div>

      </div>{/* end main area */}

      {/* Modals */}
      {addModelOpen && <AddModelModal onSave={handleAddModel} onClose={() => setAddModelOpen(false)} />}
      {fieldModalModel && (
        <FieldModal
          model={fieldModalModel}
          onSave={handleSaveField}
          onClose={() => setFieldModalModel(null)}
        />
      )}
      {pendingConnection && (
        <RelationshipModal
          sourceModel={pendingConnection.fromNode.data.model}
          targetModel={pendingConnection.toNode.data.model}
          sourceField={pendingConnection.sourceField}
          onSave={handleRelationshipSave}
          onClose={() => setPendingConnection(null)}
        />
      )}
      {projectSettingsOpen && (
        <ProjectSettingsModal
          project={project}
          onClose={() => setProjectSettingsOpen(false)}
          onUpdated={(updated) => { setProject(updated); setProjectSettingsOpen(false); }}
          onDeleted={() => navigate('/dashboard')}
        />
      )}
    </div>
  );
}
