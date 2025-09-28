import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot } from '@angular/router';

export const authenticationGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const tokenKey: string = route.data['tokenKey'] as string;
  const token: string | null = sessionStorage.getItem(tokenKey);
  if(token !== null) {  
    return true;
  }
  else {
    return false;
  }
};
