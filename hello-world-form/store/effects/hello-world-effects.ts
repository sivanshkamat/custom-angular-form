import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, mergeMap, of, tap } from 'rxjs';
import * as FormActions from '../hello-world.actions';
import { HelloWorldApiService } from '../../services/api/hello-world-api.service';
import { HelloWorldFormService } from '../../services/form/hello-world-form.service';

@Injectable()
export class HelloWorldEffects {

  addHelloWorld$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FormActions.addHelloWorldForm),
      mergeMap(({ formValue }) =>
        this.apiService.addHelloWorld(formValue).pipe(
          map((response) =>
            FormActions.addHelloWorldFormSuccess({
              status: response.data,
              message: response.message,
            })
          ),
          catchError((response) =>
            of(
              FormActions.addHelloWorldFormFailure({
                status: false,
                error: response?.error?.message,
              })
            )
          )
        )
      )
    )
  );

  addHelloWorldSuccess$ = createEffect(
    () => this.actions$.pipe(
      ofType(FormActions.addHelloWorldFormSuccess),
      tap(({ message }): void => {
        this.formService.goBack();
        this.formService.success(message);
      })
    ),
    { dispatch: false, resubscribeOnError: false }
  );

  constructor(
    private readonly actions$: Actions,
    private readonly formService: HelloWorldFormService,
    private readonly apiService: HelloWorldApiService
  ) { }
}
