import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core'
import { NativeScriptFormsModule, NativeScriptHttpClientModule, NativeScriptModule } from '@nativescript/angular'
import { ReactiveFormsModule } from '@angular/forms'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { ItemsComponent } from './item/items.component'
import { ItemDetailComponent } from './item/item-detail.component'
import { DashboardComponent } from './screens/dashboard/dashboard.component'
import { QuizScreenComponent } from './screens/quiz-screen/quiz-screen.component'
import { ScoreboardComponent } from './screens/scoreboard/scoreboard.component'

@NgModule({
  bootstrap: [AppComponent],
  imports: [NativeScriptModule, AppRoutingModule, NativeScriptFormsModule, ReactiveFormsModule, NativeScriptHttpClientModule],
  declarations: [AppComponent, ItemsComponent, ItemDetailComponent, DashboardComponent, QuizScreenComponent, ScoreboardComponent],
  providers: [],
  schemas: [NO_ERRORS_SCHEMA],
})
export class AppModule {}
