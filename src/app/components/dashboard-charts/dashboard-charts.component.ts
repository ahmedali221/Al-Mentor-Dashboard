import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UsersService } from '../../services/users.service';
import { CoursesService } from '../../services/course.service';
import { SubscriptionsService } from '../../services/subscriptions.service';
import { CategoryService } from '../../services/category.service';
import { ProgramsService } from '../../services/programs.service';
import { TopicsService } from '../../services/topics.service';
import { InstructorsService } from '../../services/instructors.service';
import { User } from '../../interfaces/user.interface';
import { Course } from '../../interfaces/course';
import { Subscription } from '../../interfaces/subscriptions';
import { Category } from '../../interfaces/category.interface';
import { program } from '../../interfaces/program.interface';
import { Topic } from '../../interfaces/topic.interface';
import { Instructor } from '../../interfaces/instructor.interface';

@Component({
  selector: 'app-dashboard-charts',
  standalone: true,
  imports: [
    CommonModule,
    NgxChartsModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './dashboard-charts.component.html',
  styleUrl: './dashboard-charts.component.scss',
})
export class DashboardChartsComponent implements OnInit {
  // Chart data grouped into a single object
  chartData = {
    usersByRole: [] as any[],
    coursesByCategory: [] as any[],
    subscriptionsByMonth: [] as any[],
    subscriptionsOverTime: [] as any[],
    topicsByCategory: [] as any[],
    programsByStatus: [] as any[]
  };

  // Raw data
  students: User[] = [];
  instructors: Instructor[] = [];
  courses: Course[] = [];
  subscriptions: Subscription[] = [];
  allCategories: Category[] = [];
  programs: program[] = [];
  topics: Topic[] = [];
  categoryNameMap = new Map<string, string>();

  // Loading and error states
  loading = false;
  error = '';

  // Chart color scheme
  colorScheme = {
    name: 'vivid',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA', '#FF7F0E', '#1F77B4', '#2CA02C']
  };

  constructor(
    private usersService: UsersService,
    private coursesService: CoursesService,
    private subscriptionsService: SubscriptionsService,
    private categoryService: CategoryService,
    private programsService: ProgramsService,
    private topicsService: TopicsService,
    private instructorsService: InstructorsService
  ) { }

  ngOnInit() {
    this.loadAllData();
  }

  loadAllData() {
    this.loading = true;
    this.error = '';
    // Load all in parallel
    Promise.all([
      this.loadStudents(),
      this.loadInstructors(),
      this.loadCourses(),
      this.loadSubscriptions(),
      this.loadCategoriesData(),
      this.loadPrograms(),
      this.loadTopics()
    ]).then(() => {
      this.loading = false;
    }).catch((err) => {
      this.error = 'Failed to load dashboard data';
      this.loading = false;
      console.error('DashboardChartsComponent error:', err);
    });
  }

  loadPrograms(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.programsService.getPrograms().subscribe({
        next: (programs: program[]) => {
          this.programs = programs;
          // Create program distribution by level
          const levelCounts = new Map<string, number>();
          programs.forEach(program => {
            const level = program.level?.en || 'Not Specified';
            levelCounts.set(level, (levelCounts.get(level) || 0) + 1);
          });
          this.chartData.programsByStatus = Array.from(levelCounts, ([name, value]) => ({ name, value }));
          resolve();
        },
        error: (error) => {
          console.error('Failed to load programs:', error);
          resolve(); // Resolve so other data can still load
        }
      });
    });
  }

  loadTopics(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.topicsService.getTopics().subscribe({
        next: (topics: Topic[]) => {
          this.topics = topics;
          // Create topic distribution by category
          const categoryCounts = new Map<string, number>();
          topics.forEach(topic => {
            const categoryDisplayName = this.categoryNameMap.get(topic.category) || 'Uncategorized';
            categoryCounts.set(categoryDisplayName, (categoryCounts.get(categoryDisplayName) || 0) + 1);
          });
          this.chartData.topicsByCategory = Array.from(categoryCounts, ([name, value]) => ({ name, value }));
          resolve();
        },
        error: (error) => {
          console.error('Failed to load topics:', error);
          resolve(); // Resolve so other data can still load
        }
      });
    });
  }

  loadInstructors(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.instructorsService.getInstructors().subscribe({
        next: (instructors: Instructor[]) => {
          this.instructors = instructors;
          resolve();
        },
        error: (error) => {
          console.error('Failed to load instructors:', error);
          resolve(); // Resolve so other data can still load
        }
      });
    });
  }

  loadStudents(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.usersService.getUsers().subscribe({
        next: (users: User[]) => {
          this.students = users;
          const roleCounts = new Map<string, number>();
          users.forEach(() => {
            roleCounts.set('Student', (roleCounts.get('Student') || 0) + 1);
          });
          this.chartData.usersByRole = Array.from(roleCounts, ([name, value]) => ({ name, value }));
          resolve();
        },
        error: (error) => {
          this.error = 'Failed to load users';
          reject(error);
        }
      });
    });
  }

  loadCategoriesData(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.categoryService.getCategories().subscribe({
        next: (categories: Category[]) => {
          this.allCategories = categories;
          categories.forEach(cat => {
            if (cat._id) {
              this.categoryNameMap.set(cat._id, cat.name.en);
            }
          });
          resolve();
        },
        error: (error) => {
          // Even if categories fail to load, we can proceed, charts will show 'Uncategorized'
          console.error('Failed to load categories:', error);
          resolve(); // Resolve so other data can still load
        }
      });
    });
  }

  loadCourses(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.coursesService.getCourses().subscribe({
        next: (courses: Course[]) => {
          this.courses = courses;
          const categoryCounts = new Map<string, number>();
          courses.forEach(course => {
            const categoryDisplayName = this.categoryNameMap.get(course.category) || 'Uncategorized';
            categoryCounts.set(categoryDisplayName, (categoryCounts.get(categoryDisplayName) || 0) + 1);
          });
          this.chartData.coursesByCategory = Array.from(categoryCounts, ([name, value]) => ({ name, value }));
          resolve();
        },
        error: (error) => {
          this.error = 'Failed to load courses';
          reject(error);
        }
      });
    });
  }

  loadSubscriptions(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.subscriptionsService.getAll().subscribe({
        next: (subs: Subscription[]) => {
          this.subscriptions = subs;
          const now = new Date();
          const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());

          const subsWithDates = subs.map(sub => ({
            ...sub,
            createdAt: new Date(oneYearAgo.getTime() + Math.random() * (now.getTime() - oneYearAgo.getTime()))
          }));

          // Subscriptions by month (for bar chart)
          const monthMap = new Map<string, number>();
          subsWithDates.forEach(sub => {
            const date = sub.createdAt; // Already a Date object
            const month = date.toLocaleString('default', { month: 'short', year: 'numeric' });
            monthMap.set(month, (monthMap.get(month) || 0) + 1);
          });
          // Sort by date for the bar chart before converting from map
          const sortedMonthEntries = Array.from(monthMap.entries()).sort((a, b) => {
            return new Date(a[0]).getTime() - new Date(b[0]).getTime();
          });
          this.chartData.subscriptionsByMonth = sortedMonthEntries.map(([name, value]) => ({ name, value }));

          // Subscriptions growth over time (for line chart)
          subsWithDates.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

          const monthlyGrowth = new Map<string, number>();
          subsWithDates.forEach(sub => {
            const date = sub.createdAt;
            // Key format: YYYY-MM to ensure chronological sorting of the map keys before processing
            const monthKey = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2);
            monthlyGrowth.set(monthKey, (monthlyGrowth.get(monthKey) || 0) + 1);
          });

          let cumulativeMonthlyCount = 0;
          const consolidatedSeries: { name: string, value: number }[] = [];
          // Sort map keys (YYYY-MM) to process in chronological order
          Array.from(monthlyGrowth.keys()).sort().forEach(monthKey => {
            cumulativeMonthlyCount += monthlyGrowth.get(monthKey) || 0;
            const [year, monthNum] = monthKey.split('-');
            const monthName = new Date(parseInt(year), parseInt(monthNum) - 1).toLocaleString('default', { month: 'short' });
            consolidatedSeries.push({
              name: monthName + ' ' + year,
              value: cumulativeMonthlyCount
            });
          });
          this.chartData.subscriptionsOverTime = [{ name: 'Total Subscriptions', series: consolidatedSeries }];

          resolve();
        },
        error: (error) => {
          this.error = 'Failed to load subscriptions';
          reject(error);
        }
      });
    });
  }

  // Getters for totals
  get totalStudents(): number {
    return this.students.length;
  }

  get totalInstructors(): number {
    return this.instructors.length;
  }

  get totalCourses(): number {
    return this.courses.length;
  }

  get totalSubscriptions(): number {
    return this.subscriptions.length;
  }

  get totalPrograms(): number {
    return this.programs.length;
  }

  get totalCategories(): number {
    return this.allCategories.length;
  }

  get totalTopics(): number {
    return this.topics.length;
  }
}
