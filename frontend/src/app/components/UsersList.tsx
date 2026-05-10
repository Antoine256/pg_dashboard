import { Users, Shield, User } from 'lucide-react';

interface UserInfo {
  username: string;
  role: string;
  databases: string[];
  canLogin: boolean;
  isSuper: boolean;
}

const mockUsers: UserInfo[] = [
  { username: 'postgres', role: 'superuser', databases: ['All'], canLogin: true, isSuper: true },
  { username: 'analytics_user', role: 'user', databases: ['analytics'], canLogin: true, isSuper: false },
  { username: 'auth_admin', role: 'admin', databases: ['auth_service'], canLogin: true, isSuper: false },
  { username: 'logger', role: 'user', databases: ['logging'], canLogin: true, isSuper: false },
  { username: 'readonly_user', role: 'readonly', databases: ['production_db', 'staging_db'], canLogin: true, isSuper: false },
  { username: 'backup_user', role: 'service', databases: ['All'], canLogin: false, isSuper: false },
];

export function UsersList() {
  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Users className="w-6 h-6 text-primary" />
        <h1 className="text-foreground">Database Users</h1>
      </div>

      <div className="border border-border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="text-left px-4 py-3 text-sm text-muted-foreground">Username</th>
              <th className="text-left px-4 py-3 text-sm text-muted-foreground">Role</th>
              <th className="text-left px-4 py-3 text-sm text-muted-foreground">Databases</th>
              <th className="text-center px-4 py-3 text-sm text-muted-foreground">Can Login</th>
              <th className="text-center px-4 py-3 text-sm text-muted-foreground">Superuser</th>
            </tr>
          </thead>
          <tbody>
            {mockUsers.map((user, index) => (
              <tr
                key={user.username}
                className={`${
                  index !== mockUsers.length - 1 ? 'border-b border-border' : ''
                } hover:bg-accent/50`}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground">{user.username}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded text-sm">
                    {user.isSuper && <Shield className="w-3 h-3" />}
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground text-sm">
                  {user.databases.join(', ')}
                </td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={`inline-block w-2 h-2 rounded-full ${
                      user.canLogin ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  />
                </td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={`inline-block w-2 h-2 rounded-full ${
                      user.isSuper ? 'bg-green-500' : 'bg-muted'
                    }`}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
