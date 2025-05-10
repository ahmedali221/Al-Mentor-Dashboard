import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CoursesService } from '../../services/course.service';
import { TopicsService } from '../../services/topics.service';
import { Course } from '../../interfaces/course';
import { Topic } from '../../interfaces/topic.interface';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatDialogModule,
  ]
})
export class CoursesComponent implements OnInit {
  @ViewChild('addDialog') addDialog!: TemplateRef<any>;
  @ViewChild('updateDialog') updateDialog!: TemplateRef<any>;

  courses: Course[] = [];
  filteredCourses: Course[] = [];
  topics: Topic[] = [];
  displayedColumns: string[] = ['title', 'instructorName', 'slug', 'availableLanguages', 'lessonsCount', 'actions'];
  searchControl = new FormControl('');
  selectedTopic = new FormControl('');
  course: any;
  selectedCourse: any;
  selectedTopicId: string = '';
  // Form groups for add and update
  addForm!: FormGroup;
  updateForm!: FormGroup;



  ngOnInit() {

    this.loadCourses();
    this.loadTopics();
    this.searchControl.valueChanges.subscribe(() => {
      this.filterCourses();
    });
    this.selectedTopic.valueChanges.subscribe(() => {
      this.filterCoursesTopic();
    });
  }

  constructor(
    private coursesService: CoursesService,
    private topicsService: TopicsService,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    // Initialize form groups

    this.addForm = this.fb.group({
      title: this.fb.group({
        en: ['', Validators.required],
        ar: ['']
      }),
      slug: ['', Validators.required],
      description: this.fb.group({
        en: ['', Validators.required],
        ar: ['']
      }),
      topicId: ['', Validators.required], // Must be set when submitting
      instructor: ['', Validators.required], // Also required
      thumbnailImgUrl: [''],
      availableLanguages: this.fb.control(['en'])
    });




    this.updateForm = this.fb.group({
      _id: [''],
      title: this.fb.group({
        en: ['', Validators.required],
        ar: ['']
      }),
      slug: ['', Validators.required],
      description: this.fb.group({
        en: ['', Validators.required],
        ar: ['']
      }),
      topicId: ['', Validators.required],
      instructor: ['', Validators.required],
      thumbnailImgUrl: [''],
      availableLanguages: [[]]
    });
  }

  loadCourses() {
    this.coursesService.getCourses().subscribe((data: Course[]) => {
      this.courses = data;
      this.filteredCourses = data;
      console.log(data);

    });
  }

  get totalCourses(): number {
    return this.courses.length;
  }

  get activeCourses(): number {
    return this.courses.filter(course => course.status === 'Active').length;
  }

  loadTopics(): void {
    this.topicsService.getTopics().subscribe({
      next: (topics) => {
        this.topics = topics;
        console.log(topics);

      },
      error: (error) => {
        console.error('Error loading topics:', error);
      }
    });
  }

  // Open add dialog
  openAddForm() {
    this.addForm.reset({
      title: { en: '', ar: '' },
      description: { en: '', ar: '' },
      availableLanguages: ['en']
    });

    // Use this approach for standalone components
    setTimeout(() => {
      this.dialog.open(this.addDialog, {
        width: '800px'
      });
    });
  }

  // Open update dialog
  openUpdateForm(course: Course) {
    this.selectedCourse = course;
    this.updateForm.patchValue({
      _id: course._id,
      title: {
        en: course.title?.en || '',
        ar: course.title?.ar || ''
      },
      slug: course.slug || '',
      description: {
        en: course.description?.en || '',
        ar: course.description?.ar || ''
      },
      topicId: course.topicId || '',
      instructor: course.instructor || '',
      thumbnailImgUrl: course.thumbnailImgUrl || '',
      availableLanguages: course.availableLanguages || []
    });

    // Use this approach for standalone components
    const dialogRef = this.dialog.open(this.updateDialog, {
      width: '800px',
      data: { course: course }
    });
  }

  // Add course
  // addNewCourse() {
  //   if (this.addForm.valid) {
  //     const newCourse = {
  //       ...this.addForm.value,
  //       topic: this.addForm.value.topicId
  //     };
  //     delete newCourse.topicId;

  //     this.coursesService.addCourse(newCourse).subscribe({
  //       next: () => {
  //         this.loadCourses();
  //         this.closeDialog();
  //       },
  //       error: (error) => {
  //         console.error('Error creating course:', error);
  //       }
  //     });
  //   }
  // }


  // Add course
  // addNewCourse() {
  //   if (this.addForm.valid) {
  //     // Create a properly formatted course object that matches the schema
  //     const newCourse = {
  //       title: {
  //         en: this.addForm.value.title?.en || '',
  //         ar: this.addForm.value.title?.ar || ''
  //       },
  //       slug: this.addForm.value.slug,
  //       description: {
  //         en: this.addForm.value.description?.en || '',
  //         ar: this.addForm.value.description?.ar || ''
  //       },
  //       topic: this.addForm.value.topicId, // This should be the ObjectId of the topic
  //       instructor: this.addForm.value.instructor, // This should be the ObjectId of the instructor
  //       thumbnailImgUrl: this.addForm.value.thumbnailImgUrl,
  //       availableLanguages: this.addForm.value.availableLanguages || ['en'],
  //       // Add other fields as needed
  //     };

  //     this.coursesService.addCourse(newCourse).subscribe({
  //       next: () => {
  //         this.loadCourses();
  //         this.closeDialog();
  //       },
  //       error: (error) => {
  //         console.error('Error creating course:', error);
  //       }
  //     });
  //   }
  // }

  addNewCourse() {
    if (this.addForm.valid) {
      const formValue = this.addForm.value;

      const newCourse = {
        title: {
          en: formValue.title?.en?.trim() || '',
          ar: formValue.title?.ar?.trim() || ''
        },
        slug: formValue.slug?.trim(),
        description: {
          en: formValue.description?.en?.trim() || '',
          ar: formValue.description?.ar?.trim() || ''
        },
        topic: formValue.topicId?.trim() || null, // assuming backend expects 'topic' not 'topicId'
        instructor: formValue.instructor?.trim() || null,
        thumbnailImgUrl: formValue.thumbnailImgUrl?.trim() || '',
        availableLanguages: formValue.availableLanguages || ['en']
      };

      this.coursesService.addCourse(newCourse).subscribe({
        next: () => {
          this.loadCourses();
          this.dialog.closeAll();
        },
        error: (error) => {
          console.error('Error creating course:', error);

          // Optional: Show user-friendly error message
          alert('Failed to add course. Please check all required fields and try again.');
        }
      });
    } else {
      // Optional: touch all fields to show validation errors
      this.addForm.markAllAsTouched();
      alert('Please complete all required fields before submitting.');
    }
  }


  // addNewCourse() {
  //   if (this.addForm.valid) {
  //     this.coursesService.addCourse(this.addForm.value).subscribe({
  //       next: () => {
  //         this.loadCourses();
  //         this.dialog.closeAll();
  //       },
  //       error: (err) => {
  //         console.error('Add topic error:', err);
  //       }
  //     });
  //   }
  // }
  // Update course
  // updateCourse() {
  //   if (this.updateForm.valid) {
  //     const updatedCourse = this.updateForm.value;
  //     this.coursesService.updateCourse(updatedCourse._id, updatedCourse).subscribe({
  //       next: () => {
  //         this.loadCourses();
  //         this.closeDialog();
  //       },
  //       error: (error) => {
  //         console.error('Error updating course:', error);
  //       }
  //     });
  //   }
  // }


  updateCourse() {
    if (this.updateForm.valid && this.selectedCourse?._id) {
      this.coursesService.updateCourse(this.selectedCourse._id, this.updateForm.value).subscribe({
        next: () => {
          this.loadCourses();
          this.dialog.closeAll();
        },
        error: (err) => {
          console.error('Update topic error:', err);
        }
      });
    }
  }
  // Delete course
  deleteCourse(id: string) {
    if (confirm('Are you sure you want to delete this course?')) {
      this.coursesService.deleteCourse(id).subscribe({
        next: () => {
          this.loadCourses();
        },
        error: (error) => {
          console.error('Error deleting course:', error);
        }
      });
    }
  }

  // Close dialog
  closeDialog() {
    this.dialog.closeAll();
  }

  // Filter courses
  filterCourses() {
    const search = this.searchControl.value?.toLowerCase() || '';
    const topic = this.selectedTopic.value || '';
    this.filteredCourses = this.courses.filter(course => {
      const matchesSearch =
        course.title?.en?.toLowerCase().includes(search) ||
        course.slug?.toLowerCase().includes(search) ||
        course.instructor?.toLowerCase().includes(search);
      return matchesSearch;
    });

  }
  // Filter courses by topic
  filterCoursesTopic() {
    const topicId = this.selectedTopic.value;
    this.filteredCourses = this.courses.filter(course => {
      return topicId === '' || course.topic === topicId;
    });
  }

  // Clear filters
  clearFilters() {
    this.searchControl.setValue('');
    this.selectedTopic.setValue('');
  }

}



