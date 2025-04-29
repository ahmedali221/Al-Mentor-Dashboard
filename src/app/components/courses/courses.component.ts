import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
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
    MatDialogModule
  ],
  standalone: true
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
      this.filterCourses();
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
      topicId: ['', Validators.required],
      instructor: ['', Validators.required],
      thumbnailImgUrl: [''],
      availableLanguages: [['en']]
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
    this.dialog.open(this.addDialog, {
      width: '800px'
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
    this.dialog.open(this.updateDialog, {
      width: '800px'
    });


  }

  // Add course
  addNewCourse() {
    if (this.addForm.valid) {
      const newCourse = this.addForm.value;
      this.coursesService.addCourse(newCourse).subscribe({
        next: () => {
          this.loadCourses();
          this.closeDialog();
        },
        error: (error) => {
          console.error('Error creating course:', error);
        }
      });
    }
  }

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
      const matchesTopic = topic ? course.topicId === topic : true;
      return matchesSearch && matchesTopic;
    });
  }

  // Clear filters
  clearFilters() {
    this.searchControl.setValue('');
    this.selectedTopic.setValue('');
  }
}