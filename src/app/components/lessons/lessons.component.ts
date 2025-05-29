import { Course } from './../../interfaces/course';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { LessonsService } from '../../services/lessons.service';
import { Lesson } from '../../interfaces/lesson';
import { debounceTime } from 'rxjs/operators';

function objectIdValidator(control: FormControl) {
  if (!control.value) {
    return null;
  }
  const valid = /^[0-9a-fA-F]{24}$/.test(control.value);
  return valid ? null : { invalidObjectId: { value: control.value } };
}

@Component({
  selector: 'app-lessons',
  standalone: true,
  templateUrl: './lessons.component.html',
  styleUrls: ['./lessons.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatDialogModule
  ]
})
export class CLessonsComponent implements OnInit {
  @ViewChild('addDialog') addDialog!: TemplateRef<any>;
  @ViewChild('updateDialog') updateDialog!: TemplateRef<any>;

  lessons: Lesson[] = [];
  filteredLessons: Lesson[] = [];
  courses: Course[] = [];
  displayedColumns: string[] = ['title', 'courseName', 'duration', 'availableLanguages', 'status', 'actions'];

  searchControl = new FormControl('');
  selectedCourse = new FormControl('');
  selectedCourseId: string = '';
  addForm!: FormGroup;
  updateForm!: FormGroup;
  selectedLesson: Lesson | null = null;
  lesson: any;
  isLoading: boolean = false;

  constructor(
    private lessonsService: LessonsService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.initForms();
  }

  initForms() {
    const commonFormStructure = {
      title: this.fb.group({
        en: ['', Validators.required],
        ar: ['']
      }),
      description: this.fb.group({
        en: ['', Validators.required],
        ar: ['']
      }),
      courseId: ['', Validators.required],
      module: ['', objectIdValidator],
      order: [0, Validators.required],
      duration: [0, Validators.required],
      availableLanguages: [['en'], Validators.required],
      status: ['Active']
    };

    this.addForm = this.fb.group({
      ...commonFormStructure,
      instructor: [''],
      content: ['']
    });

    this.updateForm = this.fb.group(commonFormStructure);
  }

  ngOnInit(): void {
    this.lessonsService.getCourses().subscribe({
      next: (courses) => {
        this.courses = courses;
        this.loadLessons();
      },
      error: (error) => {
        console.error('Error loading courses:', error);
        this.snackBar.open(`Failed to load courses: ${error.message}`, 'Close', { duration: 5000 });
      }
    });

    this.searchControl.valueChanges
      .pipe(debounceTime(300))
      .subscribe(() => this.filterLessons());

    this.selectedCourse.valueChanges
      .pipe(debounceTime(300))
      .subscribe(() => this.filterLessons());
  }

  loadCourses(): void {
    this.isLoading = true;
    this.lessonsService.getCourses().subscribe({
      next: (courses) => {
        this.courses = courses;
        this.loadLessons();
      },
      error: (error) => {
        console.error('Error loading courses:', error);
        this.isLoading = false;
        this.snackBar.open(`Failed to load courses: ${error.message}`, 'Close', { duration: 5000 });
      }
    });
  }

  loadLessons() {
    this.isLoading = true;
    this.lessonsService.getLessons().subscribe({
      next: (data: Lesson[]) => {
        console.log('Raw lessons data from API:', data);
        this.lessons = data.map(lesson => {
          console.log('Processing lesson:', lesson.title?.en, {
            availableLanguages: lesson.availableLanguages,
            status: lesson.status
          });
          const course = this.courses.find(c => c._id === lesson.course?._id);
          return {
            ...lesson,
            courseName: course?.title?.en || 'Unknown Course',
            availableLanguages: lesson.availableLanguages || ['en'],
            status: lesson.status || 'Inactive'
          };
        });
        console.log('Processed lessons:', this.lessons);
        this.filteredLessons = [...this.lessons];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading lessons:', error);
        this.isLoading = false;
        this.snackBar.open(`Failed to load lessons: ${error.message}`, 'Close', { duration: 5000 });
      }
    });
  }

  get totalLessons(): number {
    return this.lessons.length;
  }

  get activeLessons(): number {
    return this.lessons.filter(lesson => lesson.status === 'active').length;
  }


  openAddForm() {
    this.addForm.reset({
      title: { en: '', ar: '' },
      description: { en: '', ar: '' },
      availableLanguages: ['en'],
      courseId: '',
      content: '',
      module: '',
      order: 0,
      duration: 0,
      status: 'Active'
    });

    setTimeout(() => {
      this.dialog.open(this.addDialog, { width: '800px' });
    });
  }

  openUpdateForm(lesson: Lesson) {
    this.selectedLesson = { ...lesson };
    this.updateForm.reset();

    this.updateForm.patchValue({
      title: {
        en: lesson.title?.en || '',
        ar: lesson.title?.ar || ''
      },
      description: {
        en: lesson.description?.en || '',
        ar: lesson.description?.ar || ''
      },
      courseId: lesson.courseId || '',
      order: lesson.order || 0,
      duration: lesson.duration || 0,
      module: lesson.module || '',
      availableLanguages: lesson.availableLanguages || ['en'],
      status: lesson.status || 'Active'
    });

    this.dialog.open(this.updateDialog, { width: '800px', data: { lesson: lesson } });
  }

  addNewLesson() {
    if (this.addForm.valid) {
      const formValue = this.addForm.value;
      const newLesson = {
        title: {
          en: formValue.title?.en?.trim() || '',
          ar: formValue.title?.ar?.trim() || ''
        },
        description: {
          en: formValue.description?.en?.trim() || '',
          ar: formValue.description?.ar?.trim() || ''
        },
        courseId: formValue.courseId || '',
        ...(formValue.module && formValue.module.trim() !== '' ? { module: formValue.module } : {}),
        order: Number(formValue.order) || 0,
        duration: Number(formValue.duration) || 0,
        availableLanguages: formValue.availableLanguages || ['en'],
        status: 'Active'
      };

      this.isLoading = true;
      this.lessonsService.addLesson(newLesson).subscribe({
        next: (response) => {
          this.loadLessons();
          this.dialog.closeAll();
          this.isLoading = false;
          this.snackBar.open('Lesson added successfully', 'Close', { duration: 3000 });
        },
        error: (error) => {
          console.error('Error adding lesson:', error);
          this.isLoading = false;
          this.snackBar.open(`Failed to add lesson: ${error.message}`, 'Close', { duration: 5000 });
        }
      });
    } else {
      this.addForm.markAllAsTouched();
      const invalidControls = this.getFormValidationErrors(this.addForm);
      this.snackBar.open('Please fill in all required fields: ' + invalidControls.join(', '), 'Close', { duration: 5000 });
    }
  }

  updateLesson() {
    if (this.updateForm.valid && this.selectedLesson?._id) {
      const formValue = this.updateForm.value;
      const updateData = {
        title: {
          en: formValue.title?.en?.trim() || '',
          ar: formValue.title?.ar?.trim() || ''
        },
        description: {
          en: formValue.description?.en?.trim() || '',
          ar: formValue.description?.ar?.trim() || ''
        },
        courseId: formValue.courseId || '',
        order: Number(formValue.order) || 0,
        duration: Number(formValue.duration) || 0,
        module: formValue.module || '',
        availableLanguages: formValue.availableLanguages || ['en'],
        status: formValue.status || 'Active'
      };

      this.isLoading = true;
      this.lessonsService.updateLesson(this.selectedLesson._id, updateData)
        .subscribe({
          next: (response) => {
            this.loadLessons();
            this.dialog.closeAll();
            this.isLoading = false;
            this.snackBar.open('Lesson updated successfully', 'Close', { duration: 3000 });
          },
          error: (error) => {
            console.error('Error updating lesson:', error);
            this.isLoading = false;
            this.snackBar.open(`Failed to update lesson: ${error.message || 'Unknown error'}`, 'Close', { duration: 5000 });
          }
        });
    } else {
      this.updateForm.markAllAsTouched();
      const invalidControls = this.getFormValidationErrors(this.updateForm);
      
      if (!this.selectedLesson?._id) {
        this.snackBar.open('Cannot update: Missing lesson ID', 'Close', { duration: 5000 });
      } else {
        this.snackBar.open('Please fill in all required fields: ' + invalidControls.join(', '), 'Close', { duration: 5000 });
      }
    }
  }

  filterLessons() {
    const search = this.searchControl.value?.toLowerCase() || '';
    const courseId = this.selectedCourse.value || '';

    this.filteredLessons = this.lessons
      .filter(lesson => this.matchesSearch(lesson, search))
      .filter(lesson => this.matchesCourse(lesson, courseId));
  }

  private matchesCourse(lesson: Lesson, courseId: string): boolean {
    if (!courseId) return true;
    return lesson.courseId === courseId || lesson.course?._id === courseId;
  }
  
  private matchesSearch(lesson: Lesson, search: string): boolean {
    if (!search) return true;
    return (
      lesson.title?.en?.toLowerCase().includes(search) ||
      lesson.title?.ar?.toLowerCase()?.includes(search) ||
      lesson.description?.en?.toLowerCase()?.includes(search) ||
      lesson.description?.ar?.toLowerCase()?.includes(search) ||
      lesson._id?.toLowerCase()?.includes(search)
    );
  }

  clearFilters() {
    this.searchControl.setValue('');
    this.selectedCourse.setValue('');
    this.filteredLessons = [...this.lessons];
  }
  
  deleteLesson(id: string) {
    if (confirm('Are you sure you want to delete this lesson?')) {
      this.isLoading = true;
      this.lessonsService.deleteLesson(id).subscribe({
        next: () => {
          this.loadLessons();
          this.isLoading = false;
          this.snackBar.open('Lesson deleted successfully', 'Close', { duration: 3000 });
        },
        error: (error) => {
          console.error('Error deleting lesson:', error);
          this.isLoading = false;
          this.snackBar.open(`Failed to delete lesson: ${error.message || 'Unknown error'}`, 'Close', { duration: 5000 });
        }
      });
    }
  }

  closeDialog() {
    this.dialog.closeAll();
  }

  getFormValidationErrors(form: FormGroup): string[] {
    const result: string[] = [];
    Object.keys(form.controls).forEach(key => {
      const controlErrors = form.get(key)?.errors;
      if (controlErrors) {
        Object.keys(controlErrors).forEach(keyError => {
          result.push(`${key}: ${keyError}`);
        });
      }
      const control = form.get(key);
      if (control instanceof FormGroup) {
        result.push(...this.getFormValidationErrors(control));
      }
    });
    return result;
  }

  getCourseName(courseId: string): string {
    const course = this.courses.find(c => c._id === courseId);
    return course?.title?.en || 'Unknown Course';
  }
}