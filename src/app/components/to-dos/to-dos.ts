import { ChangeDetectionStrategy, Component, computed, EnvironmentInjector, inject, OnInit, runInInjectionContext, signal, Signal } from '@angular/core';
import { ToDosService } from '../../services/to-dos.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { ToDo } from '../../types/todo.type';
import { ToDoBox } from '../to-do-box/to-do-box';
import { UrlsProviderService } from '../../services/urls-provider.service';
import { ContextMenu } from '../context-menu/context-menu';
import { ContextMenuOption } from '../../types/context-menu-option.type';
import { LoadingState } from '../../types/loading-state.type';
import { LoadingStateFactoryService } from '../../services/loading-state-factory.service';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-to-dos',
  imports: [ToDoBox, ContextMenu, RouterOutlet],
  templateUrl: './to-dos.html',
  styleUrl: './to-dos.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToDosComponent implements OnInit {

  // For toSignal. Runs only in injection context.
  private readonly environmentInjector: EnvironmentInjector = inject(EnvironmentInjector);

  private readonly toDosService: ToDosService = inject(ToDosService);
  private readonly urlsProviderService: UrlsProviderService = inject(UrlsProviderService);
  private readonly loadingStateFactoryService: LoadingStateFactoryService<ToDo[]> = inject(LoadingStateFactoryService);
  public readonly apiFrom: string = this.urlsProviderService.rootDomain;

  private allToDos: Signal<LoadingState<ToDo[]>> = signal(this.loadingStateFactoryService.idle());
  public displayedToDos: Signal<LoadingState<ToDo[]>> = computed<LoadingState<ToDo[]>>(() => {
    return {
      isLoading: this.allToDos().isLoading,
      data: this.allToDos().data,
      error: this.allToDos().error
    };
  });
  
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

  ngOnInit(): void {
    runInInjectionContext(this.environmentInjector, () => {
      this.allToDos = toSignal(this.toDosService.getToDos(), { initialValue: this.loadingStateFactoryService.idle() });
    });
  }

  public showOnlyNonCompletedToDos(event: PointerEvent): void {
    this.displayedToDos = signal<LoadingState<ToDo[]>>(
      this.filterReceivedToDos((value: ToDo) => value.completed === false)
    );
  }

  public showOnlyCompletedToDos(event: PointerEvent): void {
    this.displayedToDos = signal<LoadingState<ToDo[]>>(
      this.filterReceivedToDos((value: ToDo) => value.completed === true)
    );
  }

  public showAllToDos(event: PointerEvent): void {
    this.displayedToDos = this.allToDos;
  }

  public showRandomUncompletedToDo(event: PointerEvent): void {
    const nonCompletedToDos: LoadingState<ToDo[]> = this.filterReceivedToDos((toDo: ToDo) => toDo.completed === false);
    
    const data: ToDo[] | null = nonCompletedToDos.data;
    const max: number = data === null ? 0 : data.length - 1;
    const randomIndex: number = Math.floor(Math.random() * (max + 1));

    const randomToDo: ToDo | null = data === null ? null : data[randomIndex];

    this.router.navigate(['random-to-do'], {
      relativeTo: this.activatedRoute,
      queryParams: {
        todo: encodeURIComponent(JSON.stringify(randomToDo))
      }
    });
  }

  public cancelRandomToDo(event: PointerEvent): void {
    if(this.router.isActive('/to-dos/random-to-do', {
      paths: 'exact',
      queryParams: 'ignored',
      fragment: 'ignored',
      matrixParams: 'ignored'
    })) {
      this.router.navigate(['/to-dos']);
    }
  }

  private filterReceivedToDos(predicate: (value: ToDo, index?: number, array?: ToDo[]) => boolean): LoadingState<ToDo[]> {
    return (
      {
        isLoading: this.allToDos().isLoading,
        data: this.allToDos().data?.filter(predicate) ?? null,
        error: this.allToDos().error
      }
    );
  }
}
