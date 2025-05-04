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
  import { CategoryService } from '../../services/category.service';
  import { Category } from '../../interfaces/category.interface';
  import { TopicsService } from '../../services/topics.service';
  import { FormControl } from '@angular/forms';
  import { debounceTime } from 'rxjs/operators';
  @Component({
    selector: 'app-category',
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
    templateUrl: './category.component.html',
    styleUrl: './category.component.scss'
  })
  export class CategoryComponent implements AfterViewInit, OnInit { 
    dataSource = new MatTableDataSource<Category>();
    displayedColumns: string[] = ['name', 'description', 'order', 'actions'];
    addForm: FormGroup;
    updateForm: FormGroup;
    selectedCategory: Category | null = null;
    searchControl = new FormControl('');
    isLoading: boolean = false; 

    @ViewChild('addDialog') addDialog!: TemplateRef<any>;
    @ViewChild('updateDialog') updateDialog!: TemplateRef<any>;

    constructor(
      private categoryService: CategoryService,
      private fb: FormBuilder,
      private dialog: MatDialog
    ) 
    {
      this.addForm = this.fb.group({
        name: this.fb.group({
          en: ['', Validators.required],
          ar: ['']
        }),
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
      console.log('CategoryComponent initialized');
      this.loadCategories();
    }

    ngAfterViewInit() {
      console.log('CategoryComponent view initialized');
      this.dataSource.filterPredicate = (data: Category, filter: string) => {
        const lowerCaseFilter = filter.trim().toLowerCase();
        return (
          (data.name?.en?.toLowerCase().includes(lowerCaseFilter) || false) ||
          (data.name?.ar?.toLowerCase().includes(lowerCaseFilter) || false) ||
          (data.description?.en?.toLowerCase().includes(lowerCaseFilter) || false) || 
          (data.description?.ar?.toLowerCase().includes(lowerCaseFilter) || false)
        );
      };

      this.searchControl.valueChanges.pipe(debounceTime(300)).subscribe((value) => {
        console.log('Search value changed:', value);
        this.dataSource.filter = value?.trim().toLowerCase() || ''; 
      });
    }

    applyFilter() {
      console.log('Applying filter with value:', this.searchControl.value);
      this.dataSource.filter = this.searchControl.value?.trim().toLowerCase() || '';
    }

    loadCategories() {
      console.log('Loading categories...');
      this.isLoading = true;
    
      this.categoryService.getCategories().subscribe({
        next: (data) => {
          console.log('Categories loaded successfully:', data);
          console.table(data); // This will display the array in a table format in the console
          this.dataSource.data = data;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error loading categories:', err);
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
          console.log('Categories loading completed');
        }
      });
    }

    addCategory() {
      console.log('Adding category with form values:', this.addForm.value);
      if (this.addForm.valid) {
        this.categoryService.createCategory(this.addForm.value).subscribe({
          next: (response) => {
            console.log('Category added successfully:', response);
            this.loadCategories();
            this.dialog.closeAll();
          },
          error: (err) => {
            console.error('Add Category error:', err);
          }
        });
      } else {
        console.warn('Form is invalid:', this.addForm.errors);
      }
    }

    updateCategory() {
      console.log('Updating category with ID:', this.selectedCategory?._id);
      console.log('Update form values:', this.updateForm.value);
    
      if (this.updateForm.valid && this.selectedCategory?._id) {
        this.categoryService.updateCategory(this.selectedCategory._id, this.updateForm.value).subscribe({
          next: (response) => {
            console.log('Category updated successfully:', response);
            this.loadCategories();
            this.dialog.closeAll();
          },
          error: (err) => {
            console.error('Update Category error:', err);
          }
        });
      } else {
        console.warn('Form is invalid or category ID is missing');
      }
    }

    deleteCategory(id: string) {
      console.log('Attempting to delete category with ID:', id);
    
      if (confirm('Are you sure you want to delete this Category?')) {
        this.categoryService.deleteCategory(id).subscribe({
          next: (response) => {
            console.log('Category deleted successfully:', response);
            this.loadCategories();
          },
          error: (err) => {
            console.error('Delete Category error:', err);
          }
        });
      } else {
        console.log('Category deletion cancelled by user');
      }
    }

    openAddForm() {
      console.log('Opening add category form');
      this.addForm.reset();
      this.dialog.open(this.addDialog, { width: '600px' });
    }

    openUpdateForm(category: Category) {
      console.log('Opening update form for category:', category);
      this.selectedCategory = category;
    
      // Only include properties that exist in the Category interface
      this.updateForm.patchValue({
        name: {
          en: category.name?.en || '',
          ar: category.name?.ar || ''
        },
        description: {
          en: category.description?.en || '',
          ar: category.description?.ar || ''
        },
        thumbnailImgUrl: category.thumbnailImgUrl || '',
        order: category.order || 0,
      });
    
      this.dialog.open(this.updateDialog, { width: '600px' });
    }

    closeDialog() {
      console.log('Closing dialog');
      this.dialog.closeAll();
    }

    clearSearch() {
      console.log('Clearing search');
      this.searchControl.reset(); 
      this.applyFilter(); 
    }
  }
