import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Sparkles, Loader2, Bot, User, RotateCcw } from 'lucide-react';
import apiService from '../../services/api';

function Message({ msg }) {
  if (msg.role === 'user') {
    return (
      <div className="flex justify-end gap-2 mb-3 min-w-0">
        <div className="max-w-[80%] min-w-0 px-3 py-2 bg-[#29142e] rounded-xl rounded-tr-sm text-white text-sm break-words overflow-hidden">
          {msg.content}
        </div>
        <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
          <User className="w-3 h-3 text-white/60" />
        </div>
      </div>
    );
  }

  if (msg.role === 'assistant') {
    return (
      <div className="flex gap-2 mb-3 min-w-0">
        <div className="w-6 h-6 rounded-full bg-[#29142e]/60 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Bot className="w-3 h-3 text-[#a78bfa]" />
        </div>
        <div className="flex-1 min-w-0 px-3 py-2 bg-white/5 border border-white/5 rounded-xl rounded-tl-sm text-white/85 text-sm whitespace-pre-wrap break-words overflow-hidden">
          {msg.content}
        </div>
      </div>
    );
  }

  if (msg.role === 'system') {
    return (
      <div className="text-center text-white/30 text-xs py-1 mb-2 break-words">{msg.content}</div>
    );
  }

  return null;
}

export default function CanvasAIChat({ projectId, nodes, onClose, onSchemaUpdate }) {
  const [messages, setMessages] = useState([
    {
      role: 'system',
      content: 'AI connected — describe what you want to add, change, or remove from your schema.',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const schemaContext = () => {
    const models = nodes.map(n => {
      const m = n.data.model;
      const fields = (m.fields || []).map(f => `${f.name}: ${f.field_type}`).join(', ');
      const rels = (m.relationships || []).map(r => `${r.field_name} → ${r.to_model} (${r.relationship_type || r.type || 'FK'})`).join(', ');
      return `${m.name}${fields ? ` [${fields}]` : ''}${rels ? ` | rels: ${rels}` : ''}`;
    }).join('\n');
    return models || 'No models yet';
  };

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const context = `Current schema:\n${schemaContext()}\n\nUser request: ${text}`;
      const res = await apiService.iterateSchema(projectId, context);
      const data = await res.json();

      if (res.ok) {
        const reply = data.message || data.reply || 'Schema updated.';
        setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
        if (data.updated) {
          setMessages(prev => [...prev, { role: 'system', content: 'Schema updated — canvas refreshed.' }]);
          onSchemaUpdate?.();
        }
      } else {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.error || 'Something went wrong. Try rephrasing your request.',
        }]);
      }
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Connection error. Please try again.',
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const clearChat = () => {
    setMessages([{
      role: 'system',
      content: 'Chat cleared — describe what you want to change.',
    }]);
  };

  return (
    <motion.div
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '100%', opacity: 0 }}
      transition={{ type: 'spring', stiffness: 320, damping: 32 }}
      className="w-full h-full flex flex-col bg-[#0a0a0a]/95 backdrop-blur-sm border-l border-white/10"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#a78bfa]" />
          <span className="text-white text-sm font-medium">AI Schema Chat</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={clearChat}
            className="p-1.5 text-white/30 hover:text-white transition-colors rounded"
            title="Clear chat"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 text-white/30 hover:text-white transition-colors rounded"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Message msg={msg} />
            </motion.div>
          ))}
        </AnimatePresence>
        {loading && (
          <div className="flex gap-2 mb-3">
            <div className="w-6 h-6 rounded-full bg-[#29142e]/60 flex items-center justify-center flex-shrink-0">
              <Bot className="w-3 h-3 text-[#a78bfa]" />
            </div>
            <div className="px-3 py-2 bg-white/5 border border-white/5 rounded-xl rounded-tl-sm">
              <Loader2 className="w-3.5 h-3.5 text-white/40 animate-spin" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      <div className="px-3 pb-2">
        <div className="flex gap-1.5 flex-wrap">
          {[
            'Add a comments model',
            'Add timestamps to all',
            'Add user authentication',
          ].map(s => (
            <button
              key={s}
              onClick={() => setInput(s)}
              className="text-[10px] px-2 py-1 bg-white/5 text-white/40 hover:text-white hover:bg-white/10 rounded border border-white/5 transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="px-3 pb-3">
        <div className="flex items-end gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2 focus-within:border-[#7c3aed]/50 transition-colors">
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Add a likes table with user and post relations…"
            rows={1}
            disabled={loading}
            className="flex-1 bg-transparent text-white text-sm placeholder-white/30 resize-none focus:outline-none min-h-[20px] max-h-[100px] disabled:opacity-50"
            style={{ height: 'auto' }}
            onInput={e => {
              e.target.style.height = 'auto';
              e.target.style.height = Math.min(e.target.scrollHeight, 100) + 'px';
            }}
          />
          <button
            onClick={send}
            disabled={!input.trim() || loading}
            className="p-1 text-[#a78bfa] hover:text-white transition-colors disabled:opacity-30 flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-white/20 text-[10px] mt-1.5 text-center">Enter to send · Shift+Enter for newline</p>
      </div>
    </motion.div>
  );
}
