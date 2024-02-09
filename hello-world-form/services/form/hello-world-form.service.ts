import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { MessageHandlerService } from '@core/services/message-handler/message-handler.service';
import { HELLO_WORLD_FORM_KEY_CONFIG } from '../../key-config/hello-world-key-config';
import * as formActions from '../../store/hello-world.actions';
import { HelloWorldForm } from '../../models/hello-world-form.model';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root',
})
export class HelloWorldFormService {
  #formGroup!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private messageHandlerService: MessageHandlerService,
    private router: Router
  ) {}

  get formGroup(): FormGroup {
    return this.#formGroup;
  }

  get helloWorldFormValue(): HelloWorldForm {
    const formValue = this.formGroup?.value as HelloWorldForm;
    return formValue;
  }

  buildForm(): void {
    this.#formGroup = this.fb.group(HELLO_WORLD_FORM_KEY_CONFIG);
  }

  resetForm(): void {
    this.#formGroup.reset();
    this.store.dispatch(formActions.resetHelloWorldForm());
  }

  success(message: string): void {
    this.messageHandlerService.show(message, 'dismiss');
  }

  goBack(): void {
    const url = this.router.url;
    const router = url.split('/');
    router.pop();
    this.router.navigate([router.join('/')]);
  }
}
