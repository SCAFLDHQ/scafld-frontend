import React, { useEffect, useRef } from 'react';

const DeploymentLogs = ({ logs }) => {
  const logsEndRef = useRef(null);

  const scrollToBottom = () => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [logs]);

  const getLogColor = (log) => {
    if (log.includes('✅') || log.includes('🎉')) return 'text-green-400';
    if (log.includes('❌') || log.includes('ERROR')) return 'text-red-400';
    if (log.includes('⚠️') || log.includes('WARN')) return 'text-yellow-400';
    if (log.includes('🚀') || log.includes('📁') || log.includes('⚙️')) return 'text-blue-400';
    if (log.includes('🔍') || log.includes('💻') || log.includes('📄')) return 'text-purple-400';
    if (log.includes('📡') || log.includes('📥') || log.includes('📦')) return 'text-cyan-400';
    return 'text-gray-300';
  };

  return (
    <div className="glassmorphism rounded-xl border border-white/10 flex flex-col h-full">
      <div className="px-6 py-4 border-b border-white/10 flex-shrink-0">
        <h3 className="text-lg font-bold text-white">Generation Logs</h3>
        <p className="text-gray-400 text-sm">Real-time progress of your code generation</p>
      </div>
      <div className="flex-1 overflow-y-auto p-6 bg-[#1A1A1A]/50">
        <div className="font-mono text-sm space-y-2">
          {logs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <span className="material-symbols-outlined text-4xl mb-2">terminal</span>
              <p>Logs will appear here when you generate your project</p>
            </div>
          ) : (
            logs.map((log, index) => (
              <div key={index} className="flex items-start gap-3">
                <span className="text-gray-500 text-xs mt-0.5 flex-shrink-0">
                  {log.split(' - ')[0]}
                </span>
                <p className={`flex-1 ${getLogColor(log)}`}>
                  {log.split(' - ')[1]}
                </p>
              </div>
            ))
          )}
          <div ref={logsEndRef} />
        </div>
      </div>
    </div>
  );
};

export default DeploymentLogs;