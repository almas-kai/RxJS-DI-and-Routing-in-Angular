import { ChangeDetectionStrategy, Component, EnvironmentInjector, inject, OnInit, runInInjectionContext, signal, Signal, WritableSignal } from '@angular/core';
import { ToDo } from '../../types/todo.type';
import { LoadingState } from '../../types/loading-state.type';
import { LoadingStateFactoryService } from '../../services/loading-state-factory.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ToDoBox } from '../to-do-box/to-do-box';
import { ToDosService } from '../../services/to-dos.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { first } from 'rxjs';

@Component({
  selector: 'app-random-todo.ts',
  imports: [ToDoBox],
  templateUrl: './random-todo.html',
  styleUrl: './random-todo.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RandomTodo implements OnInit {
  private readonly loadingStateFactoryService: LoadingStateFactoryService<ToDo> = inject(LoadingStateFactoryService);
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  public loadingStateToDo: WritableSignal<LoadingState<ToDo>> = signal<LoadingState<ToDo>>(this.loadingStateFactoryService.loading());
  public toDosService: ToDosService = inject(ToDosService);
  
  public ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
      const toDoId: number = Number(params.get('id'));

      if(Number.isInteger(toDoId) === false) {
        this.loadingStateToDo.set(this.loadingStateFactoryService.idle());
      }
      else {
        this.toDosService.getToDoById(toDoId).subscribe((value: LoadingState<ToDo>) => {
          this.loadingStateToDo.set(value);
        });
      }
    });
  }
}
