import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home-page',
  imports: [RouterLink],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePage {
  public getTokenForToDosPage(): void {
    sessionStorage.setItem('todos-token', '');
  }
  public getTokenForCounterPage(): void {
    sessionStorage.setItem('counter-token', '');
  }
}
