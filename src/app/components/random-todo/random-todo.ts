import { ChangeDetectionStrategy, Component, inject, OnInit, Signal, signal } from '@angular/core';
import { ToDo } from '../../types/todo.type';
import { LoadingState } from '../../types/loading-state.type';
import { LoadingStateFactoryService } from '../../services/loading-state-factory.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ToDoBox } from '../to-do-box/to-do-box';

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
  public loadingStateToDo: Signal<LoadingState<ToDo>> = signal<LoadingState<ToDo>>(this.loadingStateFactoryService.loading());
  
  public ngOnInit(): void {
    this.activatedRoute.queryParamMap.subscribe((params: ParamMap) => {
      const raw: string | null = params.get('todo');
      const loadingStateToDo: LoadingState<ToDo> = this.loadingStateFactoryService.idle();
      loadingStateToDo.data = raw === null ? null : JSON.parse(decodeURIComponent(raw));
      this.loadingStateToDo = signal(loadingStateToDo);
    });
  }
}
