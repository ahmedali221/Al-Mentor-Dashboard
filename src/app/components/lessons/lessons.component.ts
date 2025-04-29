

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { LessonsService } from '../../services/lessons.service'
// import { AddLessonDialogComponent } from '../add-lesson-dialog/add-lesson-dialog.component';
import { Lesson } from '../../interfaces/lesson';
import { Course } from '../../interfaces/course';
import { AddLessonDialogComponent } from './add-lesson-dialog/add-lesson-dialog.component';

@Component({
  selector: 'app-c-lessons',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    FormsModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './lessons.component.html',
  styleUrls: ['./lessons.component.scss']
})
export class CLessonsComponent implements OnInit {
  displayedColumns: string[] = ['id', 'title', 'courseName', 'duration', 'status', 'actions'];

  lessons: Lesson[] = [];
  courses: Course[] = [];
  filteredLessons: Lesson[] = [];
  selectedCourseId: string | null = null; // Changed to string
  isLoading = false;

  constructor(
    private lessonsService: LessonsService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.lessonsService.getLessons().subscribe({
      next: (data) => {
        this.lessons = data;
      }
    });
  }

  // loadData(): void {
  //   this.isLoading = true;
  //   this.lessonsService.getLessons().subscribe({
  //     next: (lessons: Lesson[]) => {
  //       this.lessons = lessons;
  //       this.filteredLessons = [...this.lessons];
  //       this.loadCourses();
  //     },
  //     error: (error: any) => {
  //       console.error('Error loading lessons:', error);
  //       this.snackBar.open('Error loading lessons', 'Close', { duration: 3000 });
  //       this.isLoading = false;
  //     }
  //   });
  // }

  // loadCourses(): void {
  //   this.lessonsService.getCourses().subscribe({
  //     next: (courses: Course[]) => {
  //       this.courses = courses;
  //       this.mapLessonsWithCourses();
  //       this.isLoading = false;
  //     },
  //     error: (error: any) => {
  //       console.error('Error loading courses:', error);
  //       this.snackBar.open('Error loading courses', 'Close', { duration: 3000 });
  //       this.isLoading = false;
  //     }
  //   });
  // }

  mapLessonsWithCourses(): void {
    this.filteredLessons = this.lessons.map(lesson => {
      const course = this.courses.find(c => c._id === lesson.courseId);
      return {
        ...lesson,
        courseName: course ? course.title.en : 'Unknown Course'
      };
    });
  }

  get totalLessons(): number {
    return this.lessons.length;
  }

  get activeLessons(): number {
    return this.lessons.filter(lesson => lesson.status === 'Active').length;
  }

  filterLessons(): void {
    if (!this.selectedCourseId) {
      this.mapLessonsWithCourses();
      return;
    }
    
    this.filteredLessons = this.lessons
      .filter(lesson => lesson.courseId === this.selectedCourseId)
      .map(lesson => {
        const course = this.courses.find(c => c._id === lesson.courseId);
        return {
          ...lesson,
          courseName: course ? course.title.en : 'Unknown Course'
        };
      });
  }


  addNewLesson(): void {
    const dialogRef = this.dialog.open(AddLessonDialogComponent, {
      width: '500px',
      data: { courses: this.courses }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.lessonsService.addLesson(result).subscribe({
          next: (newLesson: Lesson) => {
            this.lessons.push({ ...newLesson, courseName: '' });
            this.filterLessons();
            this.snackBar.open('Lesson added successfully', 'Close', { duration: 3000 });
          },
          error: (error: any) => {
            console.error('Error adding lesson:', error);
            this.snackBar.open('Error adding lesson', 'Close', { duration: 3000 });
          }
        });
      }
    });
  }

  editLesson(lesson: Lesson): void {
    console.log('Edit lesson:', lesson);
  }

  deleteLesson(lesson: Lesson): void {
    if (confirm('Are you sure you want to delete this lesson?')) {
      this.lessonsService.deleteLesson(lesson._id).subscribe({
        next: () => {
          this.lessons = this.lessons.filter(l => l._id !== lesson._id);
          this.filterLessons();
          this.snackBar.open('Lesson deleted successfully', 'Close', { duration: 3000 });
        },
        error: (error) => {
          console.error('Error deleting lesson:', error);
          this.snackBar.open('Error deleting lesson', 'Close', { duration: 3000 });
        }
      });
    }
  }
}
