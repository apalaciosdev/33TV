import { Injectable } from '@angular/core';
import axios from 'axios';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GiphyService {
  private apiKey = 'hDm0YS8mDCW5xwwsI56jVlhI2UF2rtji'; // Reemplaza con tu propia clave de API de Giphy

  getRandomGif(): Observable<string> {
    const url = `https://api.giphy.com/v1/gifs/random?api_key=${this.apiKey}&tag=funny&rating=g`;

    return new Observable<string>((observer) => {
      axios.get(url)
        .then(response => {
          const gifUrl = response.data.data.image_url;
          observer.next(gifUrl);
          observer.complete();
        })
        .catch(error => {
          observer.error(error);
        });
    });
  }
}
