import { IOManager } from './managers/IOManager';

const PROBLEM_TIME_S = 20;

export type SubmissionType = 0 | 1 | 2 | 3;
interface User {
  name: string;
  id: string;
  points: number;
}

interface Submission {
  problemId: string;
  userId: string;
  isCorrect: boolean;
  optionSelected: SubmissionType;
}
interface Problem {
  id: string;
  title: string;
  description: string;
  image: string;
  answer: SubmissionType;
  options: {
    id: string;
    title: string;
  }[];
  submissions: Submission[];
  startTime: number;
}
export class Quiz {
  public roomId: string;
  private hasStarted: boolean;
  private problems: Problem[];
  private activeProblem: number;
  private currentState: 'leaderboard' | 'question' | 'not_started' | 'ended';

  private users: User[];

  constructor(roomId: string) {
    this.roomId = roomId;
    this.hasStarted = false;
    this.problems = [];
    this.activeProblem = 0;
    this.users = [];
    this.currentState = 'not_started';
  }

  addProblem(problem: Problem): void {
    this.problems.push(problem);
  }

  setActiveProblem(problem: Problem): void {
    problem.startTime = new Date().getTime();
    problem.submissions = [];
    // TODO: clear this if function moves ahead
    IOManager.getIO().emit('CHANGE_PROBLEM', problem);
    setTimeout(() => {
      this.sendLeaderboard();
    }, PROBLEM_TIME_S * 1000);
  }

  sendLeaderboard() {
    const leaderboard = this.getLeaderboard();
    IOManager.getIO().to(this.roomId).emit('leaderboard', leaderboard);
  }

  start() {
    this.hasStarted = true;
    this.problems[0].startTime = new Date().getTime();
    this.setActiveProblem(this.problems[0]);
  }

  next() {
    this.activeProblem++;

    const problem = this.problems[this.activeProblem];
    if (problem) {
      this.setActiveProblem(problem);
    } else {
      // send final results from here
      // IOManager.getIO().emit('QUIZ_END');
    }
  }

  genRandomString(length: number) {
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()';
    var charLength = chars.length;
    var result = '';
    for (var i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * charLength));
    }
    return result;
  }

  addUser(name: string) {
    const id = this.genRandomString(7);
    this.users.push({
      name,
      id,
      points: 0,
    });
    return id;
  }

  submit(
    userId: string,
    roomId: string,
    problemId: string,
    submission: SubmissionType
  ) {
    const problem = this.problems.find((p) => p.id === problemId);
    const user = this.users.find((u) => u.id === userId);

    if (!problem || !user) {
      return;
    }

    const existingSubmission = problem.submissions.find(
      (p) => p.userId === userId
    );

    if (existingSubmission) {
      return;
    }

    problem.submissions.push({
      problemId,
      userId,
      isCorrect: problem.answer === submission,
      optionSelected: submission,
    });

    user.points +=
      1000 -
      (500 * (new Date().getTime() - problem.startTime)) / PROBLEM_TIME_S;
  }

  getLeaderboard() {
    return this.users.sort((a, b) => a.points - b.points).splice(0, 20);
  }

  getCurrentState() {
    if (this.currentState === 'not_started') {
      return {
        type: 'not_started',
      };
    }
    if (this.currentState === 'ended') {
      return {
        type: 'ended',
        leaderboard: this.getLeaderboard(),
      };
    }
    if (this.currentState === 'leaderboard') {
      return {
        type: 'leaderboard',
        leaderboard: this.getLeaderboard(),
      };
    }
    if (this.currentState === 'question') {
      const problem = this.problems[this.activeProblem];
      return {
        type: 'question',
        problem,
      };
    }
  }
}
