import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ToDosService } from '../../services/to-dos.service';
import { ToDo } from '../../types/todo.type';
import { ToDoBox } from '../to-do-box/to-do-box';
import { UrlsProviderService } from '../../services/urls-provider.service';
import { ContextMenu } from '../context-menu/context-menu';
import { ContextMenuOption } from '../../types/context-menu-option.type';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { filter, map, Observable, shareReplay, take } from 'rxjs';
import { LoadingState } from '../../types/loading-state.type';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-to-dos',
  imports: [ToDoBox, ContextMenu, RouterOutlet, AsyncPipe],
  templateUrl: './to-dos.html',
  styleUrl: './to-dos.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToDosComponent {

  private readonly toDosService: ToDosService = inject(ToDosService);
  private readonly urlsProviderService: UrlsProviderService = inject(UrlsProviderService);
  public readonly apiFrom: string = this.urlsProviderService.rootDomain;

  private readonly allToDos: Observable<LoadingState<ToDo[]>> = this.toDosService.getToDos().pipe(shareReplay(1));
  public displayedToDos: Observable<LoadingState<ToDo[]>> = this.allToDos;
  
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);

  public contextMenuOptions: ContextMenuOption[] = [
    {
      title: 'Show only non-completed to-dos.',
      onClick: (event: PointerEvent) => this.showOnlyNonCompletedToDos(event)
    },
    {
      title: 'Show only completed to-dos.',
      onClick: (event: PointerEvent) => this.showOnlyCompletedToDos(event)
    },
    {
      title: 'Show all to-dos.',
      onClick: (event: PointerEvent) => this.showAllToDos(event)
    },
    {
      title: 'Show random to-do to finish.',
      onClick: (event: PointerEvent) => this.showRandomUncompletedToDo(event)
    },
    {
      title: 'Remove random to-do.',
      onClick: (event: PointerEvent) => this.cancelRandomToDo(event)
    }
  ];

  public showOnlyNonCompletedToDos(event: PointerEvent): void {
    this.displayedToDos = this.filterReceivedToDos((value: ToDo) => value.completed === false);
  }

  public showOnlyCompletedToDos(event: PointerEvent): void {
    this.displayedToDos = this.filterReceivedToDos((value: ToDo) => value.completed === true);
  }

  public showAllToDos(event: PointerEvent): void {
    this.displayedToDos = this.allToDos;
  }

  public showRandomUncompletedToDo(event: PointerEvent): void {
    this.filterReceivedToDos((toDo: ToDo) => toDo.completed === false)
      .pipe(
        filter((state: LoadingState<ToDo[]>) => state.data !== null),
        take(1)
      )
      .subscribe((value: LoadingState<ToDo[]>) => {
        const data: ToDo[] = value.data ?? [];
        if(data.length === 0) {
          return;
        }

        const randomIndex: number = Math.floor(Math.random() * data.length);
        const toDoId: number = data[randomIndex].id;

        this.router.navigate(['random-to-do', toDoId], {
          relativeTo: this.activatedRoute
        });
      })
  }

  public cancelRandomToDo(event: PointerEvent): void {
    if (this.router.url.startsWith('/to-dos/random-to-do/')) {
      this.router.navigate(['/to-dos']);
    }
  }


  private filterReceivedToDos(predicate: (value: ToDo, index?: number, array?: ToDo[]) => boolean): Observable<LoadingState<ToDo[]>> {
    return this.allToDos.pipe(
      map((value: LoadingState<ToDo[]>) => {
        return {
          isLoading: value.isLoading,
          data: value.data?.filter(predicate) ?? null,
          error: value.error
        };
      })
    );
  }
}
