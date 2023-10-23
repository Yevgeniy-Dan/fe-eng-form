import { Component, ViewChild, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormGroupDirective,
  NgForm,
} from '@angular/forms';
import { Validators } from '@angular/forms';

import { UserService } from 'src/app/services/user.service';

/** The component is responsible for adding fields to the form and sending the form to the server*/
@Component({
  selector: 'app-engineer-form',
  templateUrl: './engineer-form.component.html',
  styleUrls: ['./engineer-form.component.css'],
})
export class EngineerFormComponent {
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

  /**Getter for the 'hobbies' FormArray */
  get hobbies(): FormArray {
    return this.engineerForm.get('hobbies') as FormArray;
  }

  /**Add a new hobby  to the 'hobbies' */
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
    this.userService.addUser(this.engineerForm.value).subscribe({
      next: (): void => {
        // reset form to initial state
        this.formDirective?.resetForm();
        this.resetHobbiesToInitialState();
      },
      error: (err): void =>
        this.engineerForm.get('email')?.setErrors({ isExists: err.message }),
    });
  }

  /**Resets the 'hobbies' section of the form to its initial state */
  private resetHobbiesToInitialState(): void {
    this.engineerForm = this.fb.group({
      hobbies: this.fb.array([this.fb.control('', Validators.required)]),
    });
  }
}
