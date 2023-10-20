/**The interceptor is triggered when a form post request
 * is submitted and checks whether there is a user
 * with the same email in the database */

import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { UserService } from '../services/user.service';

@Injectable()
export class EmailExistsInterceptor implements HttpInterceptor {
  constructor(private userService: UserService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (request.method === 'POST' && request.url === this.userService.apiUrl) {
      const user = request.body;
      // Accessing the email verification function in the user service
      return this.userService.isEmailExists(user.email).pipe(
        switchMap((exists) => {
          if (exists) {
            throw new Error('User with the same email already exists.');
          } else {
            return next.handle(request);
          }
        })
      );
    }
    return next.handle(request);
  }
}
