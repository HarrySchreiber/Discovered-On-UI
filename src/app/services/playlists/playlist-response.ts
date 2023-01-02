export interface PlaylistResponse extends Array<Playlist>{}

export interface Playlist {
    title: string
    description: string
    likes: number
    url: string
}