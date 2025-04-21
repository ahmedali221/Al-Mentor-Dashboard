import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { program } from '../interfaces/program.interface';

@Injectable({
  providedIn: 'root'
})
export class ProgramsService {
  private apiUrl = `${environment.apiUrl}/programs`;

  constructor(private http: HttpClient) { }

  getPrograms(): Observable<program[]> {
    console.log("Fetching data from ", this.apiUrl);
    return this.http.get<program[]>(this.apiUrl);
  }
}
