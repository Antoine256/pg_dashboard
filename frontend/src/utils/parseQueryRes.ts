export function parseQueryRes(res: { rows: Record<string, any>[], columns: string[], elapsed: number }, executionTime: number): { columns: string[], rows: string[][], rowCount: number, executionTime: number } | string {
    try {
        if (res.rows.length === 0) return { columns: [], rows: [], rowCount: 0, executionTime: executionTime };

        const columns = res.columns;
        const rows = res.rows.map(row => columns.map(col => {
            const val = row[col];
            if (val === null || val === undefined) return 'NULL';
            return String(val);
        }));

        return { columns, rows, rowCount: rows.length, executionTime: executionTime };
    } catch (error) {
        return String(error);
    }
}
