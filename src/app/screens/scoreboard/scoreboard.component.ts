import { Component, OnInit } from "@angular/core";
import { RouterExtensions } from "@nativescript/angular";
import { Button, EventData, Page } from "@nativescript/core";
import { QuizAttempt } from "~/app/model/quiz-attempt.model";
import { QuizService } from "~/app/service/quiz.service";
import { RouteService } from "~/app/service/route.service";

@Component({
  moduleId: module.id,
  selector: "ns-scoreboard",
  templateUrl: "./scoreboard.component.html",
  styleUrls: ["./scoreboard.component.css"]
})
export class ScoreboardComponent implements OnInit {
  quizAttempts: QuizAttempt[] = [];
  isLoading: boolean = false;
  isComingFromDashboard: boolean = false;

  constructor(
    private router: RouterExtensions,
    private page: Page,
    private quizService: QuizService,
    private routeService: RouteService
  ) {}

  ngOnInit() {
    this.page.actionBarHidden = true;
    //Get Quiz Attempt from database
    this.quizAttempts = this.quizService.getAllLocalQuizAttempts();
    if(this.routeService.getPreviousPageUrl() == "/dashboard") {
      this.isComingFromDashboard = true;
    }
  }

  onTapReviewQuizButton(args: EventData) {
    let button = args.object as Button;
    this.router.backToPreviousPage();
  }

  onTapNewQuizSessionButton(args: EventData) {
    if (this.isComingFromDashboard) {
      this.router.backToPreviousPage();
    } else {
      this.router.navigate(["/"], { clearHistory: true });
    }
  }

  onTapDeleteData() {
    this.quizService.deleteAllQuizAttempts();
    this.quizAttempts = [];
  }
}
