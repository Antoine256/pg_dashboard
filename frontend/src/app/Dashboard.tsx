import { useState } from 'react';
import { Database, Users, Terminal, Plus, Power } from 'lucide-react';
import { ConnectionModal, ConnectionConfig } from './components/ConnectionModal';
import { DatabaseList } from './components/DatabaseList';
import { UsersList } from './components/UsersList';
import { SqlEditor } from './components/SqlEditor';

type View = 'databases' | 'users' | 'query';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('databases');
  const [isConnected, setIsConnected] = useState(true);
  const [showConnectionModal, setShowConnectionModal] = useState(false);
  const [connectionInfo, setConnectionInfo] = useState<ConnectionConfig>({
    host: 'localhost',
    port: '5432',
    database: 'postgres',
    username: 'postgres',
    password: '',
  });

  const handleConnect = (config: ConnectionConfig) => {
    setConnectionInfo(config);
    setIsConnected(true);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
  };

  return (
    <div className="dark size-full flex bg-background text-foreground">
      {/* Sidebar */}
      <div className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-sidebar-primary rounded">
              <Database className="w-5 h-5 text-sidebar-primary-foreground" />
            </div>
            <div>
              <h2 className="text-sidebar-foreground">PostgreSQL</h2>
              <p className="text-xs text-muted-foreground">Dashboard</p>
            </div>
          </div>

          {isConnected ? (
            <div className="bg-sidebar-accent rounded p-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground">Connected to:</span>
                <button
                  onClick={handleDisconnect}
                  className="p-1 hover:bg-sidebar-border rounded"
                  title="Disconnect"
                >
                  <Power className="w-3 h-3 text-red-500" />
                </button>
              </div>
              <p className="text-xs text-sidebar-foreground truncate">{connectionInfo.host}:{connectionInfo.port}</p>
              <p className="text-xs text-muted-foreground truncate">{connectionInfo.database}</p>
            </div>
          ) : (
            <button
              onClick={() => setShowConnectionModal(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-sidebar-primary text-sidebar-primary-foreground rounded hover:bg-sidebar-primary/90"
            >
              <Plus className="w-4 h-4" />
              New Connection
            </button>
          )}
        </div>

        <nav className="flex-1 p-2">
          <button
            onClick={() => setCurrentView('databases')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded mb-1 ${
              currentView === 'databases'
                ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
            }`}
          >
            <Database className="w-5 h-5" />
            Databases
          </button>

          <button
            onClick={() => setCurrentView('users')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded mb-1 ${
              currentView === 'users'
                ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
            }`}
          >
            <Users className="w-5 h-5" />
            Users
          </button>

          <button
            onClick={() => setCurrentView('query')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded mb-1 ${
              currentView === 'query'
                ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
            }`}
          >
            <Terminal className="w-5 h-5" />
            Query Editor
          </button>
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            {isConnected ? 'Connected' : 'Disconnected'}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {!isConnected ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <Database className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-foreground mb-2">Not Connected</h2>
              <p className="text-muted-foreground mb-4">Connect to a PostgreSQL instance to get started</p>
              <button
                onClick={() => setShowConnectionModal(true)}
                className="px-6 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
              >
                Connect Now
              </button>
            </div>
          </div>
        ) : (
          <>
            {currentView === 'databases' && <DatabaseList />}
            {currentView === 'users' && <UsersList />}
            {currentView === 'query' && <SqlEditor />}
          </>
        )}
      </div>

      <ConnectionModal
        isOpen={showConnectionModal}
        onClose={() => setShowConnectionModal(false)}
        onConnect={handleConnect}
      />
    </div>
  );
}
