import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { QuestionCategory } from "../model/question-category.model";
import { Question, QuestionResponse } from "../model/question.model";
import { QuizAttempt } from "../model/quiz-attempt.model";
import { map, tap } from "rxjs/operators";
import _ from 'underscore';

@Injectable({ providedIn: "root" })
export class QuizService {
  private categoryList: QuestionCategory[] = [];
  private questions: Question[] = [];
  allQuizAttempts: QuizAttempt[] = [];

  constructor(private http: HttpClient) {}

  getAllCategories() {
    return this.categoryList.slice();
  }

  getAllLocalQuizAttempts() {
    return this.allQuizAttempts.slice();
  }

  getQuestions() {
    //slice is for copying the exact array because we dont want to let the user to access the real array
    return this.questions.slice();
  }

  getCategoriesFromAPI() {
    return this.http.get("https://opentdb.com/api_category.php").pipe(
      map(data => {
        return data["trivia_categories"].map(category => {
          return new QuestionCategory(category["id"], category["name"]);
        });
      }),
      tap(categories => {
        this.categoryList = categories != null ? categories : [];
        this.categoryList.unshift(new QuestionCategory(0, "Any Category"));
      })
    );
  }

  getQuizQuestionsFromAPI(amount: number,category?: number,difficulty?: string, type?: string) {

    //eg: https://opentdb.com/api.php?amount=9&category=10&difficulty=medium&type=boolean
    let apiReqUrl = "https://opentdb.com/api.php?amount=" + amount;
    if (category != null) {
      apiReqUrl += "&category=" + category;
    }
    if (difficulty != null) {
      apiReqUrl += "&difficulty=" + difficulty.toLowerCase();
    }
    if (type != null) {
      apiReqUrl += "&type=" + type;
    }
    return this.http.get(apiReqUrl).pipe(
      map(data => {
        return new QuestionResponse(
          data["response_code"],
          data["results"].map(question => {
            return new Question(
              question["category"],
              question["type"],
              question["difficulty"],
              _.unescape(question["question"]),
              question["correct_answer"],
              question["incorrect_answers"]
            );
          })
        );
      }),
      tap(questionResponse => {
        this.questions = questionResponse.results;
      })
    );
  }

  saveQuizAttempt(duration: string, totalCorrectAnswer: number) {
    const newQuizAttempt = new QuizAttempt(
      new Date(),
      duration,
      totalCorrectAnswer,
      this.questions.length
    );

    if (this.allQuizAttempts == null) {
      this.allQuizAttempts = [newQuizAttempt];
    } else {
      this.allQuizAttempts.push(newQuizAttempt);
    }

    return this.http.put(
      "https://ns-angular-quiz-assessment-default-rtdb.firebaseio.com/quizattempt.json",
      this.allQuizAttempts
    );
  }

  getAllQuizAttempts() {
    if (this.allQuizAttempts == null || this.allQuizAttempts.length == 0) {
      //Only will be send after we subscribe, so neeed to use subscribe function here
      return this.http
        .get<QuizAttempt[]>(
          "https://ns-angular-quiz-assessment-default-rtdb.firebaseio.com/quizattempt.json"
        )
        .subscribe(attempts => {
          this.allQuizAttempts = attempts != null ? attempts : [];
        });
    }
  }

  deleteAllQuizAttempts() {
    return this.http
      .delete(
        "https://ns-angular-quiz-assessment-default-rtdb.firebaseio.com/quizattempt.json"
      )
      .subscribe(attempts => {
        this.allQuizAttempts = [];
      });
  }

}
