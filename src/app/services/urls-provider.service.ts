import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UrlsProviderService {
  public readonly rootDomain: string = 'https://dummyjson.com/';
  public readonly toDosSubDomain: string = 'todos/';
  public readonly limitlessParam: string = '?limit=0';
  public readonly randomSubDomain: string = 'random/';
}
