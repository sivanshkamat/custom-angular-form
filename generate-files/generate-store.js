const componentName = process.argv[2];

const camelCase = componentName.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
const pascalCase = camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
const upperSnakeCase = componentName.toUpperCase().replace(/-/g, '_');
const pascalCaseWithSpace = componentName.toLocaleUpperCase().replace(/-/g, ' ');



// Function to generate content for store files
function generateStoreContent(file) {
  console.log('\x1b[32m%s\x1b[0m', "CREATE ", file)

  switch (file) {
    case 'actions.ts':
      return `import { createAction, props } from '@ngrx/store';
import { ${pascalCase}Form } from '../models/${componentName}-form.model';

export const add${pascalCase}Form = createAction(
  '[${pascalCaseWithSpace} Form] Submit Form',
  props<{ formValue: ${pascalCase}Form }>()
);

export const add${pascalCase}FormSuccess = createAction(
  '[${pascalCaseWithSpace} Form] Form Submit Success',
  props<{ status: boolean; message: string }>()
);

export const add${pascalCase}FormFailure = createAction(
  '[${pascalCaseWithSpace} Form] Form Submit Failure',
  props<{ status: boolean; error: string }>()
);

export const reset${pascalCase}Form = createAction('[${pascalCaseWithSpace} Form] Reset Form');

export type ${pascalCase}FormActions =
  | ReturnType<typeof add${pascalCase}Form>
  | ReturnType<typeof add${pascalCase}FormSuccess>
  | ReturnType<typeof add${pascalCase}FormFailure>
  | ReturnType<typeof reset${pascalCase}Form>;
`;
    default:
      return '';
  }
}


module.exports = {
  generateStoreContent
}