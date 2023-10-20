import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { User } from 'src/app/User';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-engineer-form',
  templateUrl: './engineer-form.component.html',
  styleUrls: ['./engineer-form.component.css'],
})
export class EngineerFormComponent {
  /** Array of technology choices */
  public technologies: string[] = ['angular', 'react', 'vue'];

  /**Versions for each technology */
  public techVersions: { [key: string]: string[] } = {
    angular: ['1.1.1', '1.2.1', '1.3.3'],
    react: ['2.1.2', '3.2.4', '4.3.1'],
    vue: ['3.3.1', '5.2.1', '5.1.3'],
  };

  /**The main form for an frontend engineer */
  public engineerForm: FormGroup = this.fb.group({
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
  get hobbies() {
    return this.engineerForm.get('hobbies') as FormArray;
  }

  /**Add a new hobby  to the 'hobbies' */
  public addHobbie() {
    this.hobbies.push(this.fb.control('', Validators.required));
  }

  /**Remove a hobby at a specific index */
  public removeHobbie(id: number) {
    this.hobbies.removeAt(id);
  }

  /**Enable the 'techVersion' input */
  public enableVersions() {
    this.engineerForm.get('techVersion')?.enable();
  }

  /**Add a user by sending the form data to the json-server API */
  public addUser() {
    this.userService.addUser(this.engineerForm.value).subscribe({
      next: this.handleSuccess.bind(this),
      error: this.handleError.bind(this),
    });
  }

  /**Handle errors method during user addition */
  private handleError(error: any) {
    this.engineerForm.get('email')?.setErrors({ isExists: error.message });
    console.log(this.engineerForm.errors);
  }

  /**Handle successful user addition */
  private handleSuccess(user: User) {
    this.fullReset();
  }

  /**Reset the form and clear errors after resetting
   * to avoid displaying errors in the UI
   */
  private fullReset() {
    this.engineerForm.reset();
    this.clearErrors(this.engineerForm);
    this.clearErrors(this.hobbies);
  }

  /**Clear errors in a form group or form array */
  private clearErrors(formGroup: FormGroup | FormArray) {
    if (formGroup instanceof FormGroup) {
      // For each control within the FormGroup,
      // this loop iterates through all controls
      // and sets any validation errors to null,
      // clearing any existing errors.
      Object.values(formGroup.controls).forEach((control) => {
        control.setErrors(null);
      });
    } else if (formGroup instanceof FormArray) {
      // removes errors for each hobby value
      formGroup.controls.forEach((control) => {
        control.setErrors(null);
      });
    }

    this.removedAllHobbies();
  }

  /**Remove all hobbies field except the first one */
  private removedAllHobbies() {
    while (this.hobbies.length > 1) {
      this.hobbies.removeAt(1);
    }
  }
}
