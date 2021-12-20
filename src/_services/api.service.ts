import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators'
import { ToastrService } from 'ngx-toastr';
import { environment } from './../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public actionSubject = new Subject<any>();
  actions = this.actionSubject.asObservable();
  baseUrl = environment.apiUrl;
  console1 = console;
  constructor(
    private http: HttpClient,
    private toastr: ToastrService
  ) {
  }

  public post(endpoint: string, params: any, handleErrors?: boolean): Observable<any> {
    const t0 = performance.now();
    const body = JSON.stringify(params);
    console.info(`⬆ POST: ${this.baseUrl}/${endpoint}`);
    return this.http.post(`${this.baseUrl}/${endpoint}`, body, this.post_headers());
  }

  public get(endpoint: string, params: any, handleErrors?: boolean): Observable<any> {
    console.info(`⬆ POST: ${this.baseUrl}/${endpoint}`);
    return this.http.get(`${this.baseUrl}/${endpoint}`, { headers: this.get_headers(), params })
    .pipe(
      catchError((error, caught) => {
        this.toastr.error(error?.message)
        return of(error);
      }) as any);
  }


  private get_headers() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return headers;
  }
  private post_headers() {
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    };
    return httpOptions;
  }
}