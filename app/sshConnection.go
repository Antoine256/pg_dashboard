package app

import (
	"fmt"
	"os"

	"golang.org/x/crypto/ssh"
)

type SSHConfig struct {
	Host     string
	Port     string
	User     string
	Password string
	keyPath  string
}

func (a *App) ConnectSSH(config SSHConfig) error {

	// knownHosts, err := knownhosts.New(os.ExpandEnv("$HOME/.ssh/known_hosts"))
	// if err != nil {
	// 	return err
	// }

	sshConfig := &ssh.ClientConfig{
		User: config.User,
		Auth: []ssh.AuthMethod{
			ssh.Password(config.Password),
		},
		HostKeyCallback: ssh.InsecureIgnoreHostKey(), // à remplacer en production
		//HostKeyCallback: knownHosts, // à utiliser avec known_hosts
	}

	if config.keyPath != "" {
		// Utiliser la clé privée pour l'authentification
		key, _ := os.ReadFile(config.keyPath)
		signer, _ := ssh.ParsePrivateKey(key)
		sshConfig.Auth = []ssh.AuthMethod{
			ssh.PublicKeys(signer),
		}
	}

	client, err := ssh.Dial("tcp", config.Host+":"+config.Port, sshConfig)
	if err != nil {
		return err
	}
	a.sshClient = client
	return nil
}

func (a *App) RunSSHCommand(command string) (string, error) {
	if a.sshClient == nil {
		return "", fmt.Errorf("not connected via SSH")
	}

	session, err := a.sshClient.NewSession()
	if err != nil {
		return "", err
	}
	defer session.Close()

	out, err := session.Output(command)
	if err != nil {
		return "", err
	}
	return string(out), nil
}
