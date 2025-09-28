import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GreetingsService } from './services/greetings.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
  providers: [
    {
      provide: GreetingsService,
      useFactory: () => {
        const hour = (new Date()).getHours();
        let message = 'From App Component: ';
        if(hour < 12) {
          message += 'Good Morning!';
        }
        else if(hour < 18) {
          message += 'Good Afternoon!';
        }
        else {
          message += 'Good Evening!';
        }
        return new GreetingsService(message);
      }
    }
  ]
})
export class App {
  public readonly greetingsService: GreetingsService = inject(GreetingsService, { self: true });
}
