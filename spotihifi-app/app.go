package main

import (
	"context"
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"time"

	"spotihifi/backend"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// shutdown is called when the app closes
func (a *App) shutdown(ctx context.Context) {
}

// SearchResult represents a single search result
type SearchResult struct {
	ID       string `json:"id"`
	Name     string `json:"name"`
	Artist   string `json:"artist"`
	Album    string `json:"album"`
	Duration string `json:"duration"`
	Cover    string `json:"cover"`
	ISRC     string `json:"isrc"`
}

// SearchSpotify searches for tracks on Spotify
func (a *App) SearchSpotify(query string, limit int) ([]SearchResult, error) {
	if query == "" {
		return nil, fmt.Errorf("search query is required")
	}

	if limit <= 0 {
		limit = 20
	}

	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	results, err := backend.SearchSpotify(ctx, query, limit)
	if err != nil {
		return nil, err
	}

	var searchResults []SearchResult
	for _, item := range results.Tracks {
		searchResults = append(searchResults, SearchResult{
			ID:       item.ID,
			Name:     item.Name,
			Artist:   item.Artists,
			Album:    item.AlbumName,
			Duration: fmt.Sprintf("%d", item.Duration/1000/60) + ":" + fmt.Sprintf("%02d", (item.Duration/1000)%60),
			Cover:    item.Images,
			ISRC:     "",
		})
	}

	return searchResults, nil
}

// DownloadRequest represents a download request
type DownloadRequest struct {
	SpotifyID  string `json:"spotify_id"`
	TrackName  string `json:"track_name"`
	ArtistName string `json:"artist_name"`
	AlbumName  string `json:"album_name"`
	CoverURL   string `json:"cover_url"`
	ISRC       string `json:"isrc"`
	OutputDir  string `json:"output_dir"`
}

// DownloadResponse represents the download result
type DownloadResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
	File    string `json:"file,omitempty"`
	Error   string `json:"error,omitempty"`
}

// DownloadTrack downloads a track in FLAC format
func (a *App) DownloadTrack(req DownloadRequest) (DownloadResponse, error) {
	if req.SpotifyID == "" {
		return DownloadResponse{
			Success: false,
			Error:   "Spotify ID is required",
		}, fmt.Errorf("spotify ID is required")
	}

	if req.OutputDir == "" {
		homeDir, _ := os.UserHomeDir()
		req.OutputDir = filepath.Join(homeDir, "Music", "SpotiHiFi")
	}

	// Create output directory if it doesn't exist
	if err := os.MkdirAll(req.OutputDir, 0755); err != nil {
		return DownloadResponse{
			Success: false,
			Error:   fmt.Sprintf("Failed to create output directory: %v", err),
		}, err
	}

	// Use Tidal downloader (primary)
	downloader := backend.NewTidalDownloader("")

	filename, err := downloader.Download(
		req.SpotifyID,
		req.OutputDir,
		"LOSSLESS", // Always FLAC
		"title-artist",
		false, // includeTrackNumber
		0,     // position
		req.TrackName,
		req.ArtistName,
		req.AlbumName,
		"",    // albumArtist
		"",    // releaseDate
		false, // useAlbumTrackNumber
		req.CoverURL,
		true, // embedMaxQualityCover
		0,    // spotifyTrackNumber
		0,    // spotifyDiscNumber
		0,    // spotifyTotalTracks
		0,    // spotifyTotalDiscs
		"",   // copyright
		"",   // publisher
		fmt.Sprintf("https://open.spotify.com/track/%s", req.SpotifyID),
	)

	if err != nil {
		// Try Qobuz as fallback
		qobuzDownloader := backend.NewQobuzDownloader()
		filename, err = qobuzDownloader.DownloadByISRC(
			req.ISRC,
			req.OutputDir,
			"27", // FLAC quality
			"title-artist",
			false,
			0,
			req.TrackName,
			req.ArtistName,
			req.AlbumName,
			"",
			"",
			false,
			req.CoverURL,
			true,
			0, 0, 0, 0,
			"", "",
			fmt.Sprintf("https://open.spotify.com/track/%s", req.SpotifyID),
		)

		if err != nil {
			return DownloadResponse{
				Success: false,
				Error:   fmt.Sprintf("Download failed: %v", err),
			}, err
		}
	}

	return DownloadResponse{
		Success: true,
		Message: "Download completed successfully",
		File:    filename,
	}, nil
}

// GetDownloadProgress returns current download progress
func (a *App) GetDownloadProgress() backend.ProgressInfo {
	return backend.GetDownloadProgress()
}

// SelectFolder opens a folder selection dialog
func (a *App) SelectFolder() (string, error) {
	return runtime.OpenDirectoryDialog(a.ctx, runtime.OpenDialogOptions{
		Title: "Select Download Folder",
	})
}

// GetDefaultDownloadPath returns the default download path
func (a *App) GetDefaultDownloadPath() string {
	homeDir, _ := os.UserHomeDir()
	return filepath.Join(homeDir, "Music", "SpotiHiFi")
}

// GetVersion returns the app version
func (a *App) GetVersion() string {
	return "3.0.0"
}

// Settings struct for app configuration
type Settings struct {
	DownloadPath string `json:"download_path"`
}

// LoadSettings loads app settings
func (a *App) LoadSettings() (Settings, error) {
	homeDir, _ := os.UserHomeDir()
	configPath := filepath.Join(homeDir, ".spotihifi", "settings.json")

	defaultSettings := Settings{
		DownloadPath: filepath.Join(homeDir, "Music", "SpotiHiFi"),
	}

	data, err := os.ReadFile(configPath)
	if err != nil {
		return defaultSettings, nil
	}

	var settings Settings
	if err := json.Unmarshal(data, &settings); err != nil {
		return defaultSettings, nil
	}

	return settings, nil
}

// SaveSettings saves app settings
func (a *App) SaveSettings(settings Settings) error {
	homeDir, _ := os.UserHomeDir()
	configDir := filepath.Join(homeDir, ".spotihifi")
	configPath := filepath.Join(configDir, "settings.json")

	if err := os.MkdirAll(configDir, 0755); err != nil {
		return err
	}

	data, err := json.MarshalIndent(settings, "", "  ")
	if err != nil {
		return err
	}

	return os.WriteFile(configPath, data, 0644)
}
