import { Component, ViewChild, TemplateRef, AfterViewInit, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { TopicsService } from '../../services/topics.service';
import { Topic } from '../../interfaces/topic.interface';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';


@Component({
  selector: 'app-topics',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './topics.component.html',
  styleUrls: ['./topics.component.scss'] 
})
export class TopicsComponent implements AfterViewInit, OnInit { 
  dataSource = new MatTableDataSource<Topic>();
  displayedColumns: string[] = ['name', 'slug', 'description', 'languages', 'order', 'courseCount', 'actions'];
  addForm: FormGroup;
  updateForm: FormGroup;
  selectedTopic: Topic | null = null;
  searchControl = new FormControl('');
  isLoading: boolean = false; 

  @ViewChild('addDialog') addDialog!: TemplateRef<any>;
  @ViewChild('updateDialog') updateDialog!: TemplateRef<any>;

  constructor(
    private topicsService: TopicsService,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    this.addForm = this.fb.group({
      name: this.fb.group({
        en: ['', Validators.required],
        ar: ['']
      }),
      slug: ['', Validators.required],
      description: this.fb.group({
        en: ['', Validators.required],
        ar: ['']
      }),
      thumbnailImgUrl: [''],
      availableLanguages: [[]],
      order: [0, Validators.required],
      courseCount: [0]
    });

    this.updateForm = this.fb.group({
      name: this.fb.group({
        en: ['', Validators.required],
        ar: ['']
      }),
      slug: ['', Validators.required],
      description: this.fb.group({
        en: ['', Validators.required],
        ar: ['']
      }),
      thumbnailImgUrl: [''],
      availableLanguages: [[]],
      order: [0, Validators.required],
      courseCount: [0]
    });
  }

  ngOnInit() {
    this.loadTopics();
  }

  ngAfterViewInit() {
    this.dataSource.filterPredicate = (data: Topic, filter: string) => {
      const lowerCaseFilter = filter.trim().toLowerCase();
      return (
        (data.name?.ar?.toLowerCase().includes(lowerCaseFilter) || false) ||
        (data.slug?.toLowerCase().includes(lowerCaseFilter) || false) || 
        (data.description?.en?.toLowerCase().includes(lowerCaseFilter) || false) || 
        (data.description?.ar?.toLowerCase().includes(lowerCaseFilter) || false)
      );
    };

    this.searchControl.valueChanges.pipe(debounceTime(300)).subscribe((value) => {
      this.dataSource.filter = value?.trim().toLowerCase() || ''; 
    });
  }

  applyFilter() {
    this.dataSource.filter = this.searchControl.value?.trim().toLowerCase() || '';
  }

  loadTopics() {
    this.topicsService.getTopics().subscribe({
      next: (data) => {
        this.dataSource.data = data;
      },
      error: (err) => {
        console.error('Error loading topics:', err);
      },
      complete: () => {
        this.isLoading = false;
        console.log('Topics loaded successfully.');
      }
    });
  }

  addTopic() {
    if (this.addForm.valid) {
      this.topicsService.addTopic(this.addForm.value).subscribe({
        next: () => {
          this.loadTopics();
          this.dialog.closeAll();
        },
        error: (err) => {
          console.error('Add topic error:', err);
        }
      });
    }
  }

  updateTopic() {
    if (this.updateForm.valid && this.selectedTopic?._id) {
      this.topicsService.updateTopic(this.selectedTopic._id, this.updateForm.value).subscribe({
        next: () => {
          this.loadTopics();
          this.dialog.closeAll();
        },
        error: (err) => {
          console.error('Update topic error:', err);
        }
      });
    }
  }

  deleteTopic(id: string) {
    if (confirm('Are you sure you want to delete this topic?')) {
      this.topicsService.deleteTopic(id).subscribe({
        next: () => {
          this.loadTopics();
        }
      });
    }
  }

  openAddForm() {
    this.addForm.reset();
    this.dialog.open(this.addDialog, { width: '600px' });
  }

  openUpdateForm(topic: Topic) {
    this.selectedTopic = topic;
    this.updateForm.patchValue({
      name: {
        en: topic.name?.en || '',
        ar: topic.name?.ar || ''
      },
      slug: topic.slug || '',
      description: {
        en: topic.description?.en || '',
        ar: topic.description?.ar || ''
      },
      thumbnailImgUrl: topic.thumbnailImgUrl || '',
      availableLanguages: topic.availableLanguages || [],
      order: topic.order || 0,
      courseCount: topic.courseCount || 0
    }); 
    this.dialog.open(this.updateDialog, { width: '600px' });
  }

  closeDialog() {
    this.dialog.closeAll();
  }

  clearSearch() {
    this.searchControl.reset(); 
    this.applyFilter(); 
  }
}
