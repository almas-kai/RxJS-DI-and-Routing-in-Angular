import { ChangeDetectionStrategy, Component, inject} from '@angular/core';
import { ToDo } from '../../types/todo.type';
import { LoadingState } from '../../types/loading-state.type';
import { LoadingStateFactoryService } from '../../services/loading-state-factory.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ToDoBox } from '../to-do-box/to-do-box';
import { ToDosService } from '../../services/to-dos.service';
import { catchError, map, Observable, of, startWith, switchMap } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-random-todo.ts',
  imports: [ToDoBox, AsyncPipe],
  templateUrl: './random-todo.html',
  styleUrl: './random-todo.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RandomTodo {
  private readonly loadingStateFactoryService: LoadingStateFactoryService<ToDo> = inject(LoadingStateFactoryService);
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  public toDosService: ToDosService = inject(ToDosService);

  public loadingStateToDo: Observable<LoadingState<ToDo>> = this.activatedRoute.paramMap.pipe(
    map((params: ParamMap) => Number(params.get('id'))),
    switchMap((toDoId: number) => {
      if (!Number.isInteger(toDoId)) {
        return of(this.loadingStateFactoryService.idle());
      }
      else {
        return this.toDosService.getToDoById(toDoId).pipe(
          catchError((error) =>
            of(this.loadingStateFactoryService.failure(error))
          ),
          startWith(this.loadingStateFactoryService.loading())
        );
      }
    })
  );
}
