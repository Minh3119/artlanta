import React, { useState, useEffect } from 'react';

// Mapping for user-friendly field names
const FIELD_LABELS = {
  ArtistSeenFinal: 'Final Product Submitted',
  ClientConfirmed: 'Client Accepted Final Product',
  // Add more mappings as needed
};

// Function to prettify boolean-like values
function prettifyValue(field, value) {
  if (field === 'ArtistSeenFinal' || field === 'ClientConfirmed') {
    if (value === 1 || value === '1' || value === true || value === 'true') return 'Yes';
    if (value === 0 || value === '0' || value === false || value === 'false') return 'No';
  }
  return value === null || value === undefined || value === '' ? 'null' : value;
}

const SidebarHistory = ({ history, historyLoading, historyError, users = {} }) => (
  <div className="lg:w-96">
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden sticky top-8">
      <div className="bg-gradient-to-r from-gray-600 to-gray-700 px-6 py-4 text-white">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <span className="text-2xl">📊</span>
          History
        </h3>
        <p className="text-gray-300 text-sm mt-1">Track all changes made to this commission</p>
      </div>
      <div className="p-6 h-[400px] overflow-y-auto">
        {historyLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent mx-auto mb-3"></div>
            <p className="text-gray-500 text-sm">Loading history...</p>
          </div>
        ) : historyError ? (
          <div className="text-center py-8">
            <div className="text-red-500 text-2xl mb-2">⚠️</div>
            <p className="text-red-600 text-sm">{historyError}</p>
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 text-4xl mb-3">📝</div>
            <p className="text-gray-500 text-sm">No edits yet</p>
            <p className="text-gray-400 text-xs mt-1">Changes will appear here</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-[70vh]">
            {history.map((h, idx) => (
              <div key={h.id || idx} className="bg-gray-50 rounded-xl p-4 border border-gray-100 hover:shadow-sm transition-shadow">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-semibold text-gray-800 bg-blue-100 text-blue-800 px-2 py-1 rounded-md">
                        {FIELD_LABELS[h.changedField] || h.changedField}
                      </span>
                      <span className="text-gray-400">→</span>
                    </div>
                    <div className="space-y-1 mb-3">
                      <div className="text-xs text-gray-500 line-through bg-red-50 px-2 py-1 rounded">
                        {prettifyValue(h.changedField, h.oldValue)}
                      </div>
                      <div className="text-xs text-gray-700 bg-green-50 px-2 py-1 rounded font-medium">
                        {prettifyValue(h.changedField, h.newValue)}
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <div className="flex items-center gap-2">
                        
                      </div>
                      <span>{h.changedAt ? new Date(h.changedAt).toLocaleString() : 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
);

export default SidebarHistory;
