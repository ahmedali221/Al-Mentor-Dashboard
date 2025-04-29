import { Component, ViewChild, TemplateRef, AfterViewInit, OnInit } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { SubtopicsService } from '../../services/subtopics.service';
import { Subtopics } from '../../interfaces/subtopics';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TopicsService } from '../../services/topics.service';
import { Topic } from '../../interfaces/topic.interface';
import { MatSelectModule } from '@angular/material/select';


@Component({
  selector: 'app-sub-topics',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTableModule,
    MatCheckboxModule,
    MatSelectModule
  ],
  templateUrl: './sub-topics.component.html',
  styleUrls: ['./sub-topics.component.scss']
})
export class SubTopicsComponent implements OnInit, AfterViewInit {
  dataSource = new MatTableDataSource<Subtopics>();
  displayedColumns: string[] = ['name', 'slug', 'order', 'isFeatured', 'actions'];
  addForm: FormGroup;
  updateForm: FormGroup;
  selectedSubTopic: Subtopics | null = null;
  searchTerm: string = '';
  topics: Topic[] = [];
  selectedTopicId: string = '';

  @ViewChild('addDialog') addDialog!: TemplateRef<any>;
  @ViewChild('updateDialog') updateDialog!: TemplateRef<any>;

  constructor(
    private subtopicsService: SubtopicsService,
    private topicsService: TopicsService,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    this.addForm = this.fb.group({
      name: this.fb.group({
        en: ['', Validators.required],
        ar: ['', Validators.required]
      }),
      slug: ['', Validators.required],
      topic: ['', Validators.required],
      description: this.fb.group({
        en: [''],
        ar: ['']
      }),
      thumbnailImgUrl: [''],
      order: [0, Validators.required],
      isFeatured: [false]
    });

    this.updateForm = this.fb.group({
      name: this.fb.group({
        en: ['', Validators.required],
        ar: ['', Validators.required]
      }),
      slug: ['', Validators.required],
      topic: ['', Validators.required],
      description: this.fb.group({
        en: [''],
        ar: ['']
      }),
      thumbnailImgUrl: [''],
      order: [0, Validators.required],
      isFeatured: [false]
    });
  }

  ngOnInit() {
    this.loadTopics();
    this.loadSubTopics();
  }

  ngAfterViewInit() {
    this.dataSource.filterPredicate = (data: Subtopics, filter: string) =>
      (data.name?.en?.toLowerCase().includes(filter) || data.slug?.toLowerCase().includes(filter));
  }

  applyFilter() {
    this.dataSource.filter = this.searchTerm.trim().toLowerCase();
  }

  loadSubTopics() {
    this.subtopicsService.getAllSubTopics().subscribe({
      next: (data) => {
        this.dataSource.data = data;
      },
      error: (err) => {
        console.error('Error loading subtopics:', err);
      },
      complete: () => {
        console.log('Subtopics loaded successfully.');
      }
    });
  }
  applyTopicFilter() {
    if (!this.selectedTopicId) {
      this.dataSource.filter = '';
    } else {
      this.dataSource.filterPredicate = (data: Subtopics, filter: string) =>
        data.topic === filter;
      this.dataSource.filter = this.selectedTopicId;
    }
  }
  
  
  

  loadTopics() {
    this.topicsService.getTopics().subscribe({
      next: (data) => {
        this.topics = data;
      },
      error: (err) => {
        console.error('Error loading topics:', err);
      }
    });
  }

  filterSubTopicsByTopic() {
    if (this.selectedTopicId) {
      this.subtopicsService.getSubTopicsByTopic(this.selectedTopicId).subscribe({
        next: (data) => {
          this.dataSource.data = data;
        },
        error: (err) => {
          console.error('Error filtering subtopics:', err);
        }
      });
    } else {
      this.loadSubTopics();
    }
  }

  addSubTopic() {
    console.log('Form value:', this.addForm.value);

    if (this.addForm.valid) {
      this.subtopicsService.createSubTopic(this.addForm.value).subscribe({
        next: () => {
          this.loadSubTopics();
          this.dialog.closeAll();
        },
        error: (err) => {
          console.error('Add subtopic error:', err);
        }
      });
    }
  }

  updateSubTopic() {
    if (this.updateForm.valid && this.selectedSubTopic?._id) {
      this.subtopicsService.updateSubTopic(this.selectedSubTopic._id, this.updateForm.value).subscribe(() => {
        this.loadSubTopics();
        this.dialog.closeAll();
      });
    }
  }

  deleteSubTopic(id: string) {
    if (confirm('Are you sure you want to delete this subtopic?')) {
      this.subtopicsService.deleteSubTopic(id).subscribe(() => {
        this.loadSubTopics();
      });
    }
  }

  openAddForm() {
    this.addForm.reset({
      name: { en: '', ar: '' },
      slug: '',
      topic: '',
      description: { en: '', ar: '' },
      thumbnailImgUrl: '',
      order: 0,
      isFeatured: false
    }); 
    this.dialog.open(this.addDialog, { width: '600px' });
  }

  openUpdateForm(subTopic: Subtopics) {
    this.selectedSubTopic = subTopic;
    this.updateForm.patchValue({
      name: {
        en: subTopic.name.en,
        ar: subTopic.name.ar
      },
      slug: subTopic.slug,
      topic: subTopic.topic,
      description: {
        en: subTopic.description?.en || '',
        ar: subTopic.description?.ar || ''
      },
      thumbnailImgUrl: subTopic.thumbnailImgUrl,
      order: subTopic.order,
      isFeatured: subTopic.isFeatured
    }); 
    this.dialog.open(this.updateDialog, { width: '600px' });
  }

  closeDialog() {
    this.dialog.closeAll();
  }
}