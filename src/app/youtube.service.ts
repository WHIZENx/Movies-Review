import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

const YOUTUBE_API_KEY = 'AIzaSyCeGrfYUksr6CXO9TMN3Odkq2UiBC1L2Mk';
const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3/search';

@Injectable({
  providedIn: 'root'
})
export class YoutubeService {

  constructor(private http: HttpClient) { }

  search(query: string) {
    const params: string = [
      `q=${query}`,
      `key=${YOUTUBE_API_KEY}`,
      `part=snippet`,
      `type=video`,
      `maxResults=1`
    ].join('&');
    const queryUrl = `${YOUTUBE_API_URL}?${params}`;
    return this.http.get(queryUrl).pipe(map(response => {
      return response['items'].map(item => {
        return item.id.videoId;
      });
    }));
  }
}