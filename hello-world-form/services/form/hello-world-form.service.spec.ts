import { TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MaterialModule } from 'src/app/material/material.module';
import { MessageHandlerService } from '@core/services/message-handler/message-handler.service';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { HttpClientService } from '@core/services/http-client/http-client.service';
import { HelloWorldFormService } from './hello-world-form.service';
import * as formActions from '../../store/hello-world.actions';

describe('HelloWorldFormService', () => {
  let formService: HelloWorldFormService;
  let store: Store;
  let messageHandlerService: MessageHandlerService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore(),
        FormBuilder,
        Store,
        HttpClientService
      ],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        MaterialModule,
        ReactiveFormsModule
      ]
    });
    router = TestBed.inject(Router);
    formService = TestBed.inject(HelloWorldFormService);
    store = TestBed.inject(Store);
    messageHandlerService = TestBed.inject(MessageHandlerService);
    spyOn(messageHandlerService, 'show');
    formService.buildForm();

  });

  it('should create the form group and initialize it correctly', () => {
    formService.buildForm();

    expect(formService.formGroup).toBeDefined();
    expect(formService.formGroup instanceof FormGroup).toBe(true);
  });

  it('should reset the form and dispatch reset action', () => {
    const dispatchSpy = spyOn(store, 'dispatch');

    formService.buildForm();
    formService.resetForm();

    expect(dispatchSpy).toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalledWith(formActions.resetHelloWorldForm());
  });
  
  it('should navigate back and reset form when goBack() is called for non-edit route', () => {
    spyOn(router, 'navigate');
    spyOnProperty(router, 'url').and.returnValue('/non-edit-route');

    formService.goBack();

    expect(router.navigate).toHaveBeenCalled();
  });

  it('should display success message when success() is called', () => {
    const successMessage = 'Test success message';
    formService.success(successMessage);

    expect(messageHandlerService.show).toHaveBeenCalledWith(successMessage, 'dismiss');
  });
});
