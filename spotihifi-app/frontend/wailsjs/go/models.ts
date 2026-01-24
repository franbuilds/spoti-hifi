export namespace backend {
	
	export class ProgressInfo {
	    is_downloading: boolean;
	    mb_downloaded: number;
	    speed_mbps: number;
	
	    static createFrom(source: any = {}) {
	        return new ProgressInfo(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.is_downloading = source["is_downloading"];
	        this.mb_downloaded = source["mb_downloaded"];
	        this.speed_mbps = source["speed_mbps"];
	    }
	}

}

export namespace main {
	
	export class DownloadRequest {
	    spotify_id: string;
	    track_name: string;
	    artist_name: string;
	    album_name: string;
	    cover_url: string;
	    isrc: string;
	    output_dir: string;
	
	    static createFrom(source: any = {}) {
	        return new DownloadRequest(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.spotify_id = source["spotify_id"];
	        this.track_name = source["track_name"];
	        this.artist_name = source["artist_name"];
	        this.album_name = source["album_name"];
	        this.cover_url = source["cover_url"];
	        this.isrc = source["isrc"];
	        this.output_dir = source["output_dir"];
	    }
	}
	export class DownloadResponse {
	    success: boolean;
	    message: string;
	    file?: string;
	    error?: string;
	
	    static createFrom(source: any = {}) {
	        return new DownloadResponse(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.success = source["success"];
	        this.message = source["message"];
	        this.file = source["file"];
	        this.error = source["error"];
	    }
	}
	export class SearchResult {
	    id: string;
	    name: string;
	    artist: string;
	    album: string;
	    duration: string;
	    cover: string;
	    isrc: string;
	
	    static createFrom(source: any = {}) {
	        return new SearchResult(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.name = source["name"];
	        this.artist = source["artist"];
	        this.album = source["album"];
	        this.duration = source["duration"];
	        this.cover = source["cover"];
	        this.isrc = source["isrc"];
	    }
	}
	export class Settings {
	    download_path: string;
	
	    static createFrom(source: any = {}) {
	        return new Settings(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.download_path = source["download_path"];
	    }
	}

}

