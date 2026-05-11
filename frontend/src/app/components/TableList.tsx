import { HardDrive, Table } from "lucide-react";
import { useEffect, useState } from "preact/compat";
import { ExecuteQuery } from "../../../wailsjs/go/main/App";

interface TableInfo {
    tablename: string;
}

export function TableList() {
    const [mockTables, setMockTables] = useState<TableInfo[]>([]);
    const [loading, setLoading] = useState(false);

    const query = `SELECT tablename FROM pg_tables WHERE schemaname NOT IN ('pg_catalog', 'information_schema');`

    useEffect(() => {
        setLoading(true);
        ExecuteQuery(query)
            .then((result) => {
                console.log("Received table list:", result);
                if(result === null || typeof result === 'string') {
                    console.error("No tables found or error in query execution. Result:", result);
                    alert("No tables found or an error occurred while fetching the table list. Please check your connection and try again.");
                    setMockTables([]);
                    setLoading(false)
                    return;
                }
                setMockTables(result as TableInfo[]);
            })
            .catch((error) => {
                console.error("Error fetching tables:", error);
                alert("An error occurred while fetching the table list. Error: " + error);
                setMockTables([]); 
            }).finally(() => {
                setLoading(false);
            });
    }, [])

    if (loading) {
        return (<div className="p-6 pt-20 text-center">
    
        <p className="text-foreground">Loading tables...</p>
      </div>);
    }

    if (mockTables.length === 0) {
        return (<div className="p-6 pt-20 text-center">
          <p className="text-foreground">No databases found.</p>
        </div>);
      }

    return (
        <div className="p-6">
            <div className="flex items-center gap-2 mb-6">
                <Table className="w-6 h-6 text-primary" />
                <h1 className="text-foreground">Tables</h1>
            </div>
            <div className="grid gap-4">
                {mockTables.map((db) => (
                <div
                    key={db.tablename}
                    className="bg-card border border-border rounded-lg p-4 hover:border-primary/50 cursor-pointer transition-colors"
                >
                    <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded">
                        <HardDrive className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                        <h3 className="text-foreground">{db.tablename}</h3>
                        </div>
                    </div>
                    </div>
                </div>
                ))}
            </div>
        </div>
    );
}