export interface PlaylistResponse extends Array<Playlist>{}

export interface Playlist {
    title: string
    description: string
    likes: number
    url: string
    playlistStatus: string
    notes: string
    submittedSongs: string[]
}