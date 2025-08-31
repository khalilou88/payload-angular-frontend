import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { PayloadApiService } from '../services/payload-api.service';

export const authGuard: CanActivateFn = (route, state) => {
  const payloadApi = inject(PayloadApiService);
  const router = inject(Router);

  if (payloadApi.isAuthenticated()) {
    return true;
  }

  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};
