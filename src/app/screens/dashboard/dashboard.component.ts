import { viewClassName } from "@angular/compiler";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { RouterExtensions } from "@nativescript/angular";
import { Slider, ListPicker, View, TextField } from "@nativescript/core";
import { Subscription } from "rxjs";
import { QuestionCategory } from "~/app/model/question-category.model";
import { QuizService } from "../../service/quiz.service";

@Component({
  moduleId: module.id,
  selector: "ns-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"]
})

export class DashboardComponent implements OnInit, OnDestroy {
  questionNumber: number = 10;

  categories: QuestionCategory[] = [];
  categoryNameList: Array<string> = [];
  selectedCategoryId: number = 0;

  difficulties = ["Any Difficulty", "Easy", "Medium", "Hard"];
  selectedDifficulty = "Any Difficulty";

  questionTypes = ["Any Type", "Multiple Choice", "True/False"];
  selectedQuestionType = "Any Type";

  isLoading = false;

  getCategoriesSubs: Subscription;
  getQuestionsSubs: Subscription;
  getQuizAttempsSubs: Subscription;

  constructor(
    private quizService: QuizService,
    private router: RouterExtensions
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.categories = this.quizService.getAllCategories();
    this.getQuizAttempsSubs = this.quizService.getAllQuizAttempts();

    if (this.categories.length == 0 || this.categories == null) {
      this.getCategoriesSubs = this.quizService
        .getCategoriesFromAPI()
        .subscribe((categoryList: QuestionCategory[]) => {
          this.isLoading = false;
          this.categories = categoryList;
          this.categoryNameList = this.categories.map(category => {
            return category.name;
          });
        });
    } else {
      this.isLoading = false;
      this.categoryNameList = this.categories.map(category => {
        return category.name;
      });
    }
  }

  ngOnDestroy() {
    if (this.getCategoriesSubs != null) {
      this.getCategoriesSubs.unsubscribe();
    }
    if (this.getQuizAttempsSubs != null) {
      this.getQuizAttempsSubs.unsubscribe();
    }
    if (this.getQuestionsSubs != null) {
      this.getQuestionsSubs.unsubscribe();
    }
  }

  selectedCategoryIndexChanged(args) {
    const picker = args.object as ListPicker;
    if (this.categories) {
      this.selectedCategoryId = this.categories.find(
        category => category.name == this.categoryNameList[picker.selectedIndex]
      ).id;
    }
  }

  selectedDifficultyIndexChanged(args) {
    const picker = args.object as ListPicker;
    this.selectedDifficulty = this.difficulties[picker.selectedIndex];
  }

  selectedTypeIndexChanged(args) {
    const picker = args.object as ListPicker;
    this.selectedQuestionType = this.questionTypes[picker.selectedIndex];
  }

  onQuestionAmountInputChanged(args) {
    const textInput = args.object as TextField;
    if (textInput.text == "") {
      textInput.text = "0"
      this.questionNumber = 0
    } else if (+textInput.text > 50) {
      textInput.text = "50"
      this.questionNumber = 50
    }
  }

  onSliderValueChange(args) {
    const slider = args.object as Slider;
    this.questionNumber = Math.round(args.value);
  }

  onStartQuiz() {
    this.isLoading = true;

    if (this.selectedCategoryId == 0) {
      this.selectedCategoryId = null;
    }

    if (this.selectedDifficulty == "Any Difficulty") {
      this.selectedDifficulty = null;
    }

    if (this.selectedQuestionType == "Multiple Choice") {
      this.selectedQuestionType = "multiple";
    } else if (this.selectedQuestionType == "True/False") {
      this.selectedQuestionType = "boolean";
    } else {
      //"Any Type"
      this.selectedQuestionType = null;
    }

    this.getQuestionsSubs = this.quizService
      .getQuizQuestionsFromAPI(
        this.questionNumber,
        this.selectedCategoryId,
        this.selectedDifficulty,
        this.selectedQuestionType
      )
      .subscribe(
        res => {
          if (res.responseCode == 0) {
            this.router.navigate(["/quizscreen"]);
            this.isLoading = false;
          }
        },
        err => {
          this.isLoading = false;
        }
      );
  }
}
