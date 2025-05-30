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
  displayedColumns: string[] = ['title', 'module', 'course', 'duration', 'isPublished', 'isFree', 'actions'];

  searchControl = new FormControl('');
  selectedCourse = new FormControl('');
  addForm!: FormGroup;
  updateForm!: FormGroup;
  selectedLesson: Lesson | null = null;
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
        ar: ['', Validators.required]
      }),
      description: this.fb.group({
        en: ['', Validators.required],
        ar: ['', Validators.required]
      }),
      content: this.fb.group({
        articleText: this.fb.group({
          en: [''],
          ar: ['']
        }),
        videoUrl: [''],
        attachments: [[]]
      }),
      module: ['', Validators.required],
      order: [0, Validators.required],
      duration: [0, Validators.required],
      isFree: [false],
      isPublished: [false]
    };

    this.addForm = this.fb.group(commonFormStructure);
    this.updateForm = this.fb.group(commonFormStructure);
  }

  ngOnInit(): void {
    this.loadLessons();

    this.searchControl.valueChanges
      .pipe(debounceTime(300))
      .subscribe(() => this.filterLessons());

    this.selectedCourse.valueChanges
      .pipe(debounceTime(300))
      .subscribe(() => this.filterLessons());
  }

  loadLessons() {
    this.isLoading = true;
    this.lessonsService.getLessons().subscribe({
      next: (data: Lesson[]) => {
        this.lessons = data;
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

  get publishedLessons(): number {
    return this.lessons.filter(lesson => lesson.isPublished).length;
  }

  openAddForm() {
    this.addForm.reset({
      title: { en: '', ar: '' },
      description: { en: '', ar: '' },
      content: {
        articleText: { en: '', ar: '' },
        videoUrl: '',
        attachments: []
      },
      module: '',
      order: 0,
      duration: 0,
      isFree: false,
      isPublished: false
    });

    this.dialog.open(this.addDialog, { width: '800px' });
  }

  openUpdateForm(lesson: Lesson) {
    if (!lesson) return;

    this.selectedLesson = { ...lesson };
    this.updateForm.patchValue({
      title: lesson.title || { en: '', ar: '' },
      description: lesson.description || { en: '', ar: '' },
      content: lesson.content || {
        articleText: { en: '', ar: '' },
        videoUrl: '',
        attachments: []
      },
      module: lesson.module?._id || '',
      order: lesson.order || 0,
      duration: lesson.duration || 0,
      isFree: lesson.isFree || false,
      isPublished: lesson.isPublished || false
    });

    this.dialog.open(this.updateDialog, { width: '800px' });
  }

  addNewLesson() {
    if (this.addForm.valid) {
      const formValue = this.addForm.value;
      this.isLoading = true;

      // Ensure all required fields are present
      const newLesson = {
        ...formValue,
        title: {
          en: formValue.title?.en?.trim() || '',
          ar: formValue.title?.ar?.trim() || ''
        },
        description: {
          en: formValue.description?.en?.trim() || '',
          ar: formValue.description?.ar?.trim() || ''
        },
        content: {
          articleText: {
            en: formValue.content?.articleText?.en?.trim() || '',
            ar: formValue.content?.articleText?.ar?.trim() || ''
          },
          videoUrl: formValue.content?.videoUrl?.trim() || '',
          attachments: formValue.content?.attachments || []
        }
      };

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
      this.isLoading = true;

      // Ensure all required fields are present
      const updatedLesson = {
        ...formValue,
        title: {
          en: formValue.title?.en?.trim() || '',
          ar: formValue.title?.ar?.trim() || ''
        },
        description: {
          en: formValue.description?.en?.trim() || '',
          ar: formValue.description?.ar?.trim() || ''
        },
        content: {
          articleText: {
            en: formValue.content?.articleText?.en?.trim() || '',
            ar: formValue.content?.articleText?.ar?.trim() || ''
          },
          videoUrl: formValue.content?.videoUrl?.trim() || '',
          attachments: formValue.content?.attachments || []
        }
      };

      this.lessonsService.updateLesson(this.selectedLesson._id, updatedLesson).subscribe({
        next: (response) => {
          this.loadLessons();
          this.dialog.closeAll();
          this.isLoading = false;
          this.snackBar.open('Lesson updated successfully', 'Close', { duration: 3000 });
        },
        error: (error) => {
          console.error('Error updating lesson:', error);
          this.isLoading = false;
          this.snackBar.open(`Failed to update lesson: ${error.message}`, 'Close', { duration: 5000 });
        }
      });
    } else {
      this.updateForm.markAllAsTouched();
      const invalidControls = this.getFormValidationErrors(this.updateForm);
      this.snackBar.open('Please fill in all required fields: ' + invalidControls.join(', '), 'Close', { duration: 5000 });
    }
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
          this.snackBar.open(`Failed to delete lesson: ${error.message}`, 'Close', { duration: 5000 });
        }
      });
    }
  }

  filterLessons() {
    const search = this.searchControl.value?.toLowerCase() || '';
    const courseId = this.selectedCourse.value || '';

    this.filteredLessons = this.lessons.filter(lesson => {
      const matchesSearch = !search ||
        lesson.title?.en?.toLowerCase().includes(search) ||
        lesson.title?.ar?.toLowerCase().includes(search) ||
        lesson.description?.en?.toLowerCase().includes(search) ||
        lesson.description?.ar?.toLowerCase().includes(search);

      const matchesCourse = !courseId || lesson.course?._id === courseId;

      return matchesSearch && matchesCourse;
    });
  }

  clearFilters() {
    this.searchControl.setValue('');
    this.selectedCourse.setValue('');
    this.filteredLessons = [...this.lessons];
  }

  closeDialog() {
    this.dialog.closeAll();
  }

  getFormValidationErrors(form: FormGroup): string[] {
    const result: string[] = [];
    Object.keys(form.controls).forEach(key => {
      const control = form.get(key);
      if (control instanceof FormGroup) {
        result.push(...this.getFormValidationErrors(control));
      } else {
        const controlErrors = control?.errors;
        if (controlErrors) {
          Object.keys(controlErrors).forEach(keyError => {
            result.push(`${key}: ${keyError}`);
          });
        }
      }
    });
    return result;
  }

  updateLessonStatus(lesson: Lesson, isPublished: boolean) {
    if (!lesson?._id) return;

    this.isLoading = true;
    const updateData = {
      isPublished: isPublished
    };

    this.lessonsService.updateLesson(lesson._id, updateData).subscribe({
      next: (response) => {
        this.loadLessons();
        this.isLoading = false;
        this.snackBar.open(`Lesson ${isPublished ? 'published' : 'unpublished'} successfully`, 'Close', { duration: 3000 });
      },
      error: (error) => {
        console.error('Error updating lesson status:', error);
        this.isLoading = false;
        this.snackBar.open(`Failed to update lesson status: ${error.message}`, 'Close', { duration: 5000 });
      }
    });
  }

  updateLessonFreeStatus(lesson: Lesson, isFree: boolean) {
    if (!lesson?._id) return;

    this.isLoading = true;
    const updateData = {
      isFree: isFree
    };

    this.lessonsService.updateLesson(lesson._id, updateData).subscribe({
      next: (response) => {
        this.loadLessons();
        this.isLoading = false;
        this.snackBar.open(`Lesson ${isFree ? 'marked as free' : 'marked as paid'} successfully`, 'Close', { duration: 3000 });
      },
      error: (error) => {
        console.error('Error updating lesson free status:', error);
        this.isLoading = false;
        this.snackBar.open(`Failed to update lesson free status: ${error.message}`, 'Close', { duration: 5000 });
      }
    });
  }
}