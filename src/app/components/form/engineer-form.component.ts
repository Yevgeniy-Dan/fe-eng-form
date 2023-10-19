import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-engineer-form',
  templateUrl: './engineer-form.component.html',
  styleUrls: ['./engineer-form.component.css'],
})
export class EngineerFormComponent {
  technologies: string[] = ['angular', 'react', 'vue'];
  techVersions: { [key: string]: string[] } = {
    angular: ['1.1.1', '1.2.1', '1.3.3'],
    react: ['2.1.2', '3.2.4', '4.3.1'],
    vue: ['3.3.1', '5.2.1', '5.1.3'],
  };

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

  constructor(private fb: FormBuilder) {}

  get hobbies() {
    return this.engineerForm.get('hobbies') as FormArray;
  }

  addHobbie() {
    this.hobbies.push(this.fb.control(''));
  }

  enableVersions() {
    this.engineerForm.get('techVersion')?.enable();
  }

  onSubmit() {
    console.log(this.engineerForm.value);
  }
}
