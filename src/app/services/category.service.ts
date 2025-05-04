import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Category } from '../interfaces/category.interface';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = `${environment.apiUrl}/category`;

  constructor(private http: HttpClient) { }

  // Get all categories
  getCategories(): Observable<Category[]> {
    return this.http.get<{success: boolean, message: string, data: Category[]}>(`${this.apiUrl}`).pipe(
      map(response => response.data)
    );
  }

  // Get a single category by ID
  getCategoryById(id: string): Observable<Category> {
    return this.http.get<{success: boolean, message: string, data: Category}>(`${this.apiUrl}/${id}`).pipe(
      map(response => response.data)
    );
  }

  // Create a new category
  createCategory(data: any): Observable<Category> {
    return this.http.post<{success: boolean, message: string, data: Category}>(`${this.apiUrl}`, data).pipe(
      map(response => response.data)
    );
  }

  // Update an existing category
  updateCategory(id: string, data: any): Observable<Category> {
    return this.http.put<{success: boolean, message: string, data: Category}>(`${this.apiUrl}/${id}`, data).pipe(
      map(response => response.data)
    );
  }

  // Delete a category
  deleteCategory(id: string): Observable<{success: boolean, message: string}> {
    return this.http.delete<{success: boolean, message: string}>(`${this.apiUrl}/${id}`);
  }
}