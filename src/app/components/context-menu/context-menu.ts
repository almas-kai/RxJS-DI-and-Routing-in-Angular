import { ChangeDetectionStrategy, Component, ElementRef, inject, input, InputSignal, OnInit, Signal, viewChild } from '@angular/core';
import { TwoDimensionalCoordinate } from '../../types/two-dimensional-coordinate.type';
import { ContextMenuOption } from '../../types/context-menu-option.type';

@Component({
  selector: 'app-context-menu',
  imports: [],
  templateUrl: './context-menu.html',
  styleUrl: './context-menu.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContextMenu implements OnInit {
  public options: InputSignal<ContextMenuOption[]> = input.required();
  private readonly menuCoord: TwoDimensionalCoordinate = { x: 0, y: 0 };
  public isMenuOpen: boolean = false;
  public contextMenuStyles: { [key: string]: string } = {};

  // This is rem, not px. It will become px after ngOnInit.
  private margin: number = 0.5;

  private readonly hostElementRef: ElementRef<HTMLElement> = inject(ElementRef<HTMLElement>);
  private readonly contextMenuRef: Signal<ElementRef<HTMLElement>> = viewChild<ElementRef>('contextMenu') as Signal<ElementRef<HTMLElement>>;
  
  ngOnInit(): void {
    // Convert margin to rem.
    this.margin = parseInt(getComputedStyle(document.documentElement).fontSize) * this.margin;
  }

  private computePositioningStyles(): { [key: string]: string } {
    if(Number.isInteger(this.margin) === false) {
      throw new Error('The margin is not an integer.');
    }

    let x: number = this.menuCoord.x;
    let y: number = this.menuCoord.y;

    const hostElementRect: DOMRect = this.hostElementRef.nativeElement.getBoundingClientRect();
    const contextMenuRect: DOMRect = this.contextMenuRef().nativeElement.getBoundingClientRect();

    const leftConstraint: number = hostElementRect.left + this.margin;
    if(x < leftConstraint) {
      x = leftConstraint;
    }

    const rightConstraint: number = hostElementRect.width - this.margin;
    if(x + contextMenuRect.width > rightConstraint) {
      x = rightConstraint - contextMenuRect.width;
    }

    const topConstraint: number = hostElementRect.top + this.margin;
    if(y < topConstraint) {
      y = topConstraint;
    } else if(y < this.margin && topConstraint < 0) {
      y = this.margin;
    }

    const bottomConstraint: number = hostElementRect.bottom - this.margin - contextMenuRect.height;
    if(y > bottomConstraint) {
      y = bottomConstraint;
    }

    return {
      left: `${x}px`,
      top: `${y}px`
    };
  }

  public onContextMenu(event: PointerEvent): void {
    event.preventDefault();
    if(this.isMenuOpen === false) {
      this.menuCoord.x = event.clientX;
      this.menuCoord.y = event.clientY;
      this.isMenuOpen = true;
      this.contextMenuStyles = {
        ...this.contextMenuStyles,
        ...this.computePositioningStyles()
      };
    }
    else {
      this.isMenuOpen = false;
    }
  }
}
