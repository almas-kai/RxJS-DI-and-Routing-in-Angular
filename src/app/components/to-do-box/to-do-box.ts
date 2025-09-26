import { ChangeDetectionStrategy, Component, input, InputSignal } from '@angular/core';
import { ToDo } from '../../types/todo.type';

@Component({
  selector: 'app-to-do-box',
  imports: [],
  templateUrl: './to-do-box.html',
  styleUrl: './to-do-box.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToDoBox {
  public toDoData: InputSignal<ToDo> = input.required<ToDo>();
}
