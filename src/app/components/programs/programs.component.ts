import { Component, ViewChild, TemplateRef } from '@angular/core';
import { ProgramsService } from '../../services/programs.service';
import { program } from '../../interfaces/program.interface';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { TitleCasePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';


@Component({
  selector: 'app-programs',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTableModule,
    TitleCasePipe,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule, MatSelectModule

  ],
  templateUrl: './programs.component.html',
  styleUrl: './programs.component.scss'
})
export class ProgramsComponent {
  displayedColumns: string[] = ['title', 'level', 'language', 'category', 'totalDuration', 'Instructors', 'actions'];
  programs: program[] = [];
  addForm: FormGroup;
  updateForm: FormGroup;
  selectedProgram: any;

  constructor(
    private programService: ProgramsService,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    this.addForm = this.fb.group({
      title: ['', Validators.required],
      slug: ['', Validators.required],
      description: ['', Validators.required],
      thumbnail: ['', Validators.required],
      level: ['', Validators.required],
      language: ['', Validators.required],
      category: ['', Validators.required],
      totalDuration: ['', Validators.required]
    });

    this.updateForm = this.fb.group({
      title: ['', Validators.required],
      slug: ['', Validators.required],
      description: ['', Validators.required],
      thumbnail: ['', Validators.required],
      level: ['', Validators.required],
      language: ['', Validators.required],
      category: ['', Validators.required],
      totalDuration: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadPrograms();
  }

  loadPrograms() {
    this.programService.getPrograms().subscribe({
      next: (data) => {
        this.programs = data;
      }
    });
  }



  addProgram() {
    if (this.addForm.valid) {
      this.programService.addProgram(this.addForm.value).subscribe({
        next: () => {
          this.loadPrograms();
          this.dialog.closeAll();
        }
      });
    }
  }

  updateProgram() {
    if (this.updateForm.valid) {
      const updatedProgram = { ...this.selectedProgram, ...this.updateForm.value };
      this.programService.updateProgram(updatedProgram).subscribe({
        next: () => {
          this.loadPrograms();
          this.dialog.closeAll();
        }
      });
    }
  }

  deleteProgram(id: string) {
    if (confirm('Are you sure you want to delete this program?')) {
      this.programService.deleteProgram(id).subscribe({
        next: () => {
          this.loadPrograms();
        }
      });
    }
  }

  getTotalICourses(): number {
    if (!this.programs) return 0;
    return this.programs.reduce((total, program) => {
      return total + (program.coursesDetails?.length || 0);
    }, 0);
  }

  @ViewChild('addDialog') addDialog!: TemplateRef<any>;

  openAddForm() {
    this.addForm.reset();
    this.dialog.open(this.addDialog, {
      width: '600px'
    });
  }

  @ViewChild('updateDialog') updateDialog!: TemplateRef<any>;
  openUpdateForm(program: program) {
    this.selectedProgram = program;
    this.updateForm.patchValue({
      title: program.title,
      slug: program.slug,
      description: program.description,
      thumbnail: program.thumbnail,
      level: program.level,
      language: program.language,
      category: program.category,
      totalDuration: program.totalDuration
    });
    this.dialog.open(this.updateDialog, {
      width: '600px'
    });
  }
}