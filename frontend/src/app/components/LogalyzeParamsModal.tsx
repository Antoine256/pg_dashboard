import { Check, ChevronDown, X } from "lucide-react";
import { useEffect, useRef, useState } from "preact/compat";
import { LogalyzeParams } from "./Logs";

interface LogalyzeParamsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: LogalyzeParams) => void;
    params: LogalyzeParams;
}

const severities = [
    "DEBUG",
    "INFO",
    "NOTICE",
    "WARNING",
    "ERROR",
    "FATAL",
    "PANIC",
    "ALL",
  ];

const types = [
    "CONNECTION",
    "QUERY",
    "DURATION",
    "CHECKPOINT",
    "STARTUP",
    "SHUTDOWN",
    "APPLI",
    "ALL",
]

export function LogalyzeParamsModal( { isOpen, onClose, onSubmit, params }: LogalyzeParamsModalProps ) {
    const [severityMenuIsOpen, setSeverityMenuIsOpen] = useState(false);
    const [typeMenuIsOpen, setTypeMenuIsOpen] = useState(false);
    const [parameters, setParameters] = useState<LogalyzeParams>(params);

    const severityRef = useRef<HTMLDivElement>(null);
    const typeRef = useRef<HTMLDivElement>(null);

    useEffect(() => {

        setParameters(params);

        function handleClickOutside(event: MouseEvent) {
        if (
            severityRef.current &&
            !severityRef.current.contains(event.target as Node)
        ) {
            setSeverityMenuIsOpen(false);
        }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [params]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card backdrop-blur-lg border border-border rounded-lg w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-foreground">Logalyze parameters</h2>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
    
            <form className="space-y-4">
              <div>
                <label className="block text-sm text-muted-foreground mb-1">File</label>
                <input
                  type="text"
                  value={parameters.File}
                  onChange={(e)=>{
                    console.log("Updating File parameter:", (e.target as HTMLInputElement).value);
                    setParameters(prev => ({ ...prev, File: (e.target as HTMLInputElement).value }));
                  }}
                  className="w-full bg-input-background border border-border rounded px-3 py-2 text-foreground"
                  required
                />
              </div>
    
              <div className={`flex gap-2 `}>
                <div>
                    <label className="block text-sm text-muted-foreground mb-1">Start Date</label>
                    <input
                    type="text"
                    value={parameters.StartDate}
                    onChange={(e)=>{
                        setParameters(prev => ({ ...prev, StartDate: (e.target as HTMLInputElement).value }));
                    }}
                    className="w-full bg-input-background border border-border rounded px-3 py-2 text-foreground"
                    required
                    />
                </div>
                <div>
                    <label className="block text-sm text-muted-foreground mb-1">End Date</label>
                    <input
                    type="text"
                    value={parameters.EndDate}
                    onChange={(e)=>{
                        setParameters(prev => ({ ...prev, EndDate: (e.target as HTMLInputElement).value }));
                    }}
                    className="w-full bg-input-background border border-border rounded px-3 py-2 text-foreground"
                    required
                    />
                </div>
              </div>
              <div ref={severityRef} className="relative">
                <label className="mb-1 block text-sm text-muted-foreground">
                Severity
                </label>

                <button
                type="button"
                onClick={() => {
                    setTypeMenuIsOpen(false)
                    setSeverityMenuIsOpen(!severityMenuIsOpen)
                }}
                className="flex w-full items-center justify-between rounded border border-border bg-input-background px-3 py-2 text-left text-foreground transition-colors hover:border-primary focus:border-primary focus:outline-none"
                >
                <span>{parameters.Severity}</span>

                <ChevronDown
                    className={`h-4 w-4 text-muted-foreground transition-transform ${
                    severityMenuIsOpen ? "rotate-180" : ""
                    }`}
                />
                </button>

                {severityMenuIsOpen && (
                <div className="relative">
                    <div className={`absolute z-50 mt-2 w-full max-h-30 min-bottom scroll-smooth overflow-y-auto overscroll-contain rounded-md border border-white/10 shadow-xl isolate bg-black/80`}>
                        {severities.map((severity) => {
                        const isSelected =
                            parameters.Severity === severity;

                        return (
                            <button
                            key={severity}
                            type="button"
                            onClick={() => {
                                setParameters(prev => ({ ...prev, Severity: severity }));
                                setSeverityMenuIsOpen(false);
                            }} 
                            className={`flex w-full items-center justify-between px-3 py-2 text-sm text-muted-foreground  transition-colors cursor-pointer hover:bg-white/10 hover:text-foreground ${
                                isSelected
                                ? "bg-primary text-primary-foreground"
                                : "text-muted-foreground hover:bg-primary/10 hover:text-foreground"
                            }`}
                            >
                            <span>{severity}</span>

                            {isSelected && (
                                <Check className="h-4 w-4" />
                            )}
                            </button>
                        );
                        })}
                    </div>
                </div>
                )}
              </div>
              <div className={`grid grid-cols-3 gap-2`}>
              <div ref={typeRef} className="relative col-span-2">
                <label className="mb-1 block text-sm text-muted-foreground">
                Type
                </label>

                <button
                type="button"
                onClick={() =>{
                    setSeverityMenuIsOpen(false)
                    setTypeMenuIsOpen(!typeMenuIsOpen)
                }}
                className="flex w-full items-center justify-between rounded border border-border bg-input-background px-3 py-2 text-left text-foreground transition-colors hover:border-primary focus:border-primary focus:outline-none"
                >
                <span>{parameters.Type}</span>

                <ChevronDown
                    className={`h-4 w-4 text-muted-foreground transition-transform ${
                    typeMenuIsOpen ? "rotate-180" : ""
                    }`}
                />
                </button>

                {typeMenuIsOpen && (
                <div className="relative">
                    <div className={`absolute z-50 mt-2 w-full max-h-30 min-bottom scroll-smooth overflow-y-auto overscroll-contain rounded-md border border-white/10 shadow-xl isolate bg-black/80`}>
                        {types.map((type) => {
                        const isSelected =
                            parameters.Type === type;
                        return (
                            <button
                            key={type}
                            type="button"
                            onClick={() => {
                                setParameters(prev => ({ ...prev, Type: type }));
                                setTypeMenuIsOpen(false);
                            }} 
                            className={`flex w-full items-center justify-between px-3 py-2 text-sm text-muted-foreground  transition-colors cursor-pointer hover:bg-white/10 hover:text-foreground ${
                                isSelected
                                ? "bg-primary text-primary-foreground"
                                : "text-muted-foreground hover:bg-primary/10 hover:text-foreground"
                            }`}
                            >
                            <span>{type}</span>

                            {isSelected && (
                                <Check className="h-4 w-4" />
                            )}
                            </button>
                        );
                        })}
                    </div>
                </div>
                )}
              </div>
                <div>
                    <label className="block text-sm text-muted-foreground mb-1">Nb lines</label>
                    <input
                    type="number"
                    value={parameters.NbLines}
                    onChange={(e)=>{
                        setParameters(prev => ({ ...prev, NbLines: Number((e.target as HTMLInputElement).value) }))
                    }}
                    className="w-full bg-input-background border border-border rounded px-3 py-2 text-foreground"
                    required
                    />
                </div>
              </div>
    
              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 rounded hover:bg-accent text-foreground cursor-pointer hover:scale-105 transition-transform border border-red-500 shadow-red-500 shadow-sm"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => onSubmit(parameters)}
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 cursor-pointer hover:scale-105 transition-transform border border-green-500 shadow-green-500 shadow-sm"
                >
                  Analyze
                </button>
              </div>
            </form>
          </div>
        </div>
      );
    }