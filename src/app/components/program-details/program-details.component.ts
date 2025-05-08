import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProgramsService } from '../../services/programs.service';
import { program } from '../../interfaces/program.interface';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-program-details',
  standalone: true,
  imports: [CommonModule, MatInputModule, MatSelectModule, FormsModule, ReactiveFormsModule, MatCardModule, MatIconModule, MatProgressSpinnerModule, MatButtonModule, MatFormFieldModule],
  templateUrl: './program-details.component.html',
  styleUrl: './program-details.component.scss'
})
export class ProgramDetailsComponent implements OnInit {
  program!: program;
  loading = true;
  updateForm!: FormGroup;
  selectedProgram!: program;


  constructor(
    private route: ActivatedRoute,
    private programsService: ProgramsService,
    private location: Location,
    private fb: FormBuilder,

    private dialog: MatDialog // Add this
  ) {
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

  goBack(): void {
    this.location.back();
  }

  @ViewChild('updateDetailsDialog') updateDetailsDialog!: TemplateRef<any>;

  openUpdateDetailsForm(program: program): void {
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

    this.dialog.open(this.updateDetailsDialog, {
      width: '800px'
    });
  }

  ngOnInit() {
    const programId = this.route.snapshot.paramMap.get('id');
    if (programId) {
      this.programsService.getProgramById(programId).subscribe({
        next: (program) => {
          this.program = program;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
    }
  }



  updateProgram(): void {
    if (this.updateForm.valid) {
      const updatedProgram = { ...this.selectedProgram, ...this.updateForm.value };
      this.programsService.updateProgram(updatedProgram).subscribe({
        next: () => {
          this.program = updatedProgram;
          this.dialog.closeAll();
        }
      });
    }
  }

  deleteProgram(): void {

    if (this.program) {
      if (confirm('Are you sure you want to delete this program?')) {
        this.programsService.deleteProgram(this.program._id).subscribe({
          next: () => {
            this.goBack();
          }
        });
        alert('Program deleted successfully');
        this.location.back();
      } else {
        alert('Deletion canceled');
      }

    }
  }
}
