import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Course } from '../../../interfaces/course';

@Component({
  selector: 'app-add-lesson-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data.lesson ? 'Edit' : 'Add New' }} Lesson</h2>
    <mat-dialog-content>
      <form #lessonForm="ngForm">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Title (English)</mat-label>
          <input matInput [(ngModel)]="lesson.title.en" name="title_en" required>
          <mat-error *ngIf="lessonForm.controls['title_en']?.errors?.['required']">
            English title is required
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Title (Arabic)</mat-label>
          <input matInput [(ngModel)]="lesson.title.ar" name="title_ar" required>
          <mat-error *ngIf="lessonForm.controls['title_ar']?.errors?.['required']">
            Arabic title is required
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Course</mat-label>
          <mat-select [(ngModel)]="lesson.course" name="course" required>
            <mat-option *ngFor="let course of data.courses" [value]="course._id">
              {{ course.title.en }}
            </mat-option>
          </mat-select>
          <mat-error *ngIf="lessonForm.controls['course']?.errors?.['required']">
            Course is required
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Duration (minutes)</mat-label>
          <input matInput type="number" [(ngModel)]="lesson.duration" name="duration" required min="1">
          <mat-error *ngIf="lessonForm.controls['duration']?.errors?.['required']">
            Duration is required
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Description (English)</mat-label>
          <textarea matInput [(ngModel)]="lesson.description.en" name="description_en" rows="3"></textarea>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Description (Arabic)</mat-label>
          <textarea matInput [(ngModel)]="lesson.description.ar" name="description_ar" rows="3"></textarea>
        </mat-form-field>

        <mat-checkbox [(ngModel)]="lesson.isFree" name="isFree">Free Lesson</mat-checkbox>
        <mat-checkbox [(ngModel)]="lesson.isPublished" name="isPublished">Published</mat-checkbox>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-flat-button color="primary" 
              [disabled]="!lessonForm.valid" 
              (click)="onSave()">
        <mat-icon>save</mat-icon> Save
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }
    mat-checkbox {
      display: block;
      margin: 16px 0;
    }
  `]
})
export class AddLessonDialogComponent {
  lesson = {
    title: {
      en: '',
      ar: ''
    },
    course: null,
    description: {
      en: '',
      ar: ''
    },
    duration: 0,
    isFree: false,
    isPublished: true,
    order: 0,
    courseInfo: {
      title: { en: '', ar: '' },
      _id: ''
    }
  };

  constructor(
    public dialogRef: MatDialogRef<AddLessonDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { 
      courses: Course[]; 
      lesson?: any 
    }
  ) {
    if (data.lesson) {
      this.lesson = {...data.lesson};
    }
  }

  onSave(): void {
    // Find the selected course to include its information if needed
    const selectedCourse = this.data.courses.find(c => c._id === this.lesson.course);
    if (selectedCourse) {
      // You can add course info to the lesson if needed
      this.lesson['courseInfo'] = {
        title: { en: selectedCourse.title.en, ar: selectedCourse.title.ar || '' },
        _id: selectedCourse._id
      };
    }
    this.dialogRef.close(this.lesson);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}