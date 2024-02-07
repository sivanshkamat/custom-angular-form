
const componentName = process.argv[2];
const camelCase = componentName.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
const pascalCase = camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
const upperSnakeCase = componentName.toUpperCase().replace(/-/g, '_');
const pascalCaseWithSpace = componentName.toLocaleUpperCase().replace(/-/g, ' ');

// Function to generate content for effects file
function generateEffectsContent(file) {
  console.log('\x1b[32m%s\x1b[0m', "CREATE ", file);
  switch (file) {
    case 'effects.ts':
      return `import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, mergeMap, of, tap } from 'rxjs';
import * as FormActions from '../${componentName}.actions';
import { ${pascalCase}ApiService } from '../../services/api/${componentName}-api.service';
import { ${pascalCase}FormService } from '../../services/form/${componentName}-form.service';

@Injectable()
export class ${pascalCase}Effects {

  add${pascalCase}$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FormActions.add${pascalCase}Form),
      mergeMap(({ formValue }) =>
        this.apiService.add${pascalCase}(formValue).pipe(
          map((response) =>
            FormActions.add${pascalCase}FormSuccess({
              status: response.data,
              message: response.message,
            })
          ),
          catchError((response) =>
            of(
              FormActions.add${pascalCase}FormFailure({
                status: false,
                error: response?.error?.message,
              })
            )
          )
        )
      )
    )
  );

  add${pascalCase}Success$ = createEffect(
    () => this.actions$.pipe(
      ofType(FormActions.add${pascalCase}FormSuccess),
      tap(({ message }): void => {
        this.formService.goBack();
        this.formService.success(message);
      })
    ),
    { dispatch: false, resubscribeOnError: false }
  );

  constructor(
    private readonly actions$: Actions,
    private readonly formService: ${pascalCase}FormService,
    private readonly apiService: ${pascalCase}ApiService
  ) { }
}
`;
    default:
      return `
import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import * as FormActions from '../${componentName}.actions';
import { ${pascalCase}ApiService } from '../../services/api/${componentName}-api.service';
import { ${pascalCase}FormService } from '../../services/form/${componentName}-form.service';
import { ${pascalCase}Effects } from './${componentName}-effects';
import { ResponseIdentity } from '@sharedModule/models';
import { 
  FAKE_SUCCESS_RESPONSE,
  FAKE_${upperSnakeCase}_FORM_DATA
 } from '../../fake-test-data/${componentName}-fake';
import { TestScheduler } from 'rxjs/testing';

describe('${pascalCase}Effects', () => {
  let actions$: Observable<any>;
  let effects: ${pascalCase}Effects;
  let apiServiceSpy: jasmine.SpyObj<${pascalCase}ApiService>;
  let formServiceSpy: jasmine.SpyObj<${pascalCase}FormService>;
  let scheduler: TestScheduler;

  beforeEach(() => {
    const apiSpy = jasmine.createSpyObj('${pascalCase}ApiService', ['add${pascalCase}']);
    const formSpy = jasmine.createSpyObj('${pascalCase}FormService', ['goBack', 'success']);

    TestBed.configureTestingModule({
      providers: [
        ${pascalCase}Effects,
        provideMockActions(() => actions$),
        provideMockStore(),
        { provide: ${pascalCase}ApiService, useValue: apiSpy },
        { provide: ${pascalCase}FormService, useValue: formSpy }
      ]
    });

    effects = TestBed.inject(${pascalCase}Effects);
    apiServiceSpy = TestBed.inject(${pascalCase}ApiService) as jasmine.SpyObj<${pascalCase}ApiService>;
    formServiceSpy = TestBed.inject(${pascalCase}FormService) as jasmine.SpyObj<${pascalCase}FormService>;
    scheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  describe('add${pascalCase}$', () => {
    it('should dispatch add${pascalCase}FormSuccess on successful API request', () => {
      scheduler.run(({ cold, hot, expectObservable }) => {
        const action = FormActions.add${pascalCase}Form({ formValue: FAKE_${upperSnakeCase}_FORM_DATA });
        const response: ResponseIdentity<boolean> = FAKE_SUCCESS_RESPONSE;
        const completion = FormActions.add${pascalCase}FormSuccess({
          status: response.data,
          message: response.message,
        });

        actions$ = hot('-a', { a: action });
        apiServiceSpy.add${pascalCase}.and.returnValue(cold('-b|', { b: response }));
        const expectedMarble = '--c';

        expectObservable(effects.add${pascalCase}$).toBe(expectedMarble, { c: completion });
      });
    });

    it('should dispatch add${pascalCase}FormFailure on failed API request', () => {
      scheduler.run(({ cold, hot, expectObservable }) => {
        const action = FormActions.add${pascalCase}Form({ formValue: FAKE_${upperSnakeCase}_FORM_DATA });
        const error = { error: { message: 'Test Error message' } };
        const completion = FormActions.add${pascalCase}FormFailure({
          status: false,
          error: error?.error?.message,
        });

        actions$ = hot('-a', { a: action });
        apiServiceSpy.add${pascalCase}.and.returnValue(cold('-#', {}, error));
        const expectedMarble = '--c';

        expectObservable(effects.add${pascalCase}$).toBe(expectedMarble, { c: completion });
      });
    });
  });
});
`;
  }
}

module.exports = {
  generateEffectsContent
}