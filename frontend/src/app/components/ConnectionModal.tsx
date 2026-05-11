import { useState } from 'preact/hooks';
import { X } from 'lucide-react';
import { Connect} from "../../../wailsjs/go/main/App";


interface ConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (config: ConnectionConfig) => void;
}

export interface ConnectionConfig {
  host: string;
  port: string;
  database: string;
  username: string;
  password: string;
}

export function ConnectionModal({ isOpen, onClose, onConnect }: ConnectionModalProps) {
  const [config, setConfig] = useState<ConnectionConfig>({
    host: 'localhost',
    port: '5432',
    database: 'postgres',
    username: 'postgres',
    password: '',
  });
  const [Loading, setLoading] = useState(false)

  if (!isOpen) return null;

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setLoading(true)
    // Here you would normally validate the input and attempt to connect to the database.
    try {
      console.log("Attempting to connect with config:", config);
      await Connect(config.host, config.port, config.username, config.password, config.database)
      onConnect(config);
      onClose();
    } catch (error) {
      alert("An error occurred while trying to connect to the database. Please check your credentials and try again .\nError details: " + error);
    }
    setLoading(false)
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card backdrop-blur-lg border border-border rounded-lg w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-foreground">Connect to PostgreSQL</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-muted-foreground mb-1">Host</label>
            <input
              type="text"
              onChange={(e) => setConfig({ ...config, host: (e.target as HTMLInputElement).value })}
              value={config.host}
              className="w-full bg-input-background border border-border rounded px-3 py-2 text-foreground"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-1">Port</label>
            <input
              type="text"
              onChange={(e) => setConfig({ ...config, port: (e.target as HTMLInputElement).value })}
              value={config.port}
              className="w-full bg-input-background border border-border rounded px-3 py-2 text-foreground"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-1">Database</label>
            <input
              type="text"
              onChange={(e) => setConfig({ ...config, database: (e.target as HTMLInputElement).value })}
              value={config.database}
              className="w-full bg-input-background border border-border rounded px-3 py-2 text-foreground"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-1">Username</label>
            <input
              type="text"
              onChange={(e) => setConfig({ ...config, username: (e.target as HTMLInputElement).value })}
              value={config.username}
              className="w-full bg-input-background border border-border rounded px-3 py-2 text-foreground"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-1">Password</label>
            <input
              type="password"
              onChange={(e) => setConfig({ ...config, password: (e.target as HTMLInputElement).value })}
              value={config.password}
              className="w-full bg-input-background border border-border rounded px-3 py-2 text-foreground"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded hover:bg-accent text-foreground cursor-pointer hover:scale-105 transition-transform border border-red-500 shadow-red-500 shadow-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 cursor-pointer hover:scale-105 transition-transform border border-green-500 shadow-green-500 shadow-sm"
            >
              Connect
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
