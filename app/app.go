package app

import (
	"context"
	"database/sql"
	"fmt"
	"time"

	_ "github.com/lib/pq"
	"golang.org/x/crypto/ssh"
)

// App struct
type App struct {
	ctx       context.Context
	db        *sql.DB
	sshClient *ssh.Client
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// Startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) Startup(ctx context.Context) {
	a.ctx = ctx
}

func (a *App) Connect(host, port, user, password, dbname string) error {
	dsn := fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		host, port, user, password, dbname,
	)
	db, err := sql.Open("postgres", dsn)
	if err != nil {
		return err
	}
	if err := db.Ping(); err != nil {
		return err
	}
	a.db = db
	return nil
}

func (a *App) Disconnect() {
	if a.db != nil {
		a.db.Close()
		a.db = nil
	}
}

type QueryResult struct {
	Rows    []map[string]interface{} `json:"rows"`
	Columns []string                 `json:"columns"`
	Elapsed float64                  `json:"elapsed"`
}

func (a *App) ExecuteQuery(query string) (QueryResult, error) {

	startTime := time.Now()

	rows, err := a.db.Query(query)
	if err != nil {
		return QueryResult{}, err
	}
	defer rows.Close()

	elapsed := time.Since(startTime).Seconds()

	cols, _ := rows.Columns()
	var results []map[string]interface{}

	for rows.Next() {
		vals := make([]interface{}, len(cols))
		ptrs := make([]interface{}, len(cols))
		for i := range vals {
			ptrs[i] = &vals[i]
		}
		rows.Scan(ptrs...)
		row := make(map[string]interface{})
		for i, col := range cols {
			if b, ok := vals[i].([]byte); ok {
				row[col] = string(b) // convertit []byte en string
			} else {
				row[col] = vals[i]
			}
		}
		results = append(results, row)
	}

	fmt.Printf("Query results: \n"+"%v\n", results)
	if (len(results) == 0) && rows.Err() == nil {
		return QueryResult{
			Rows:    []map[string]interface{}{},
			Columns: []string{},
			Elapsed: elapsed,
		}, nil
	}
	return QueryResult{
		Rows:    results,
		Columns: cols,
		Elapsed: elapsed,
	}, nil
}
