import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { PlaylistResponse } from './playlist-response';
import data from './data.json'
@Injectable({
  providedIn: 'root'
})
export class PlaylistsService {

  getPlaylists(): Observable<PlaylistResponse> {

    return of(data)
  }
}
