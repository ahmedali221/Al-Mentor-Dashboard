import { Routes } from '@angular/router';
import { DashboardComponent } from './components/layout/dashboard/dashboard.component';
import { UsersComponent } from './components/users/users.component';
import { InstructorsComponent } from './components/instructors/instructors.component';
import { CoursesComponent } from './components/courses/courses.component';
import { ProgramsComponent } from './components/programs/programs.component';
import { TopicsComponent } from './components/topics/topics.component';
import { CLessonsComponent } from './components/lessons/lessons.component';
import { CategoryComponent } from './components/category/category.component';
import { ProgramDetailsComponent } from './components/program-details/program-details.component';
import { PaymentsComponent } from './components/payments/payments.component';
import { SubTopicsComponent } from './components/sub-topics/sub-topics.component';

import { SubscriptionsComponent } from './components/subscriptions/subscriptions.component';
import { UserSubscriptionsComponent } from './components/user-subscriptions/user-subscriptions.component';

export const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      { path: 'users', component: UsersComponent },
      { path: 'instructors', component: InstructorsComponent },
      { path: 'courses', component: CoursesComponent },
      { path: 'lessons', component: CLessonsComponent },
      { path: 'programs', component: ProgramsComponent },
      { path: 'subscriptions', component: SubscriptionsComponent },
      { path: 'userSubscriptions', component: UserSubscriptionsComponent },
      {
        path: 'programs',
        children: [
          { path: '', component: ProgramsComponent },
          { path: ':id', component: ProgramDetailsComponent },
        ],
      },
      { path: 'topics', component: TopicsComponent },
      { path: 'sub-topics', component: SubTopicsComponent },
      { path: 'categories', component: CategoryComponent },
      { path: '', redirectTo: 'users', pathMatch: 'full' }
    ]
  },

]

