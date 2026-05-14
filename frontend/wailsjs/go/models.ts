export namespace app {
	
	export class AppConfig {
	    lastHost: string;
	    lastPort: string;
	    lastUser: string;
	    lastDatabase: string;
	    lastLogFileAnalyzed: string;
	
	    static createFrom(source: any = {}) {
	        return new AppConfig(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.lastHost = source["lastHost"];
	        this.lastPort = source["lastPort"];
	        this.lastUser = source["lastUser"];
	        this.lastDatabase = source["lastDatabase"];
	        this.lastLogFileAnalyzed = source["lastLogFileAnalyzed"];
	    }
	}
	export class LogalyzeParams {
	    File: string;
	    NbLines: number;
	    Severity: string;
	    StartDate: string;
	    EndDate: string;
	    Type: string;
	
	    static createFrom(source: any = {}) {
	        return new LogalyzeParams(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.File = source["File"];
	        this.NbLines = source["NbLines"];
	        this.Severity = source["Severity"];
	        this.StartDate = source["StartDate"];
	        this.EndDate = source["EndDate"];
	        this.Type = source["Type"];
	    }
	}
	export class QueryResult {
	    rows: any[];
	    columns: string[];
	    elapsed: number;
	
	    static createFrom(source: any = {}) {
	        return new QueryResult(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.rows = source["rows"];
	        this.columns = source["columns"];
	        this.elapsed = source["elapsed"];
	    }
	}
	export class SSHConfig {
	    Host: string;
	    Port: string;
	    User: string;
	    Password: string;
	
	    static createFrom(source: any = {}) {
	        return new SSHConfig(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Host = source["Host"];
	        this.Port = source["Port"];
	        this.User = source["User"];
	        this.Password = source["Password"];
	    }
	}

}

