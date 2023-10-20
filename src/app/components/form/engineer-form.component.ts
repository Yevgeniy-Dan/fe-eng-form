import { Component, OnInit } from '@angular/core';
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
  public technologies: string[] = ['angular', 'react', 'vue'];
  public techVersions: { [key: string]: string[] } = {
    angular: ['1.1.1', '1.2.1', '1.3.3'],
    react: ['2.1.2', '3.2.4', '4.3.1'],
    vue: ['3.3.1', '5.2.1', '5.1.3'],
  };

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

  get hobbies() {
    return this.engineerForm.get('hobbies') as FormArray;
  }

  public addHobbie() {
    this.hobbies.push(this.fb.control(''));
  }

  public enableVersions() {
    this.engineerForm.get('techVersion')?.enable();
  }

  public addUser() {
    this.userService.addUser(this.engineerForm.value).subscribe({
      error(err) {
        console.log('Error adding user: ', err);
      },
      complete() {
        console.log('User added successfully');
      },
    });
  }
}
