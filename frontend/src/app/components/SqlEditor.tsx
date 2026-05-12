import { useState } from 'preact/hooks';
import { Play, Download, Trash2, Terminal } from 'lucide-react';
import { ExecuteQuery } from '../../../wailsjs/go/main/App';
import { parseQueryRes } from '../../utils/parseQueryRes';

interface QueryResult {
  columns: string[];
  rows: any[][];
  rowCount: number;
  executionTime: number;
}

export function SqlEditor({ queries, queryIndex }: { queries: string[]; queryIndex: number }) {
  const [query, setQuery] = useState(queries[queryIndex] || '');
  const [result, setResult] = useState<QueryResult | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  const executeQuery = () => {
    setIsExecuting(true);
    console.log("Executing query:", query);
    ExecuteQuery(query)
      .then((result) => {
        var parsedResult = parseQueryRes(result, 0);
        if (typeof parsedResult === 'string') {
          alert("An error occurred while executing the query: " + parsedResult);
          setIsExecuting(false);
          return;
        }
        setResult(parsedResult);
        setIsExecuting(false);
      })
      .catch((error) => {
        console.error("Error executing query:", error);
        setIsExecuting(false);
      });
  };

  const clearQuery = () => {
    setQuery('');
    setResult(null);
  };

  const exportResults = () => {
    if (!result) return;
    const csv = [
      result.columns.join(','),
      ...result.rows.map(row => row.join(',')),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'query_results.csv';
    a.click();
  };

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-6">
        <Terminal className="w-6 h-6 text-primary" />
        <h1 className="text-foreground">SQL Query Editor</h1>
      </div>

      <div className="flex-1 flex flex-col gap-4">
        <div className="border border-border rounded-lg overflow-hidden bg-card">
          <div className="bg-muted px-4 py-2 flex items-center justify-between border-b border-border">
            <span className="text-sm text-muted-foreground">Query Editor</span>
            <div className="flex gap-2">
              <button
                onClick={clearQuery}
                className="p-1 hover:bg-accent rounded text-muted-foreground hover:text-foreground"
                title="Clear"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          <textarea
            value={query}
            onChange={(e) => {
              setQuery((e.target as HTMLInputElement).value);
            }}
            placeholder="Enter your SQL query here..."
            className="w-full h-32 p-4 bg-card text-foreground font-mono text-sm resize-none focus:outline-none"
          />
          <div className="px-4 py-2 bg-muted border-t border-border flex items-center justify-between">
            <div className="flex gap-2">
              {queries.map((sample, i) => (
                <button
                  key={i}
                  onClick={() => setQuery(sample)}
                  className="text-xs px-2 py-1 bg-accent hover:bg-accent/70 rounded text-foreground"
                >
                  Sample {i + 1}
                </button>
              ))}
            </div>
            <button
              onClick={executeQuery}
              disabled={!query || isExecuting}
              className="flex items-center gap-2 px-4 py-1.5 bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Play className="w-4 h-4" />
              {isExecuting ? 'Executing...' : 'Execute'}
            </button>
          </div>
        </div>

        {result && (
          <div className="border border-border rounded-lg overflow-hidden bg-card flex-1 flex flex-col">
            <div className="bg-muted px-4 py-2 flex items-center justify-between border-b border-border">
              <span className="text-sm text-muted-foreground">
                Results ({result.rowCount} rows, {result.executionTime}ms)
              </span>
              <button
                onClick={exportResults}
                className="flex items-center gap-1 text-sm px-2 py-1 hover:bg-accent rounded text-foreground"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>
            <div className="overflow-auto flex-1">
              <table className="w-full">
                <thead className="bg-muted sticky top-0">
                  <tr>
                    {result.columns.map((col) => (
                      <th key={col} className="text-left px-4 py-2 text-sm text-muted-foreground border-b border-border">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {result.rows.map((row, rowIndex) => (
                    <tr
                      key={rowIndex}
                      className={rowIndex !== result.rows.length - 1 ? 'border-b border-border' : ''}
                    >
                      {row.map((cell, cellIndex) => (
                        <td key={cellIndex} className="px-4 py-2 text-sm text-foreground">
                          {typeof cell === 'boolean' ? (
                            <span className={cell ? 'text-green-500' : 'text-red-500'}>
                              {cell.toString()}
                            </span>
                          ) : (
                            cell
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
