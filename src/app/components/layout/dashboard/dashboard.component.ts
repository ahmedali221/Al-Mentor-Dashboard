import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';

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
    MatIconModule,
    MatSlideToggleModule,
    FormsModule,
  ],
})
export class DashboardComponent {
  menuItems = [
    // Users
    { path: '/users', icon: 'people', label: 'Users' },
    { path: '/instructors', icon: 'school', label: 'Instructors' },

    // Courses & Categories
    { path: '/categories', icon: 'category', label: 'Categories' },
    { path: '/topics', icon: 'topic', label: 'Topics' },
    { path: '/SubTopics', icon: 'layers', label: 'SubTopics' },
    { path: '/courses', icon: 'book', label: 'Courses' },
    { path: '/lessons', icon: 'check_circle', label: 'Lessons' },

    // Programs
    { path: '/programs', icon: 'library_books', label: 'Programs' },
    { path: '/topics', icon: 'topic', label: 'Topics' },
    { path: '/subscriptions', icon: 'subscriptions', label: 'subscriptions' },
    {
      path: '/userSubscriptions',
      icon: 'person_add',
      label: 'userSubscriptions',
    },

    // Payments
    { path: '/payments', icon: 'payment', label: 'Payment' },
  ];

  isDarkTheme = false;

  toggleTheme() {
    document.body.classList.toggle('dark-theme', this.isDarkTheme);
    localStorage.setItem('theme', this.isDarkTheme ? 'dark' : 'light');
  }
}
