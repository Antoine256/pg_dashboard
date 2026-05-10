import { Database, HardDrive } from 'lucide-react';

interface DatabaseInfo {
  name: string;
  size: string;
  tables: number;
  owner: string;
}

const mockDatabases: DatabaseInfo[] = [
  { name: 'production_db', size: '2.4 GB', tables: 47, owner: 'postgres' },
  { name: 'staging_db', size: '1.8 GB', tables: 45, owner: 'postgres' },
  { name: 'analytics', size: '5.2 GB', tables: 23, owner: 'analytics_user' },
  { name: 'auth_service', size: '340 MB', tables: 12, owner: 'auth_admin' },
  { name: 'logging', size: '12.7 GB', tables: 8, owner: 'logger' },
];

export function DatabaseList() {
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
            className="bg-card border border-border rounded-lg p-4 hover:border-primary/50 cursor-pointer transition-colors"
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
              <div className="text-right">
                <p className="text-foreground">{db.size}</p>
                <p className="text-sm text-muted-foreground">{db.tables} tables</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
