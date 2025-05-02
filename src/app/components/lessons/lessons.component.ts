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
  // isLoading: boolean = true;
  selectedLesson: any;
lesson: any;
isLoading: boolean = false;
ngOnInit(): void {
  this.loadCourses();
  this.loadLessons();

  this.searchControl.valueChanges.subscribe(() => {
    this.filterLesson();
  });
  this.selectedCourse.valueChanges.subscribe(() => this.filterLesson());
}
  constructor(
    private lessonsService: LessonsService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.addForm = this.fb.group({
      title: this.fb.group({
        en: ['', Validators.required],
        ar: ['']
      }),
      description: this.fb.group({
        en: ['', Validators.required],
        ar: ['']
      }),
      courseId: ['', Validators.required], // Must be set when submitting
      instructor: ['', Validators.required], // Also required
      content: [''],
      module: [''],
      order: [0, Validators.required],
      duration: [0, Validators.required],
      availableLanguages: this.fb.control(['en'])
    });

    this.updateForm = this.fb.group({
      title: this.fb.group({
        en: ['', Validators.required],
        ar: ['']
      }),
      description: this.fb.group({
        en: ['', Validators.required],
        ar: ['']
      }),
      courseId: ['', Validators.required], // Must be set when submitting
      content: [''],
      module: [''],
      order: [0, Validators.required],
      duration: [0, Validators.required],
      availableLanguages: this.fb.control(['en']) 
    });
  }
  
 
  loadLessons(): void {
    this.lessonsService.getLessons().subscribe({
      next: (lessons) => {
        this.lessons = lessons;
        this.filteredLessons = lessons;
      },
      error: (error) => {
        console.error('Error loading lessons:', error);
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
      },
      error: (error) => {
        console.error('Error loading courses:', error);
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
      duration: 0
    });

    setTimeout(() => {
     this.dialog.open(this.addDialog, {
        width: '800px'
     })
    });
  }

  openUpdateForm(lesson: Lesson): void {
    this.selectedLesson = lesson;
    this.updateForm.reset({
      title: { en: lesson.title?.en || '', ar: lesson.title?.ar || '' },
      description: { en: lesson.description?.en || '', ar: lesson.description?.ar || '' },
      courseId: lesson.courseName || '',
      content: lesson.content || '',
      module: lesson.module || '',
      order: lesson.order || 0,
      duration: lesson.duration || 0
    });

    setTimeout(() => {
      this.dialog.open(this.updateDialog, {
        width: '800px'
      });
    });
  }

  addNewLesson() {
    if (this.addForm.invalid) {
      const formValue = this.addForm.value;

      const newLesson = {
        en: formValue.title?.en?.trim() || '',
        ar: formValue.title?.ar?.trim() || '',
        description: {
          en: formValue.description?.en?.trim() || '',
          ar: formValue.description?.ar?.trim() || ''
        },
        module: formValue.module?.trim() || null, 
        order: formValue.order?.trim() || null, 
        duration: formValue.duration?.trim() || null, 
        courseId: formValue.courseId?.trim() || null, 
        }
        this.lessonsService.addLesson(newLesson).subscribe({
          next: () => {
             this.loadLessons();
             this.dialog.closeAll();
          },
          error: (error) => {
            console.error('Error adding lesson:', error);
          }
        });
      }else {
       this.addForm.markAllAsTouched();
       alert('Please fill in all required fields.');   
      }
    }

  updateLesson() {
      if (this.updateForm.invalid && this.selectedLesson?._id) {

this.lessonsService.updateLesson(this.selectedLesson._id, this.updateForm.value).subscribe({
          next: () => {
            this.loadLessons();
            this.dialog.closeAll();
          },
          error: (error) => {
            console.error('Error updating lesson:', error);
          }
        });
      } else {
        this.updateForm.markAllAsTouched();
        alert('Please fill in all required fields.');
      }
      }
  filterLesson() {
    const search = this.searchControl.value?.toLowerCase() || '';
    const topic = this.selectedCourse.value || '';
    this.filteredLessons = this.lessons.filter(lesson => {
      const matchesSearch =
        lesson.title?.en?.toLowerCase().includes(search) || '' ;
      return matchesSearch ;
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
  
  
deleteLesson(id: string){
  if(confirm('Are you sure you want to delete this lesson?')){
  this.lessonsService.deleteLesson(id).subscribe({
    next: () => {
      this.loadLessons();
    },
    error: (error) => {
      console.error('Error deleting lesson:', error);
    }
  });
}
}
closeDialog() {
  this.dialog.closeAll();
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
