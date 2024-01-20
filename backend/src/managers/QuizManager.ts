import { Quiz } from '../Quiz';
import { IOManager } from './IOManager';

export class QuizManager {
  private quizes: Quiz[];

  constructor() {
    this.quizes = [];
  }

  public start(roomId: string) {
    const quiz = this.getQuiz(roomId);
    if (!quiz) return;
    quiz.start();
  }

  public addProblem(
    roomId: string,
    problem: {
      title: string;
      description: string;
      image: string;
      options: {
        id: string;
        title: string;
      }[];
      answer: SubmissionType;
    }
  ) {
    const quiz = this.getQuiz(roomId);
    if (!quiz) return;

    quiz.addProblem({
      ...problem,
      startTime: new Date().getTime(),
      submissions: [],
    });
  }

  public next(roomId: string) {
    const io = IOManager.getIO();
    io.to(roomId).emit('START_ROOM');
  }

  addUser(roomId: string, name: string) {
    return this.getQuiz(roomId)?.addUser(name);
  }

  getQuiz(roomId: string) {
    return this.quizes.find((q) => q.roomId === roomId) ?? null;
  }

  getCurrenState(roomId: string) {
    const quiz = this.getQuiz(roomId);
    if (!quiz) return;

    return quiz.getCurrentState();
  }

  submit(
    userId: string,
    roomId: string,
    problemId: string,
    submission: 0 | 1 | 2 | 3
  ) {
    this.getQuiz(roomId)?.submit(userId, roomId, problemId, submission);
  }
}
