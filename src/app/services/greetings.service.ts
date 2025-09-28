export class GreetingsService {
  constructor(private readonly customMessage: string) {}
  greet() {
    return this.customMessage;
  }
}
