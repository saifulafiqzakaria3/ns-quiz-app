import { NgModule } from '@angular/core'
import { Routes } from '@angular/router'
import { NativeScriptRouterModule } from '@nativescript/angular'

import { ItemsComponent } from './item/items.component'
import { ItemDetailComponent } from './item/item-detail.component'
import { DashboardComponent } from './screens/dashboard/dashboard.component'
import { QuizScreenComponent } from './screens/quiz-screen/quiz-screen.component'
import { ScoreboardComponent } from './screens/scoreboard/scoreboard.component'

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  // { path: 'items', component: ItemsComponent },
  // { path: 'item/:id', component: ItemDetailComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'quizscreen', component: QuizScreenComponent },
  { path: 'scoreboard', component: ScoreboardComponent },
]

@NgModule({
  imports: [NativeScriptRouterModule.forRoot(routes)],
  exports: [NativeScriptRouterModule],
})
export class AppRoutingModule {}
