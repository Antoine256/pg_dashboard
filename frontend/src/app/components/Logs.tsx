import { ScrollText, Settings, Trash2 } from "lucide-react";
import { LogalyzeParamsModal } from "./LogalyzeParamsModal";
import { useEffect, useState } from "preact/compat";
import { LoadConfig, Pglogalyze, SaveConfig } from "../../../wailsjs/go/app/App";
import AnsiToHtml from 'ansi-to-html';

export interface LogalyzeParams {
  File: string;
  NbLines: number;
  Severity: string;
  StartDate: string;
  EndDate: string;
  Type: string;
}


export function Logs() {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string>("");
  const [parameters, setParameters] = useState<LogalyzeParams>({
      File: '',
      NbLines: 20,
      StartDate: '',
      EndDate: '',
      Severity: 'ALL',
      Type: 'ALL',
  });

  const convert = new AnsiToHtml();

  useEffect(() => {
    console.log("Loading config to get last log file analyzed...");
    setLoading(true);
    LoadConfig().then(config => {
      if(config.lastLogFileAnalyzed) {
        setParameters(prev => ({ ...prev, File: config.lastLogFileAnalyzed }));
      }
      console.log("Config loaded successfully:", parameters);
    }).catch(error => {
      console.error("Error loading config:", error);
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  function handleSubmit(data: LogalyzeParams) {
    setIsModalOpen(false);
    console.log("Submitting logalyze parameters:", data);
    setLoading(true);
    setParameters(data);
    Pglogalyze(data).then((result) => {
      console.log("pglogalyze result:", result);
      setLogs(result);
      try{
        LoadConfig().then(config => {
          SaveConfig({lastUser: config.lastUser, lastHost: config.lastHost, lastPort: config.lastPort, lastDatabase: config.lastDatabase, lastLogFileAnalyzed: data.File});
        });
      } catch (error) {
        console.error("Error saving config:", error);
      }
      setLoading(false);
    }).catch((error) => {
      console.error("Error running pglogalyze:", error);
      alert("An error occurred while running pglogalyze. Error: " + error);
      setLoading(false);
    });
  }

  function renderLogOutput(raw: string): string {
      return convert.toHtml(raw);
  }


  return (
    <div className="p-6 h-screen overflow-hidden flex flex-col">
      <div className="flex items-center gap-2 mb-6">
        <ScrollText className="w-6 h-6 text-primary" />
        <h1 className="text-foreground">Logs</h1>
        <div className="ml-auto border-2 p-2 group cursor-pointer hover:border-slate-500 rounded-lg border-white flex items-center gap-2"
          onClick={() => {
            setIsModalOpen(true);
          }}
        >
          <span aria-disabled={true}>Parameters</span>
          <Settings className="w-4 h-4 group-hover:animate-spin" />
        </div>
      </div>
      <div className="border flex flex-col border-border rounded-lg overflow-hidden bg-card h-full">
          <div className="bg-muted px-4 py-2 flex items-center justify-between border-b border-border">
            <span className="text-sm text-muted-foreground">Latest Logs</span>
            <div className="flex gap-2">
              <button
                onClick={() => {
                }}
                className="p-1 hover:bg-accent rounded text-muted-foreground hover:text-foreground"
                title="Clear"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="w-full p-4 h-full bg-card text-foreground font-mono text-sm resize-none overflow-auto">
            {loading 
              ? "Loading logs..." 
              : logs 
                ? <pre dangerouslySetInnerHTML={{ __html: renderLogOutput(logs) }}/>
                : "Configure your pglogalyze command and add your connection to see the latest logs here."
            }
          </div>
        </div>

          <LogalyzeParamsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleSubmit} params={parameters} />
    </div>
  );
}
