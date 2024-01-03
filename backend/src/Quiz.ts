import { IOManager } from './managers/IOManager';

interface Problem {
  title: string;
  description: string;
  image: string;
  answer: string;
  option: {
    id: string;
    title: string;
  };
}
export class Quiz {
  private roomId: string;
  private hasStarted: boolean;
  private problems: Problem[];
  private activeProblem: number;

  constructor(roomId: string) {
    this.roomId = roomId;
    this.hasStarted = false;
    this.problems = [];
    this.activeProblem = 0;
  }

  addProblem(problem: Problem): void {
    this.problems.push(problem);
  }

  start() {
    this.hasStarted = true;
    const io = IOManager.getIO();
    io.emit('CHANGE_PROBLEM', {
      problem: this.problems[0],
    });
  }

  next() {
    this.activeProblem++;
    const io = IOManager.getIO();

    const problem = this.problems[this.activeProblem];
    if (problem) {
      io.emit('CHANGE_PROBLEM', problem);
    } else {
      io.emit('QUIZ_END');
    }
  }
}
