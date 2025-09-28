import { Component, ElementRef, signal, viewChild, WritableSignal, Signal, AfterViewInit, OnDestroy } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';

@Component({
  selector: 'app-counter',
  imports: [],
  templateUrl: './counter.html',
  styleUrl: './counter.css'
})
export class Counter implements AfterViewInit, OnDestroy {
  public counterValue: WritableSignal<number> = signal(0);
  private readonly incrementButtonRef: Signal<ElementRef<HTMLButtonElement>> = viewChild('incrementButton') as Signal<ElementRef<HTMLButtonElement>>;
  private readonly decrementButtonRef: Signal<ElementRef<HTMLButtonElement>> = viewChild('decrementButton') as Signal<ElementRef<HTMLButtonElement>>;

  private readonly subscriptions: Subscription[] = [];

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
