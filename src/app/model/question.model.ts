
export class QuestionResponse {
  public responseCode: number;
  public results: Question[];

  constructor(responseCode: number, results: Question[]) {
    this.responseCode = responseCode;
    this.results = results;
  }
}


export class Question {
  public category: string;
  public type: string;
  public difficulty: string;
  public question: string;
  public correctAnswer: string;
  public incorrectAnswers: string[];
  public answers: string[];


  constructor(category: string, type: string, difficulty: string, question: string, correctAnswer: string, incorrectAnswers: string[] ) {
    this.category = category;
    this.type = type;
    this.difficulty = difficulty;
    this.question = question;
    this.correctAnswer = correctAnswer;
    this.incorrectAnswers = incorrectAnswers;
    this.answers = this.incorrectAnswers;
    this.answers.push(correctAnswer);
    this.shuffle(this.answers)
  }

  shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
}
