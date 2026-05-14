package app

import (
	"encoding/json"
	"os"
	"path/filepath"
)

type AppConfig struct {
	LastHost string `json:"lastHost"`
	LastPort string `json:"lastPort"`
	LastUser string `json:"lastUser"`
	//LastSSHKeyPath      string `json:"lastSSHKeyPath"`
	LastDatabase        string `json:"lastDatabase"`
	LastLogFileAnalyzed string `json:"lastLogFileAnalyzed"`
}

func configPath() (string, error) {
	dir, err := os.UserConfigDir()
	if err != nil {
		return "", err
	}
	appDir := filepath.Join(dir, "pg_dashboard")
	os.MkdirAll(appDir, 0755)
	return filepath.Join(appDir, "config.json"), nil
}

func (a *App) SaveConfig(config AppConfig) error {
	path, err := configPath()
	if err != nil {
		return err
	}
	data, err := json.MarshalIndent(config, "", "  ")
	if err != nil {
		return err
	}
	return os.WriteFile(path, data, 0644)
}

func (a *App) LoadConfig() (AppConfig, error) {
	path, err := configPath()
	if err != nil {
		return AppConfig{}, err
	}
	data, err := os.ReadFile(path)
	if err != nil {
		if os.IsNotExist(err) {
			return AppConfig{}, nil // pas de config, retourne vide
		}
		return AppConfig{}, err
	}
	var config AppConfig
	err = json.Unmarshal(data, &config)
	return config, err
}
