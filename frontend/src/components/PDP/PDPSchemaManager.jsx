import { useState } from 'react';
import { pdpAPI } from '../../services/api';

const PDPSchemaManager = ({ projectId, onSchemaImported, onValidationComplete }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importData, setImportData] = useState('');

  const handleExportPDP = async () => {
    try {
      setIsExporting(true);
      const pdpSchema = await pdpAPI.exportPDP(projectId);
      
      // Download as JSON file
      const blob = new Blob([JSON.stringify(pdpSchema, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${pdpSchema.metadata.name}-pdp.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportPDP = async () => {
    try {
      setIsImporting(true);
      const pdpData = JSON.parse(importData);
      const result = await pdpAPI.importPDP(pdpData);
      onSchemaImported?.(result);
      setShowImportModal(false);
      setImportData('');
    } catch (error) {
      console.error('Import failed:', error);
    } finally {
      setIsImporting(false);
    }
  };

  const handleValidateSchema = async () => {
    try {
      setIsValidating(true);
      const validation = await pdpAPI.validateSchema(projectId);
      onValidationComplete?.(validation);
    } catch (error) {
      console.error('Validation failed:', error);
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <>
      <div className="flex gap-2">
        <button
          onClick={handleExportPDP}
          disabled={isExporting}
          className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isExporting ? 'Exporting...' : 'Export PDP'}
        </button>
        
        <button
          onClick={() => setShowImportModal(true)}
          className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
        >
          Import PDP
        </button>
        
        <button
          onClick={handleValidateSchema}
          disabled={isValidating}
          className="px-3 py-1.5 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 disabled:opacity-50"
        >
          {isValidating ? 'Validating...' : 'Validate'}
        </button>
      </div>

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-background-light rounded-lg p-6 w-full max-w-2xl mx-4">
            <h3 className="text-lg font-semibold text-primary-text mb-4">Import PDP Schema</h3>
            
            <textarea
              value={importData}
              onChange={(e) => setImportData(e.target.value)}
              placeholder="Paste your PDP JSON schema here..."
              className="w-full h-64 p-3 bg-background-dark text-primary-text rounded-lg border border-border-color resize-none"
            />
            
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowImportModal(false)}
                className="px-4 py-2 text-secondary-text hover:text-primary-text"
              >
                Cancel
              </button>
              <button
                onClick={handleImportPDP}
                disabled={isImporting || !importData.trim()}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
              >
                {isImporting ? 'Importing...' : 'Import'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PDPSchemaManager;