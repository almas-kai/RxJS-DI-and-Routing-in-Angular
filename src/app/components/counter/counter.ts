import { Component, ElementRef, signal, viewChild, WritableSignal, Signal, AfterViewInit, OnDestroy, inject } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { GreetingsService } from '../../services/greetings.service';

@Component({
  selector: 'app-counter',
  imports: [],
  templateUrl: './counter.html',
  styleUrl: './counter.css',
  providers: [
    {
      provide: GreetingsService,
      useFactory: () => {
        const hour = (new Date()).getHours();
        let message = 'From Counter Component: ';
        if (hour < 12) {
          message += 'Good Morning!';
        }
        else if (hour < 18) {
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
export class Counter implements AfterViewInit, OnDestroy {
  public counterValue: WritableSignal<number> = signal(0);
  private readonly incrementButtonRef: Signal<ElementRef<HTMLButtonElement>> = viewChild('incrementButton') as Signal<ElementRef<HTMLButtonElement>>;
  private readonly decrementButtonRef: Signal<ElementRef<HTMLButtonElement>> = viewChild('decrementButton') as Signal<ElementRef<HTMLButtonElement>>;

  private readonly subscriptions: Subscription[] = [];
  public readonly greetingsService: GreetingsService = inject(GreetingsService, { optional: false, skipSelf: true });
  public readonly greetingsService2: GreetingsService = inject(GreetingsService, { optional: false, self: true });

  ngAfterViewInit(): void {
    const increment$: Subscription = 
      fromEvent(
        this.incrementButtonRef().nativeElement, 'click'
      )
      .subscribe(
        () => this.counterValue.update((value: number) => value + 1)
      );

    const decrement$: Subscription = 
      fromEvent(
        this.decrementButtonRef().nativeElement, 'click'
      )
      .subscribe(
        () => this.counterValue.update((value: number) => value - 1)
      );

    this.subscriptions.push(increment$, decrement$);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
  }
}
