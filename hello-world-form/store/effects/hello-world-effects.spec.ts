
import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import * as FormActions from '../hello-world.actions';
import { HelloWorldApiService } from '../../services/api/hello-world-api.service';
import { HelloWorldFormService } from '../../services/form/hello-world-form.service';
import { HelloWorldEffects } from './hello-world-effects';
import { ResponseIdentity } from '@sharedModule/models';
import { 
  FAKE_SUCCESS_RESPONSE,
  FAKE_HELLO_WORLD_FORM_DATA
 } from '../../fake-test-data/hello-world-fake';
import { TestScheduler } from 'rxjs/testing';

describe('HelloWorldEffects', () => {
  let actions$: Observable<any>;
  let effects: HelloWorldEffects;
  let apiServiceSpy: jasmine.SpyObj<HelloWorldApiService>;
  let formServiceSpy: jasmine.SpyObj<HelloWorldFormService>;
  let scheduler: TestScheduler;

  beforeEach(() => {
    const apiSpy = jasmine.createSpyObj('HelloWorldApiService', ['addHelloWorld']);
    const formSpy = jasmine.createSpyObj('HelloWorldFormService', ['goBack', 'success']);

    TestBed.configureTestingModule({
      providers: [
        HelloWorldEffects,
        provideMockActions(() => actions$),
        provideMockStore(),
        { provide: HelloWorldApiService, useValue: apiSpy },
        { provide: HelloWorldFormService, useValue: formSpy }
      ]
    });

    effects = TestBed.inject(HelloWorldEffects);
    apiServiceSpy = TestBed.inject(HelloWorldApiService) as jasmine.SpyObj<HelloWorldApiService>;
    formServiceSpy = TestBed.inject(HelloWorldFormService) as jasmine.SpyObj<HelloWorldFormService>;
    scheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  describe('addHelloWorld$', () => {
    it('should dispatch addHelloWorldFormSuccess on successful API request', () => {
      scheduler.run(({ cold, hot, expectObservable }) => {
        const action = FormActions.addHelloWorldForm({ formValue: FAKE_HELLO_WORLD_FORM_DATA });
        const response: ResponseIdentity<boolean> = FAKE_SUCCESS_RESPONSE;
        const completion = FormActions.addHelloWorldFormSuccess({
          status: response.data,
          message: response.message,
        });

        actions$ = hot('-a', { a: action });
        apiServiceSpy.addHelloWorld.and.returnValue(cold('-b|', { b: response }));
        const expectedMarble = '--c';

        expectObservable(effects.addHelloWorld$).toBe(expectedMarble, { c: completion });
      });
    });

    it('should dispatch addHelloWorldFormFailure on failed API request', () => {
      scheduler.run(({ cold, hot, expectObservable }) => {
        const action = FormActions.addHelloWorldForm({ formValue: FAKE_HELLO_WORLD_FORM_DATA });
        const error = { error: { message: 'Test Error message' } };
        const completion = FormActions.addHelloWorldFormFailure({
          status: false,
          error: error?.error?.message,
        });

        actions$ = hot('-a', { a: action });
        apiServiceSpy.addHelloWorld.and.returnValue(cold('-#', {}, error));
        const expectedMarble = '--c';

        expectObservable(effects.addHelloWorld$).toBe(expectedMarble, { c: completion });
      });
    });
  });
});
