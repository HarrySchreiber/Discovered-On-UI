import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { PlaylistResponse } from './playlist-response';
import data from './data.json'
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class PlaylistsService {

  constructor(private httpClient: HttpClient) {}

  readonly BASE_URL = "https://k2tduvae9i.execute-api.us-east-1.amazonaws.com/prod"

  getPlaylists(): Observable<PlaylistResponse> {
    return this.httpClient.get<PlaylistResponse>(this.BASE_URL + "/playlists")
  }

  updateDB(url: any, updateKey: any, updateValue: any) {
    const body = {
      url: url,
      updateKey: updateKey,
      updateValue: updateValue
    }
    return this.httpClient.patch(this.BASE_URL + "/playlist", body)
  }
}
