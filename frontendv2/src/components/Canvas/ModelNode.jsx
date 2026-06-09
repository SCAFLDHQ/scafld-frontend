import { useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Database, Plus, Trash2 } from 'lucide-react';

const REL_COLORS = {
  ForeignKey: 'text-[#a78bfa]',
  ManyToManyField: 'text-cyan-400',
  OneToOneField: 'text-emerald-400',
};
const REL_ABBR = { ForeignKey: 'FK', ManyToManyField: 'M2M', OneToOneField: 'O2O' };
const HANDLE_STYLE = { background: '#7c3aed', width: 10, height: 10, border: '2px solid #111' };

const TYPE_COLORS = {
  CharField: 'text-blue-400',
  TextField: 'text-blue-300',
  EmailField: 'text-cyan-400',
  URLField: 'text-cyan-300',
  SlugField: 'text-cyan-200',
  IntegerField: 'text-orange-400',
  FloatField: 'text-orange-300',
  DecimalField: 'text-orange-400',
  PositiveIntegerField: 'text-orange-300',
  BooleanField: 'text-yellow-400',
  DateField: 'text-purple-400',
  TimeField: 'text-purple-300',
  DateTimeField: 'text-purple-400',
  JSONField: 'text-pink-400',
  UUIDField: 'text-gray-400',
  FileField: 'text-green-400',
  ImageField: 'text-green-400',
};

const TYPE_ABBR = {
  CharField: 'str',
  TextField: 'text',
  EmailField: 'email',
  URLField: 'url',
  SlugField: 'slug',
  IntegerField: 'int',
  FloatField: 'float',
  DecimalField: 'dec',
  PositiveIntegerField: 'uint',
  BooleanField: 'bool',
  DateField: 'date',
  TimeField: 'time',
  DateTimeField: 'dt',
  JSONField: 'json',
  UUIDField: 'uuid',
  FileField: 'file',
  ImageField: 'img',
};

export default function ModelNode({ data, selected }) {
  const { model, onAddField, onDeleteModel, onDeleteField, onDeleteRelationship } = data;
  const fields = model.fields || [];
  const relationships = model.relationships || [];
  const [hoveredField, setHoveredField] = useState(null);

  const fhid = (field, i) => `f-${field.id != null ? field.id : `idx${i}`}`;

  return (
    <div
      className={`
        bg-[#111] border rounded-xl min-w-[220px] max-w-[280px] shadow-xl
        transition-all duration-150
        ${selected
          ? 'border-[#7c3aed] shadow-[0_0_0_2px_rgba(124,58,237,0.3)]'
          : 'border-white/15 hover:border-white/30'}
      `}
    >
      {/* Target handles — incoming connections */}
      <Handle type="target" position={Position.Left}  id="m-left"  style={{ ...HANDLE_STYLE, left: -6 }} />
      <Handle type="target" position={Position.Top}   id="m-top"   style={{ ...HANDLE_STYLE, top: -6 }} />
      <Handle type="target" position={Position.Right} id="m-right" style={{ ...HANDLE_STYLE, right: -6 }} />
      {/* Source handle — drag from here without a specific field */}
      <Handle type="source" position={Position.Bottom} id="m-bottom" style={{ ...HANDLE_STYLE, bottom: -6 }} />

      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2.5 border-b border-white/10 bg-[#29142e]/60 rounded-t-xl group/header">
        <Database className="w-3.5 h-3.5 text-[#a78bfa] flex-shrink-0" />
        <span className="text-white font-medium text-sm tracking-wide truncate flex-1">{model.name}</span>
        {relationships.length > 0 && (
          <span className="text-[10px] text-white/30 flex-shrink-0">{relationships.length}rel</span>
        )}
        {onDeleteModel && (
          <button
            onClick={(e) => { e.stopPropagation(); onDeleteModel(model); }}
            className="opacity-0 group-hover/header:opacity-100 transition-opacity ml-1 text-red-400/60 hover:text-red-400"
            title="Delete model"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Fields */}
      <div className="px-3 py-2 space-y-0.5">
        {fields.length === 0 ? (
          <div className="text-white/30 text-xs py-1">No fields</div>
        ) : (
          fields.slice(0, 10).map((field, i) => (
            <div
              key={field.id || i}
              className="relative flex items-center gap-2 py-0.5 pr-3"
              onMouseEnter={() => setHoveredField(field.id ?? i)}
              onMouseLeave={() => setHoveredField(null)}
            >
              {/* Per-field source handle */}
              <Handle
                type="source"
                position={Position.Right}
                id={fhid(field, i)}
                onMouseEnter={() => setHoveredField(field.id ?? i)}
                style={{
                  background: '#a78bfa',
                  width: 8, height: 8,
                  border: '2px solid #111',
                  borderRadius: '50%',
                  right: -8, top: '50%',
                  transform: 'translateY(-50%)',
                  opacity: hoveredField === (field.id ?? i) ? 1 : 0.25,
                  transition: 'opacity 0.15s',
                  cursor: 'crosshair',
                  zIndex: 10,
                }}
              />
              <span className="text-white/60 text-xs font-mono truncate flex-1">{field.name}</span>
              <span className={`text-[10px] font-mono flex-shrink-0 ${TYPE_COLORS[field.field_type] || 'text-white/40'}`}>
                {TYPE_ABBR[field.field_type] || field.field_type?.toLowerCase().replace('field', '') || '?'}
              </span>
              {field.unique && <span className="text-yellow-500/60 text-[9px]">U</span>}
              {onDeleteField && (
                <button
                  onClick={(e) => { e.stopPropagation(); onDeleteField(field, model); }}
                  style={{ opacity: hoveredField === (field.id ?? i) ? 1 : 0 }}
                  className="transition-opacity text-red-400/50 hover:text-red-400 flex-shrink-0"
                >
                  <Trash2 className="w-2.5 h-2.5" />
                </button>
              )}
            </div>
          ))
        )}
        {fields.length > 10 && (
          <div className="text-white/30 text-[10px] pt-1">+{fields.length - 10} more</div>
        )}
      </div>

      {/* Add field button */}
      {onAddField && (
        <div className="border-t border-white/5 px-3 py-1.5">
          <button
            onClick={(e) => { e.stopPropagation(); onAddField(model); }}
            className="flex items-center gap-1 text-[11px] text-white/30 hover:text-[#a78bfa] transition-colors w-full"
          >
            <Plus className="w-3 h-3" />
            Add field
          </button>
        </div>
      )}

      {/* Relationships */}
      {relationships.length > 0 && (
        <div className="border-t border-white/5 px-3 py-1.5">
          {relationships.map((rel, i) => {
            const rtype = rel.type || rel.relationship_type || 'ForeignKey';
            return (
              <div key={rel.id || i} className="flex items-center gap-1.5 py-0.5 group/rel">
                <span className={`text-[10px] font-mono flex-shrink-0 ${REL_COLORS[rtype] || 'text-[#a78bfa]'}`}>
                  {REL_ABBR[rtype] || 'FK'}
                </span>
                <span className="text-white/40 text-[10px] font-mono truncate flex-1">{rel.field_name}</span>
                <span className="text-white/20 text-[10px] flex-shrink-0">{rel.to_model_name || rel.to_model}</span>
                {onDeleteRelationship && (
                  <button
                    onClick={(e) => { e.stopPropagation(); onDeleteRelationship(rel, model); }}
                    className="opacity-0 group-hover/rel:opacity-100 transition-opacity text-red-400/50 hover:text-red-400 flex-shrink-0 ml-1"
                    title="Delete relationship"
                  >
                    <Trash2 className="w-2.5 h-2.5" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
