import { Component, OnChanges, OnInit } from "@angular/core";
import { RouterExtensions } from "@nativescript/angular";
import { Button, EventData, ItemEventData, Page } from "@nativescript/core";
import { Question } from "~/app/model/question.model";
import { QuizService } from "~/app/service/quiz.service";
import { RouteService } from "~/app/service/route.service";


@Component({
  moduleId: module.id,
  selector: "ns-quiz-screen",
  templateUrl: "./quiz-screen.component.html",
  styleUrls: ["./quiz-screen.component.css"]
})
export class QuizScreenComponent implements OnInit {
  questionList: Question[] = [];
  currentQuestionIndex = 0;
  currentQuestion = "";
  currentQuestionAnswers: string[] = [];

  // isAnswerSelected: boolean = false
  selectedAnswerIndex: number;
  correctAnswerIndex: number;
  answerIndexRecord = new Map<number, number>();

  totalCorrectAnswer = 0;

  interval;
  time = new Date(null);

  constructor(
    private quizService: QuizService,
    private router: RouterExtensions,
    private page: Page,
  ) {}

  ngOnInit() {
    this.page.actionBarHidden = true;
    this.startTimer();
    this.questionList = this.quizService.getQuestions();
    this.updateQuestion(this.currentQuestionIndex);
  }

  onTapToggleButton(args: EventData) {
    let button = args.object as Button;
    if (button.id == "0") {
      //Previous button
      if (this.currentQuestionIndex != 0) {
        this.currentQuestionIndex -= 1;
        this.updateQuestion(this.currentQuestionIndex);
      }
    } else {
      //Next button
      if (this.currentQuestionIndex < this.questionList.length - 1) {
        this.currentQuestionIndex += 1;
        this.updateQuestion(this.currentQuestionIndex);
      }
    }
    //Check if question already answered or not
    this.selectedAnswerIndex = this.answerIndexRecord.get(
      this.currentQuestionIndex
    );
  }

  onAnswerSelected(args: ItemEventData) {
    const index = args.index;
    // console.log(`Index: ${index}`)
    // args.view.backgroundColor = "#f5f5ba";

    //Set (question number, chosen answer index)
    this.answerIndexRecord.set(this.currentQuestionIndex, index);
    this.selectedAnswerIndex = index;

    if (index == this.correctAnswerIndex) {
      this.totalCorrectAnswer += 1;
    }
  }

  onTapSubmitQuizButton(args: EventData) {
    this.stopTimer();
    this.quizService
      .saveQuizAttempt(this.time.toISOString(), this.totalCorrectAnswer).subscribe(res => {
        console.log(res);
        this.router.navigate(["/scoreboard"]);
      });
  }

  //Timer Method
  startTimer() {
    //means for every 1000ms = 1s, this time will add 1
    this.interval = setInterval(() => {
      this.time.setSeconds(this.time.getSeconds() + 1);
    }, 1000);
  }

  stopTimer() {
    if (typeof this.interval === "number") {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  //Helper Method
  updateQuestion(currentQuestionNumber: number) {
    this.currentQuestion = this.questionList[currentQuestionNumber].question.replace("&#039;","'");
    this.currentQuestionAnswers = this.questionList[
      currentQuestionNumber
    ].answers;
    this.correctAnswerIndex = this.questionList[
      currentQuestionNumber
    ].answers.indexOf(this.questionList[currentQuestionNumber].correctAnswer);
  }

  checkAnswerByIndex(selectedIndex: number) {
    if (selectedIndex == this.correctAnswerIndex) {
      return true;
    } else {
      return false;
    }
  }
}
