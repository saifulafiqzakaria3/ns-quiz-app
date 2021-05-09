
// (a score board) containing all my completed quiz attempts with the following details: Date/Time, Duration, Correct Answers/Number of Questions Answered.

export class QuizAttempt {
  public dateTime: Date;
  public duration: string;
  public totalCorrectAnswer: number;
  public totalQuestion: number;

  constructor(dateTime: Date, duration: string, totalCorrectAnswer: number, totalQuestion: number) {
    this.dateTime = dateTime;
    this.duration = duration;
    this.totalCorrectAnswer = totalCorrectAnswer;
    this.totalQuestion = totalQuestion;
  }
}
