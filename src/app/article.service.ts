import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Article } from './article';
import { map, publishReplay, refCount } from 'rxjs/operators';
import { forkJoin, Observable, Subject, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  private url = 'https://hacker-news.firebaseio.com/v0/';
  public myText = new Subject<string>();
  public myTextObs = this.myText.asObservable();

  constructor(private http: HttpClient) { }

  // Get article information from ids
  idsToArticles(ids: number[]){
    const obsArray = new Array<Observable<Article>>();

    // caching: If local storage gets too big, make space
    if (localStorage.length > 10000) { localStorage.clear(); }

    for (const id of ids) {
      const idItem = JSON.parse(localStorage.getItem(id.toString()));

      // caching: if in cache, used cache value
      if (idItem) {
        obsArray.push(of(idItem));
      }
      // caching: else, request value from server
      else {
        obsArray.push(this.http.get<Article>(this.url + 'item/' + id + '.json').pipe(map(x => {
          localStorage.setItem(id.toString(), JSON.stringify(x));
          return x;
        })));
      }
    }

    return forkJoin(obsArray);
  }

  // Return information for best articles
  getBestArticles() {

    const obs = this.http.get<number[]>(this.url + 'topstories.json')
    .pipe(
      map(response => {
        return this.idsToArticles(response.splice(0, 100));
      }),
    );
    return obs;
  }

  // Shares search bar text from toolbar to news-table
  updateMyText(newText: string) {
    this.myText.next(newText);
  }
}
