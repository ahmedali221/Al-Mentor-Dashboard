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
import { Course } from '../../interfaces/course';
import { Lesson } from '../../interfaces/lesson';

// Define the validator function that was missing
function objectIdValidator(control: FormControl) {
  if (!control.value) {
    return null; // Optional, no error if empty
  }
  
  // Basic check for ObjectId format (24 characters, hex)
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
  displayedColumns: string[] = ['title', 'courseName', 'duration', 'status', 'actions'];

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
    // Initialize both forms with the same structure
    this.initForms();
  }

  initForms() {
    // Common form structure for both add and update
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

    // Create both forms with the same structure
    this.addForm = this.fb.group({
      ...commonFormStructure,
      instructor: [''],  // Only in addForm
      content: ['']      // Only in addForm
    });

    this.updateForm = this.fb.group(commonFormStructure);
  }

  ngOnInit(): void {
    this.loadCourses();
    this.loadLessons();
    this.searchControl.valueChanges.subscribe(() => {
      this.filterLesson();
    });
    this.selectedCourse.valueChanges.subscribe(() => this.filterLessonCourse());
  }
  
  loadLessons() {
    this.isLoading = true;
    this.lessonsService.getLessons().subscribe({
      next: (data: Lesson[]) => {
        this.lessons = data;
        this.filteredLessons = data;
        console.log('Loaded lessons:', data);
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
    return this.lessons.filter(lesson => lesson.status === 'Active').length;
  }
 
  loadCourses(): void {
    this.lessonsService.getCourses().subscribe({
      next: (courses) => {
        this.courses = courses;
        console.log('Loaded courses:', courses);
      },
      error: (error) => {
        console.error('Error loading courses:', error);
        this.snackBar.open(`Failed to load courses: ${error.message}`, 'Close', { duration: 5000 });
      }
    });
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
      this.dialog.open(this.addDialog, {
        width: '800px'
      });
    });
  }

  openUpdateForm(lesson: Lesson) {
    console.log('Opening update form for lesson:', lesson);
    this.selectedLesson = { ...lesson }; // Create a copy to avoid reference issues
    
    // Reset the form before patching values
    this.updateForm.reset();
    
    // Fill the form with all the necessary lesson data
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
    
    console.log('Update form patched with values:', this.updateForm.value);
    console.log('Update form valid after patch:', this.updateForm.valid);
    
    // Check if there are any validation errors after patching
    if (!this.updateForm.valid) {
      const invalidControls = this.getFormValidationErrors(this.updateForm);
      console.log('Invalid controls after patch:', invalidControls);
    }
    
    this.dialog.open(this.updateDialog, {
      width: '800px',
      data: { lesson: lesson }
    });
  }

  addNewLesson() {
    console.log('Form valid:', this.addForm.valid);
    console.log('Form values:', this.addForm.value);
    
    if (this.addForm.valid) {
      const formValue = this.addForm.value;

      // Create the lesson object with the exact structure expected by the backend
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
        // Only include module if it has a non-empty value
        ...(formValue.module && formValue.module.trim() !== '' ? { module: formValue.module } : {}),
        order: Number(formValue.order) || 0,
        duration: Number(formValue.duration) || 0,
        availableLanguages: formValue.availableLanguages || ['en'],
        status: 'Active'
      };
      
      console.log('Submitting new lesson:', newLesson);
      
      this.isLoading = true;
      this.lessonsService.addLesson(newLesson).subscribe({
        next: (response) => {
          console.log('Lesson added successfully:', response);
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
      console.log('Invalid controls:', invalidControls);
      this.snackBar.open('Please fill in all required fields: ' + invalidControls.join(', '), 'Close', { duration: 5000 });
    }
  }

  updateLesson() {
    console.log('Update button clicked');
    console.log('Form valid:', this.updateForm.valid);
    console.log('Update form values:', this.updateForm.value);
    console.log('Selected lesson before update:', this.selectedLesson);
    
    // Check if form is valid and selectedLesson exists
    if (this.updateForm.valid && this.selectedLesson?._id) {
      const formValue = this.updateForm.value;
      
      // Create update object with proper structure
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
      
      console.log('Submitting update with data:', updateData);
      
      // Set loading state
      this.isLoading = true;
      
      this.lessonsService.updateLesson(this.selectedLesson._id, updateData)
        .subscribe({
          next: (response) => {
            console.log('Update successful:', response);
            this.loadLessons(); // Refresh the lessons list
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
      // Detailed validation error reporting
      this.updateForm.markAllAsTouched();
      const invalidControls = this.getFormValidationErrors(this.updateForm);
      console.log('Invalid controls in update form:', invalidControls);
      
      if (!this.selectedLesson?._id) {
        console.error('Missing lesson ID for update operation');
        this.snackBar.open('Cannot update: Missing lesson ID', 'Close', { duration: 5000 });
      } else {
        this.snackBar.open('Please fill in all required fields: ' + invalidControls.join(', '), 'Close', { duration: 5000 });
      }
    }
  }

  filterLesson() {
    const search = this.searchControl.value?.toLowerCase() || '';
    this.filteredLessons = this.lessons.filter(lesson => {
      return (
        (lesson.title?.en?.toLowerCase().includes(search)) || 
        (lesson.description?.en?.toLowerCase().includes(search))
      );
    });
  }

  filterLessonCourse() {
    const courseId = this.selectedCourse.value;
    this.filteredLessons = this.lessons.filter(lesson => {
      return courseId === '' || lesson.courseName === courseId;
    });
  }

  clearFilters() {
    this.searchControl.setValue('');
    this.selectedCourse.setValue('');
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

  // Helper method to find which form controls are invalid
  getFormValidationErrors(form: FormGroup): string[] {
    const result: string[] = [];
    Object.keys(form.controls).forEach(key => {
      const controlErrors = form.get(key)?.errors;
      if (controlErrors) {
        Object.keys(controlErrors).forEach(keyError => {
          result.push(`${key}: ${keyError}`);
        });
      }
      
      // Check nested form groups
      const control = form.get(key);
      if (control instanceof FormGroup) {
        result.push(...this.getFormValidationErrors(control));
      }
    });
    return result;
  }
}



















//   openUpdateForm(lesson: Lesson): void {
//     this.selectedLesson = lesson;
//     this.updateForm.patchValue({
//       _id: lesson._id,
//       title: lesson.title || { en: '', ar: '' },
//       description: lesson.description || { en: '', ar: '' },
//       module: lesson.module || '',
//       order: lesson.order || 0,
//       duration: lesson.duration || 0,
//       content: {
//         videoUrl: lesson.content?.videoUrl || '',
//         articleText: lesson.content?.articleText || { en: '', ar: '' }
//       },
//       isFree: lesson.isFree || false,
//       isPublished: lesson.isPublished || false,
//       courseId: lesson.courseId || '',
//       status: lesson.status || 'Active',
//       availableLanguages: ['en']
//     });

//     setTimeout(() => {
//       const dialogRef = this.dialog.open(this.updateDialog, {
//         width: '800px',
//         autoFocus: true // Ensure focus is moved to the dialog
//       });

//       dialogRef.afterOpened().subscribe(() => {
//         const firstInput = document.querySelector('input[formControlName="en"]');
//         if (firstInput) {
//           (firstInput as HTMLElement).focus();
//         }
//       });
//     });
//   }

//   addNewLesson(): void {
//     if (this.addForm.valid) {
//       this.lessonsService.addLesson(this.addForm.value).subscribe({
//         next: () => {
//           this.loadLessons();
//           this.dialog.closeAll();
//           this.snackBar.open('Lesson added successfully', 'Close', { duration: 3000 });
//         },
//         error: (err) => {
//           console.error('Error adding lesson:', err);
//           alert('Failed to add lesson. Please check required fields.');
//         }
//       });
//     } else {
//       this.addForm.markAllAsTouched();
//       alert('Please complete all required fields before submitting.');
//     }
//   }

//   updateLesson(): void {
//     if (this.updateForm.valid && this.selectedLesson?._id) {
//       const id = this.selectedLesson._id;
//       this.lessonsService.updateLesson(id, this.updateForm.value).subscribe({
//         next: () => {
//           this.loadLessons();
//           this.dialog.closeAll();
//           this.snackBar.open('Lesson updated successfully', 'Close', { duration: 3000 });
//         },
//         error: (err) => {
//           console.error('Error updating lesson:', err);
//           alert('Failed to update lesson.');
//         }
//       });
//     }
//   }
  

//   deleteLesson(id: string): void {
//     if (confirm('Are you sure you want to delete this lesson?')) {
//       this.lessonsService.deleteLesson(id).subscribe({
//         next: () => {
//           this.loadLessons();
//           this.snackBar.open('Lesson deleted successfully', 'Close', { duration: 3000 });
//         },
//         error: (err) => {
//           console.error('Error deleting lesson:', err);
//         }
//       });
//     }
//   }

//   closeDialog(): void {
//     this.dialog.closeAll();
//   }

//   // filterLessons(): void {
//   //   const search = this.searchControl.value?.toLowerCase() || '';
//   //   const courseId = this.selectedCourse.value || '';

//   //   this.filteredLessons = this.lessons.filter(lesson => {
//   //     const matchesSearch = lesson.title?.en?.toLowerCase().includes(search);
//   //     const matchesCourse = !courseId || lesson.courseId === courseId;
//   //     return matchesSearch && matchesCourse;
//   //   });
//   // }

//   filterLesson() {
//     const search = this.searchControl.value?.toLowerCase() || '';
//     const courseId = this.selectedCourse.value || '';
//     this.filteredLessons = this.lessons.filter(lesson => {
//       const matchesSearch =
//         lesson.title?.en?.toLowerCase().includes(search) ||'';
//       return matchesSearch;
//     });
    
//   }

//   clearFilters(): void {
//     this.searchControl.setValue('');
//     this.selectedCourse.setValue('');
//   }
// }


