import {
  AbstractControl,
  AsyncValidator,
  ValidationErrors,
} from '@angular/forms';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { UserService } from '../services/user.service';

@Injectable({ providedIn: 'root' })
/** service that implements an asynchronous email validator for a form control */
export class EmailValidator implements AsyncValidator {
  constructor(private userService: UserService) {}

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    // it checks if the email entered by a user already exists in the form by using the UserService.
    return this.userService.isEmailExist(control.value).pipe(
      map((result: boolean) => {
        return result ? { emailAlreadyExists: true } : null;
      })
    );
  }
}
