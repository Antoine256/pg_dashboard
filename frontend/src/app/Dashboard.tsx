import { useEffect, useState } from 'preact/hooks';
import { Database, Users, Terminal, Plus, Power, Table, Sheet, ScrollText } from 'lucide-react';
import { ConnectionModal, ConnectionConfig } from './components/ConnectionModal';
import { DatabaseList } from './components/DatabaseList';
import { UsersList } from './components/UsersList';
import { SqlEditor } from './components/SqlEditor';
import { JSX } from 'preact';
import { TableList } from './components/TableList';
import { Connect, LoadConfig, SaveConfig } from '../../wailsjs/go/app/App';
import { Logs } from './components/Logs';

type View = 'databases' | 'users' | 'query' | 'tables' | 'logs';

const btnStyle = "w-full flex items-center gap-3 px-3 py-2 rounded mb-1 cursor-pointer hover:outline-blue-900 hover:outline box-border"

export default function Dashboard(): JSX.Element {
  const [currentView, setCurrentView] = useState<View>('tables');
  const [isConnected, setIsConnected] = useState(false);
  const [showConnectionModal, setShowConnectionModal] = useState(false);
  const [connectionInfo, setConnectionInfo] = useState<ConnectionConfig>({
    host: 'localhost',
    port: '5432',
    database: 'postgres',
    username: 'postgres',
    password: '',
  });
  const [queries, setQueries] = useState<string[]>([
    `SELECT * FROM information_schema.tables WHERE table_schema = 'public';`,
    `SELECT * FROM information_schema.users;`,
    `SELECT * FROM information_schema.columns WHERE table_schema = 'public';`
  ]);
  const [queryIndex, setQueryIndex] = useState<number>(0);
  const [loading, setLoading ] = useState<boolean>(false)

  useEffect(() => {
      // Check if we have a previous connection in config file
      LoadConfig().then(config => {
        console.log("Loaded config:", config);
        let oldConfig = {
          host: config.lastHost || 'localhost',
          port: config.lastPort || '5432',
          database: config.lastDatabase || 'postgres',
          username: config.lastUser || 'postgres',
          password: '',
        };
        console.log("Setting connection info from config:", oldConfig);
        setConnectionInfo(oldConfig);
      });
  }, []);

  const handleConnect = (config: ConnectionConfig) => {
    setConnectionInfo(config);
    LoadConfig().then(oldConfig => {
      SaveConfig({
        lastHost: config.host,
        lastPort: config.port,
        lastUser: config.username,
        lastDatabase: config.database,
        lastLogFileAnalyzed: oldConfig.lastLogFileAnalyzed || '',
      });
    });
    setIsConnected(true);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
  };

  const changeDatabase = async (dbName: string) => {
    setLoading(true)
    setIsConnected(false);
    try {
      console.log("Attempting to connect to database:", dbName)
      await Connect(connectionInfo.host, connectionInfo.port, connectionInfo.username, connectionInfo.password, dbName)
      setConnectionInfo(prev => ({ ...prev, database: dbName }));
      setIsConnected(true);
      setCurrentView('tables');
    } catch (error) {
      alert("An error occurred while trying to connect to the database. Please check your credentials and try again .\nError details: " + error);
    }
    setLoading(false)
  }

  return (
    <div className="w-screen h-screen flex bg-background text-foreground">
      {/* Sidebar */}
      <div className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
        <div className="p-4 border-b border-sidebar-border">
          <div className={`flex items-center gap-2 mb-2 border-b border-sidebar-border pb-3`+` ${isConnected ? 'border-green-500' : 'border-red-500'}`}>
            <div className="bg-sidebar-primary rounded">
              <Database className="w-auto h-auto text-sidebar-primary-foreground" />
            </div>
            <div>
              <h2 className="text-sidebar-foreground text-lg">PostgreSQL</h2>
              <p className="text-xs text-muted-foreground">Dashboard</p>
            </div>
          </div>
          {loading ? (
            <div className="bg-sidebar-accent rounded p-2 hover:cursor-pointer hover:bg-sidebar-accent/90 transition-colors">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground text-green-700 font-bold">Connecting...</span>
                </div>
            </div>
          ) : (

          isConnected ? (
            <div className="bg-sidebar-accent rounded p-2 hover:cursor-pointer hover:bg-sidebar-accent/90 transition-colors" onClick={()=>{}}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground text-green-700 font-bold">Connected to:</span>
                <button
                  onClick={handleDisconnect}
                  className="p-1 hover:bg-sidebar-border rounded shadow-sm shadow-red-500 cursor-pointer border border-red-500 hover:bg-red-500 hover:scale-105 transition-transform"
                  title="Disconnect"
                >
                  <Power className="w-3 h-3 text-foreground" />
                </button>
              </div>
              <p className="text-xs text-sidebar-foreground truncate">{connectionInfo.host}:{connectionInfo.port}</p>
              <div className="flex mt-2 items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground text-green-700 font-bold">On database :</span>
              </div>
              <p className="text-xs text-muted-foreground truncate">{connectionInfo.database}</p>
              <div className="flex mt-2 items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground text-green-700 font-bold">With user :</span>
              </div>
              <p className="text-xs text-muted-foreground truncate">{connectionInfo.username}</p>
            </div>
          ) : (
            <button
              onClick={() => setShowConnectionModal(true)}
              className="w-full flex items-center gap-2 py-2 bg-sidebar-primary text-sidebar-primary-foreground rounded hover:bg-sidebar-primary/90 cursor-pointer hover:scale-105 transition-transform hover:text-slate-200 shadow-red-500 shadow-sm p-2"
            >
              <Plus className="w-4 h-4" />
              New Connection
            </button>
          )
          )}
        </div>

        <nav className="flex-1">
          <div className="flex-1 p-2 border-b border-sidebar-border">
            <button
              onClick={() => setCurrentView('tables')}
              className={` ${btnStyle} ${
                currentView === 'tables'
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground border-blue-500 border'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
              }`}
            >
              <Table className="w-5 h-5" />
              Tables
            </button>
            <button
              onClick={() => setCurrentView('query')}
              className={` ${btnStyle} ${
                currentView === 'query'
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground border-blue-500 border'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
              }`}
            >
              <Terminal className="w-5 h-5" />
              Query Editor
            </button>
          </div>
          <div className="flex-1 p-2">
            <button
              onClick={() => setCurrentView('databases')}
              className={` ${btnStyle} ${
                currentView === 'databases'
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground border-blue-500 border'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
              }`}
            >
              <Database className="w-5 h-5" />
              Databases
            </button>

            <button
              onClick={() => setCurrentView('users')}
              className={` ${btnStyle} ${
                currentView === 'users'
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground border-blue-500 border'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
              }`}
            >
              <Users className="w-5 h-5" />
              Users (soon)
            </button>
            <button
              onClick={() => setCurrentView('logs')}
              className={` ${btnStyle} ${
                currentView === 'logs'
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground border-blue-500 border'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
              }`}
            >
              <ScrollText className="w-5 h-5" />
              Logs
            </button>
          </div>
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
                className="px-6 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 border-primary border shadow-md shadow-white hover:scale-102 transition-transform cursor-pointer"
              >
                Connect Now
              </button>
            </div>
          </div>
        ) : (
          <>
            {currentView === 'tables' && <TableList handleQuery={(queries, index) => { setQueries(queries); setQueryIndex(index); setCurrentView('query'); }} />}
            {currentView === 'query' && <SqlEditor queries={queries} queryIndex={queryIndex} />}
            {currentView === 'databases' && <DatabaseList changeDatabase={changeDatabase} />}
            {currentView === 'users' && <UsersList />}
            {currentView === 'logs' && <Logs />}
          </>
        )}
      </div>

      <ConnectionModal
        isOpen={showConnectionModal}
        onClose={() => setShowConnectionModal(false)}
        onConnect={handleConnect}
        initialConfig={connectionInfo}
      />
    </div>
  );
}
