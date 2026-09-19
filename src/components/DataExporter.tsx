'use client';

import React, { useState } from 'react';
import { Download, FileSpreadsheet, FileText, Check } from 'lucide-react';

interface DataExporterProps {
  data: any[];
  filename: string;
  title?: string;
  type?: 'json' | 'csv' | 'both';
}

export function DataExporter({
  data,
  filename,
  title = 'Export Data',
  type = 'both',
}: DataExporterProps) {
  const [copied, setCopied] = useState(false);

  const downloadJson = () => {
    if (!data || data.length === 0) return;
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const downloadCsv = () => {
    if (!data || data.length === 0) return;

    // Flatten first level keys
    const sample = data[0];
    const headers = Object.keys(sample).filter(
      (k) => typeof sample[k] !== 'object' || sample[k] === null
    );

    let csvRows = [];
    csvRows.push(headers.join(','));

    for (const row of data) {
      const values = headers.map((header) => {
        const val = row[header];
        if (val === null || val === undefined) return '""';
        const escaped = ('' + val).replace(/"/g, '""');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
    }

    const csvStr = '\uFEFF' + csvRows.join('\n'); // UTF-8 BOM for Excel compatibility
    const blob = new Blob([csvStr], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (!data || data.length === 0) return null;

  return (
    <div className="flex items-center gap-2">
      {(type === 'csv' || type === 'both') && (
        <button
          onClick={downloadCsv}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-theme-card border border-theme-border hover:border-emerald-500/50 hover:bg-emerald-500/10 text-theme-muted hover:text-emerald-400 font-semibold text-xs transition-all shadow-sm group"
          title={`Download ${title} as CSV file`}
        >
          <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
          <span>CSV</span>
        </button>
      )}

      {(type === 'json' || type === 'both') && (
        <button
          onClick={downloadJson}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-theme-card border border-theme-border hover:border-cyan-500/50 hover:bg-cyan-500/10 text-theme-muted hover:text-cyan-400 font-semibold text-xs transition-all shadow-sm group"
          title={`Download ${title} as JSON file`}
        >
          <FileText className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
          <span>JSON</span>
        </button>
      )}
    </div>
  );
}
