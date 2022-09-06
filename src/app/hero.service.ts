import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, Observable, of, tap} from "rxjs";
import {HeroInterface} from "./shared/types/hero.interface";
import {MessageService} from "./message.service";

@Injectable({providedIn: 'root'})
export class HeroService {

  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };
  private heroesUrl = 'api/heroes';

  constructor(private messageService: MessageService, private http: HttpClient) {
  }

  getHeroes(): Observable<HeroInterface[]> {
    return this.http.get<HeroInterface[]>(this.heroesUrl)
      .pipe(
        tap({
          next: () => this.log('fetched heroes')
        }),
        catchError(this.handleError<HeroInterface[]>('getHeroes', []))
      );
  }

  // getHeroNo404<Data>(id: number): Observable<HeroInterface> {
  //   const url = `${this.heroesUrl}/?id=${id}`;
  //   return this.http.get<HeroInterface[]>(url)
  //     .pipe(
  //       map(heroes => heroes[0]),
  //       tap({
  //         next: (res) => {
  //           const outcome = res ? 'fetched' : 'did not find';
  //           this.log(`${outcome} hero id=${id}`);
  //         }
  //       }),
  //       catchError(this.handleError<HeroInterface>(`getHero id=${id}`))
  //     );
  // }

  getHero(id: number): Observable<HeroInterface> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<HeroInterface>(url).pipe(
      tap({
        next: () => this.log(`fetched hero id=${id}`)
      }),
      catchError(this.handleError<HeroInterface>(`getHero id=${id}`))
    );
  }

  searchHeroes(term: string): Observable<HeroInterface[]> {
    if (!term.trim()) {
      return of([]);
    }
    return this.http.get<HeroInterface[]>(`${this.heroesUrl}/?name=${term}`).pipe(
      tap({
        next: (res: HeroInterface[]) => res.length ?
          this.log(`found heroes matching "${term}"`) :
          this.log(`no heroes matching "${term}"`)
      }),
      catchError(this.handleError<HeroInterface[]>('searchHeroes', []))
    );
  }

  addHero(hero: HeroInterface): Observable<HeroInterface> {
    return this.http.post<HeroInterface>(this.heroesUrl, hero, this.httpOptions).pipe(
      tap({
        next: (newHero: HeroInterface) => this.log(`added hero w/ id=${newHero.id}`)
      }),
      catchError(this.handleError<HeroInterface>('addHero'))
    );
  }

  deleteHero(id: number): Observable<HeroInterface> {
    const url = `${this.heroesUrl}/${id}`;

    return this.http.delete<HeroInterface>(url, this.httpOptions).pipe(
      tap({
        next: () => this.log(`deleted hero id=${id}`)
      }),
      catchError(this.handleError<HeroInterface>('deleteHero'))
    );
  }

  updateHero(hero: HeroInterface): Observable<any> {
    return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(
      tap({
        next: () => this.log(`updated hero id=${hero.id}`)
      }),
      catchError(this.handleError<any>('updateHero'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }
}
