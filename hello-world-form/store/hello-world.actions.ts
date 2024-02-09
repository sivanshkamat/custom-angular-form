import { createAction, props } from '@ngrx/store';
import { HelloWorldForm } from '../models/hello-world-form.model';

export const addHelloWorldForm = createAction(
  '[HELLO WORLD Form] Submit Form',
  props<{ formValue: HelloWorldForm }>()
);

export const addHelloWorldFormSuccess = createAction(
  '[HELLO WORLD Form] Form Submit Success',
  props<{ status: boolean; message: string }>()
);

export const addHelloWorldFormFailure = createAction(
  '[HELLO WORLD Form] Form Submit Failure',
  props<{ status: boolean; error: string }>()
);

export const resetHelloWorldForm = createAction('[HELLO WORLD Form] Reset Form');

export type HelloWorldFormActions =
  | ReturnType<typeof addHelloWorldForm>
  | ReturnType<typeof addHelloWorldFormSuccess>
  | ReturnType<typeof addHelloWorldFormFailure>
  | ReturnType<typeof resetHelloWorldForm>;
