import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { UrlsProviderService } from './urls-provider.service';
import { catchError, map, Observable, of, startWith } from 'rxjs';
import { ToDo } from '../types/todo.type';
import { LoadingState } from '../types/loading-state.type';
import { LoadingStateFactoryService } from './loading-state-factory.service';

@Injectable()
export class ToDosService {
  private readonly httpClient: HttpClient = inject(HttpClient);
  private readonly urlsProvider: UrlsProviderService = inject(UrlsProviderService);
  private readonly toDoCollectionLoadingStateFactoryService: LoadingStateFactoryService<ToDo[]> = inject(LoadingStateFactoryService);
  private readonly toDoLoadingStateFactoryService: LoadingStateFactoryService<ToDo> = inject(LoadingStateFactoryService);

  private readonly toDosUrl: string = this.urlsProvider.rootDomain + this.urlsProvider.toDosSubDomain;
  private readonly limitlessToDosUrl: string = this.toDosUrl + this.urlsProvider.limitlessParam;

  
  public getToDos(): Observable<LoadingState<ToDo[]>> {
    return this.httpClient.get<{ todos: ToDo[]}>(this.limitlessToDosUrl).pipe(
      map((response) => this.toDoCollectionLoadingStateFactoryService.success(response.todos)),
      catchError((error: unknown) => {
        return of(
          this.toDoCollectionLoadingStateFactoryService.failure(error instanceof Error ? error : new Error(String(error)))
        );
      }),
      startWith(this.toDoCollectionLoadingStateFactoryService.loading())
    );
  }

  public getToDoById(id: number): Observable<LoadingState<ToDo>> {
    return this.httpClient.get<ToDo>(this.toDosUrl + id).pipe(
      map((response) => this.toDoLoadingStateFactoryService.success(response)),
      catchError((error: unknown) => {
        return of(
          this.toDoLoadingStateFactoryService.failure(error instanceof Error ? error : new Error(String(error)))
        );
      }),
      startWith(this.toDoLoadingStateFactoryService.loading())
    );
  }
}
