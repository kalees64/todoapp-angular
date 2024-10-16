import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authToken = 'p37iWUcP3vHLlqQaoBArAhDtH-7XLzhi';
  const authReq = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${authToken}`),
  });

  return next(authReq);
};
