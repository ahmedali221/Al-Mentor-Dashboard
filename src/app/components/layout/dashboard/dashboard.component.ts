import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule
  ]
})
export class DashboardComponent {
  menuItems = [
    { path: '/users', icon: 'people', label: 'Users' },
    { path: '/instructors', icon: 'school', label: 'Instructors' },
    { path: '/courses', icon: 'book', label: 'Courses' },
    { path: '/programs', icon: 'library_books', label: 'Programs' },
    { path: '/topics', icon: 'topic', label: 'Topics' }
  ];
}