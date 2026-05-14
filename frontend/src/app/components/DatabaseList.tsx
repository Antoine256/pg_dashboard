import { Database, HardDrive } from 'lucide-react';
import { useEffect, useState } from 'preact/compat';
import { Connect, ExecuteQuery } from '../../../wailsjs/go/app/App';

interface DatabaseInfo {
  name: string;
  size: string;
  owner: string;
}

export function DatabaseList({ changeDatabase }: { changeDatabase: (dbName: string) => Promise<void> }) {

  const [mockDatabases, setMockDatabases] = useState<DatabaseInfo[]>([])
  const [loading, setLoading] = useState(false)

  const query = `SELECT \
  datname AS name, \
  pg_size_pretty(pg_database_size(datname)) AS size, \
  (SELECT usename FROM pg_user WHERE usesysid = pg_database.datdba) AS owner \
FROM pg_database;`

  useEffect(() => {
    setLoading(true)
    ExecuteQuery(query)
      .then((result) => {
        console.log("Received database list:", result);
        if(result === null || typeof result.rows === 'string') {
          console.error("No database found or error in query execution. Result:", result);
          alert("No databases found or an error occurred while fetching the database list. Please check your connection and try again.");
          setMockDatabases([]);
          setLoading(false)
          return;
        }
        setMockDatabases(result.rows as DatabaseInfo[]);
      })
      .catch((error) => {
        console.error("Error fetching databases:", error);1
      })
      .finally(() => {
        setLoading(false);
      });
  },[])


  if (loading) {
    return (<div className="p-6 pt-20 text-center">

      <p className="text-foreground">Loading databases...</p>
    </div>);
  }

  if (mockDatabases.length === 0) {
    return (<div className="p-6 pt-20 text-center">
      <p className="text-foreground">No databases found.</p>
    </div>);
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Database className="w-6 h-6 text-primary" />
        <h1 className="text-foreground">Databases</h1>
      </div>

      <div className="grid gap-4">
        {mockDatabases.map((db) => (
          <div
            key={db.name}
            className="group bg-card border border-border rounded-lg p-4 hover:border-primary/50 cursor-pointer transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded">
                  <HardDrive className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-foreground">{db.name}</h3>
                  <p className="text-sm text-muted-foreground">Owner: {db.owner}</p>
                </div>
              </div>
              <div className="text-right group-hover:hidden">
                <p className="text-foreground">{db.size}</p>
              </div>
              <div className="text-right hidden group-hover:flex items-end gap-2">
                {/* bouton d'infos et de changement de connexion */}
                <button className="hidden group-hover:block px-3 py-1 bg-primary text-primary-foreground rounded border-2 border-blue-500 shadow-xs shadow-blue-500 hover:scale-102 transition-transform hover:cursor-pointer" onClick={(e) => {
                  e.stopPropagation();
                  alert(`Database: ${db.name}\nOwner: ${db.owner}\nSize: ${db.size}`);
                } }>
                  Info
                </button>
                <button className="hidden group-hover:block mt-2 px-3 py-1 bg-secondary text-secondary-foreground rounded border-2 border-green-500 shadow-xs shadow-green-500 hover:scale-102 transition-transform hover:cursor-pointer" onClick={(e) => {
                  e.stopPropagation();
                  changeDatabase(db.name);
                }}>
                  Switch
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
