import { HardDrive, Table } from "lucide-react";
import { useEffect, useState } from "preact/compat";
import { ExecuteQuery } from "../../../wailsjs/go/app/App";

interface TableInfo {
    tablename: string;
}

export function TableList({handleQuery}: {handleQuery: (queries: string[], queryIndex: number) => void}) {
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
                setMockTables(result.rows as TableInfo[]);
            })
            .catch((error) => {
                console.error("Error fetching tables:", error);
                alert("An error occurred while fetching the table list. Error: " + error);
                setMockTables([]); 
            }).finally(() => {
                setLoading(false);
            });
    }, [])


    function handleTableQuery(tableName: string, action: number) {
        const queries : string[] = []
        //Get all columns to add in queries select upadte insert and delete
        // and select the good query based on action
        ExecuteQuery(`SELECT column_name FROM information_schema.columns WHERE table_name = '${tableName}';`)
        .then((result) => {
            var rows = result.rows
            if(rows === null || typeof rows === 'string') {
                console.error("No columns found or error in query execution. Result:", rows);
                alert("No columns found or an error occurred while fetching the column list for table " + tableName + ". Please check your connection and try again.");
                return;
            }
            const columns = (rows as { column_name: string }[]).map(col => col.column_name);
            if(columns.length === 0) {
                alert("No columns found for table " + tableName + ". Cannot perform " + action + " action.");
                return;
            }
            //construct the four queries
            const selectQuery = `SELECT ${columns.join(', ')} FROM ${tableName} LIMIT 100;`
            const insertQuery = `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${columns.map(_ => '?').join(', ')});`
            const updateQuery = `UPDATE ${tableName} SET ${columns.map(col => `${col} = ?`).join(', ')} WHERE <condition>;`
            const deleteQuery = `DELETE FROM ${tableName} WHERE <condition>;`
            queries.push(selectQuery, insertQuery, updateQuery, deleteQuery);
            handleQuery(queries, action);
        })
        .catch((error) => {
            console.error("Error fetching columns for table " + tableName + ":", error);
            alert("An error occurred while fetching the column list for table " + tableName + ". Error: " + error);
        });
    }

    if (loading) {
        return (<div className="p-6 pt-20 text-center">
    
        <p className="text-foreground">Loading tables...</p>
      </div>);
    }

    if (mockTables.length === 0) {
        return (<div className="p-6 pt-20 text-center">
          <p className="text-foreground">No tables found.</p>
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
                    <div className="flex items-start justify-between group">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded">
                            <HardDrive className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                            <h3 className="text-foreground">{db.tablename}</h3>
                            </div>
                        </div>
                        <div class="text-right hidden group-hover:flex items-end gap-2">
                            {/* actions like select, update, delete can go here */}
                            <button className="hidden group-hover:block px-3 py-1 bg-secondary text-secondary-foreground rounded border-2 border-blue-500 shadow-xs shadow-blue-500 hover:scale-102 transition-transform hover:cursor-pointer" onClick={(e) => {
                                e.stopPropagation();
                                    handleTableQuery(db.tablename, 0);
                                }}>
                                Select
                            </button>
                            <button className="hidden group-hover:block px-3 py-1 bg-secondary text-secondary-foreground rounded border-2 border-green-500 shadow-xs shadow-green-500 hover:scale-102 transition-transform hover:cursor-pointer" onClick={(e) => {
                                e.stopPropagation();
                                    handleTableQuery(db.tablename, 1);
                                }}>
                                Insert
                            </button>
                            <button className="hidden group-hover:block px-3 py-1 bg-secondary text-secondary-foreground rounded border-2 border-yellow-500 shadow-xs shadow-yellow-500 hover:scale-102 transition-transform hover:cursor-pointer" onClick={(e) => {
                                e.stopPropagation();
                                    handleTableQuery(db.tablename, 2);
                                }}>
                                Update
                            </button>
                            <button className="hidden group-hover:block px-3 py-1 bg-secondary text-secondary-foreground rounded border-2 border-red-500 shadow-xs shadow-red-500 hover:scale-102 transition-transform hover:cursor-pointer" onClick={(e) => {
                                e.stopPropagation();
                                    handleTableQuery(db.tablename, 3);
                                }}>
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
                ))}
            </div>
        </div>
    );
}