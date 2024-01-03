import { Quiz } from '../Quiz';
import { IOManager } from './IOManager';

export class QuizManager {
  private quizes: Quiz[];

  constructor() {
    this.quizes = [];
  }

  public start(roomId: string) {
    const io = IOManager.getIO();
    const quiz = this.quizes.find((q) => q.roomId === roomId);
    quiz.start();
  }

  public next(roomId: string) {
    const io = IOManager.getIO();
    io.to(roomId).emit();
  }
}
