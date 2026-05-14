package app

import (
	"fmt"
	"os/exec"
	"strings"
)

type LogalyzeParams struct {
	File      string
	NbLines   int
	Severity  string
	StartDate string
	EndDate   string
	Type      string
}

func (a *App) Pglogalyze(params LogalyzeParams) (string, error) {
	if a.sshClient != nil {
		return a.pglogalyzeRemote(params)
	}
	return a.pglogalyzeLocal(params)
}

func buildPglogalyzeArgs(params LogalyzeParams) []string {

	args := []string{"-f", params.File}
	if params.StartDate != "" {
		args = append(args, "-st", params.StartDate)
	}
	if params.EndDate != "" {
		args = append(args, "-et", params.EndDate)
	}
	if params.Type != "" {
		args = append(args, "-t", params.Type)
	}
	if params.NbLines > 0 {
		args = append(args, "-n", fmt.Sprintf("%d", params.NbLines))
	}
	if params.Severity != "" {
		args = append(args, "-l", params.Severity)
	}
	return args
}

func (a *App) pglogalyzeLocal(params LogalyzeParams) (string, error) {
	// Vérifier que pglogalyze est installé
	_, err := exec.LookPath("pglogalyze")
	if err != nil {
		return "", fmt.Errorf("pglogalyze is not installed or not in PATH")
	}

	fmt.Printf("Running pglogalyze with parameters: %+v\n", params)

	args := buildPglogalyzeArgs(params)

	fmt.Printf("Executing command: pglogalyze %s\n", strings.Join(args, " "))

	out, err := exec.Command("pglogalyze", args...).Output()
	if err != nil {
		return "", fmt.Errorf("pglogalyze error: %w", err)
	}
	return string(out), nil
}

func (a *App) pglogalyzeRemote(params LogalyzeParams) (string, error) {
	// Vérifier que pglogalyze est installé sur le serveur distant
	session, err := a.sshClient.NewSession()
	if err != nil {
		return "", err
	}
	out, err := session.Output("which pglogalyze")
	session.Close()
	if err != nil || strings.TrimSpace(string(out)) == "" {
		return "", fmt.Errorf("pglogalyze is not installed on the remote server")
	}

	// Construire et lancer la commande distante
	args := buildPglogalyzeArgs(params)
	command := "pglogalyze " + strings.Join(args, " ")

	session, err = a.sshClient.NewSession()
	if err != nil {
		return "", err
	}
	defer session.Close()

	out, err = session.Output(command)
	if err != nil {
		return "", fmt.Errorf("pglogalyze error: %w", err)
	}
	return string(out), nil
}
