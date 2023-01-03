export interface PlaylistResponse extends Array<Playlist>{}

export interface Playlist {
    title: string
    description: string
    likes: number
    url: string
    status: string
    notes: string
    submittedSongs: string[]
}