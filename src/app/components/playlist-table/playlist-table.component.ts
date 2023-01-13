import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, Form, FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatTableDataSource } from '@angular/material/table';
import { Playlist, PlaylistResponse } from 'src/app/services/playlists/playlist-response';
import { PlaylistsService } from 'src/app/services/playlists/playlists.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-playlist-table',
  templateUrl: './playlist-table.component.html',
  styleUrls: ['./playlist-table.component.scss']
})
export class PlaylistTableComponent implements OnInit {

  PLAYLIST_DATA: PlaylistResponse = []
  parentForm!: FormGroup;
  formArray!: FormArray
  filterForm!: FormGroup;

  constructor(private playlistService: PlaylistsService, private formBuilder: FormBuilder) { }

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  displayedColumns: string[] = ['title', 'likes', 'description', 'playlistStatus', 'submittedSongs', 'notes'];
  dataSource!: MatTableDataSource<any>
  ngOnInit(): void {
    this.formArray = this.formBuilder.array([])
    this.parentForm = this.formBuilder.group({
      formArray: this.formArray
    })
    this.dataSource = new MatTableDataSource(this.formArray.controls)
    this.playlistService.getPlaylists().subscribe({
      next: (v) => {
        this.PLAYLIST_DATA = v
        this.PLAYLIST_DATA.forEach((playlist) => {
          this.formArray.push(this.formBuilder.group({
            title: playlist.title,
            likes: playlist.likes,
            description: playlist.description,
            url: playlist.url,
            playlistStatus: playlist.playlistStatus,
            submittedSongs: this.formBuilder.control(playlist.submittedSongs),
            notes: playlist.notes
          }))
        })
        this.dataSource = new MatTableDataSource(this.formArray.controls)

      }
    })

    this.filterForm = this.formBuilder.group({
      unprocessed: true,
      submitted: true,
      accepted: true,
      denied: true,
      ignore: true,
      search: this.formBuilder.array([]),
    })

    this.filterForm.valueChanges.subscribe((value) => {
      this.runFilters(value)
    })

  }

  updateDB(index: number, updateKey: string) {
    this.runFilters(this.filterForm.value)
    const currentPlaylist = this.dataSource.data.at(index).value as Playlist;
    var updateValue;
    switch(true){
      case updateKey === 'playlistStatus':
        updateValue = currentPlaylist.playlistStatus
        break
      case updateKey === 'submittedSongs':
        updateValue = currentPlaylist.submittedSongs
        break
      case updateKey === 'notes':
        updateValue = currentPlaylist.notes
        break
    }
    this.playlistService.updateDB(currentPlaylist.url, updateKey, updateValue).subscribe({
      next: (v) => console.log(v),
      error: (e) => console.error(e)
    })
  }

  addSearchTerm(event: MatChipInputEvent) {
    const input = event.input;
    const value = event.value;

    // Add our search term
    if ((value || '').trim()) {
      (this.filterForm.controls['search'] as FormArray).push(this.formBuilder.control(value.trim()))
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  removeSearchTerm(term: string) {
    const index = this.filterForm.controls['search'].value.indexOf(term)

    if (index >= 0) {
      (this.filterForm.controls['search'] as FormArray).removeAt(index)
    }
  }

  runFilters(filter: any) {
    var deepForm = this.formBuilder.array(this.formArray.controls)

    var deepFormControls = deepForm.controls

    //Search Filter
    deepFormControls = deepFormControls.filter(
      (group) => {
        var ret = false

        const terms = this.filterForm.controls['search'].value.map((term: string) => {
          return term.toLowerCase()
        })

        const textBlurb = `${(group.value.title as string)} ${(group.value.description as string)}`.toLowerCase()

        terms.forEach((term: string) => {
          if (textBlurb.includes(term)) {
            ret = true
          }
        })

        if (terms.length === 0) {
          ret = true
        }


        return ret
      }
    )

    //Status Filter
    deepFormControls = deepFormControls.filter(
      (group) => {
        const unprocessed = filter.unprocessed && group.value.playlistStatus === "unprocessed"
        const submitted = filter.submitted && group.value.playlistStatus === "submitted"
        const accepted = filter.accepted && group.value.playlistStatus === "accepted"
        const denied = filter.denied && group.value.playlistStatus === "denied"
        const ignore = filter.ignore && group.value.playlistStatus === "ignore"

        return unprocessed || submitted || accepted || denied || ignore
      }
    )

    deepForm = this.formBuilder.array(deepFormControls)

    this.dataSource = new MatTableDataSource(deepForm.controls)

  }

}
