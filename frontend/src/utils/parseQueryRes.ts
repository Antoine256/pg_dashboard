export function parseQueryRes(res: Record<string, any>[], executionTime: number): { columns: string[], rows: string[][], rowCount: number, executionTime: number } | string {
    try {
        if (res.length === 0) return { columns: [], rows: [], rowCount: 0, executionTime: executionTime };

        const columns = Object.keys(res[0]);
        const rows = res.map(row => columns.map(col => {
            const val = row[col];
            if (val === null || val === undefined) return 'NULL';
            return String(val);
        }));

        return { columns, rows, rowCount: rows.length, executionTime: executionTime };
    } catch (error) {
        return String(error);
    }
}
