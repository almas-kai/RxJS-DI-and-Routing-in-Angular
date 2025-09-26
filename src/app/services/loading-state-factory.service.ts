import { Injectable } from '@angular/core';
import { LoadingState } from '../types/loading-state.type';

@Injectable({
  providedIn: 'root'
})
export class LoadingStateFactoryService<T> {
  public loading(): LoadingState<T> {
    return {
      isLoading: true,
      error: null,
      data: null
    };
  }

  public success(loadedData: T): LoadingState<T> {
    return {
      isLoading: false,
      error: null,
      data: loadedData
    };
  }

  public failure(error: Error): LoadingState<T> {
    return {
      isLoading: false,
      error: error,
      data: null
    };
  }

  public idle(): LoadingState<T> {
    return {
      isLoading: false,
      error: null,
      data: null
    };
  }
}
