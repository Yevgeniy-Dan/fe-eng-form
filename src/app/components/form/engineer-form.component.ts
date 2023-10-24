import { Component, ViewChild, OnDestroy } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormGroupDirective,
} from '@angular/forms';
import { Validators } from '@angular/forms';
import { Observable, Subject, of, switchMap, takeUntil } from 'rxjs';

import { UserService } from 'src/app/services/user.service';

/** The component is responsible for adding fields to the form and sending the form to the server*/
@Component({
  selector: 'app-engineer-form',
  templateUrl: './engineer-form.component.html',
  styleUrls: ['./engineer-form.component.css'],
})
export class EngineerFormComponent implements OnDestroy {
  /**used for unsubscribing from observables */
  private formUnsubscribe$: Subject<void> = new Subject<void>();
  /** reference to the form container html element */
  @ViewChild('myForm', { static: false }) formDirective?: FormGroupDirective;
  /** Array of technology choices */
  technologies: string[] = ['angular', 'react', 'vue'];

  /**Versions for each technology */
  techVersions: { [key: string]: string[] } = {
    angular: ['1.1.1', '1.2.1', '1.3.3'],
    react: ['2.1.2', '3.2.4', '4.3.1'],
    vue: ['3.3.1', '5.2.1', '5.1.3'],
  };

  /**The main form for an frontend engineer.
   * Using the form builder service to create form control and form group instances.
   */
  engineerForm: FormGroup = this.fb.group({
    name: [
      '',
      [Validators.required, Validators.minLength(3), Validators.maxLength(30)],
    ],
    lastname: ['', Validators.required],
    birthDate: ['', Validators.required],
    technology: ['', Validators.required],
    techVersion: [{ value: '', disabled: true }, Validators.required],
    email: ['', [Validators.required, Validators.email]],
    hobbies: this.fb.array([this.fb.control('', Validators.required)]),
  });

  constructor(private fb: FormBuilder, private userService: UserService) {}

  ngOnDestroy(): void {
    this.formUnsubscribe$.next();
    this.formUnsubscribe$.complete();
  }

  /**Getter used for the 'hobbies' items */
  get hobbies(): FormArray {
    return this.engineerForm.get('hobbies') as FormArray;
  }

  /**The method adds a new hobby to the hobby array */
  addHobbie(): void {
    this.hobbies.push(this.fb.control('', Validators.required));
  }

  /**Remove a hobby at a specific index
   *
   * @param id used to removing hobby from the form
   */
  removeHobbie(id: number): void {
    this.hobbies.removeAt(id);
  }

  /**Enable the 'techVersion' input after technology choice */
  enableVersions(): void {
    this.engineerForm.get('techVersion')?.enable();
  }

  /**Add a user by sending the form data to the json-server API */
  addUser(): void {
    const email = this.engineerForm.get('email')?.value;
    const result = this.isEmailExist(email).pipe(
      switchMap((isExists: boolean) => {
        if (isExists) {
          this.engineerForm.get('email')?.setErrors({
            isExists: 'User with the same email already exists.',
          });
          return of(null);
        } else {
          return this.userService.addUser(this.engineerForm.value);
        }
      }),
      takeUntil(this.formUnsubscribe$)
    );
    result.subscribe(() => {
      // reset form to initial state
      this.formDirective?.resetForm();
      this.resetHobbiesToInitialState();
    });
  }

  /**Resets the 'hobbies' section of the form to its initial state */
  private resetHobbiesToInitialState(): void {
    this.engineerForm = this.fb.group({
      hobbies: this.fb.array([this.fb.control('', Validators.required)]),
    });
  }

  private isEmailExist(email: string): Observable<boolean> {
    const isExists = email === 'test@test.test';

    return of(isExists);
  }
}
