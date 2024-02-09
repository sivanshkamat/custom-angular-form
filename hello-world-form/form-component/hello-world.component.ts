import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { HELLO_WORLD_FORM_CONSTANTS } from '../constants/hello-world-constants';
import { HelloWorldFormService } from '../services/form/hello-world-form.service';
import * as formActions from '../store/hello-world.actions';

@Component({
  selector: 'app-hello-world-form',
  templateUrl: './hello-world.component.html',
  styleUrls: ['./hello-world.component.scss'],
})
export class HelloWorldFormComponent implements OnInit, OnDestroy {
  constants = HELLO_WORLD_FORM_CONSTANTS;

  constructor(
    private readonly store: Store,
    private formService: HelloWorldFormService,
  ) {}

  get helloWorldForm(): FormGroup {
    return this.formService.formGroup;
  }

  ngOnInit(): void {
    this.formService.buildForm();
  }

  ngOnDestroy(): void {
    this.formService.resetForm();
    this.store.dispatch(formActions.resetHelloWorldForm());
  }

  submitForm(): void {
    this.helloWorldForm?.markAllAsTouched();
    if (this.helloWorldForm?.valid) {
      const value = this.formService.helloWorldFormValue;
      this.store.dispatch(formActions.addHelloWorldForm({ formValue: value }));
    }
  }

  cancel(): void {
    this.formService.goBack();
  }
}
  