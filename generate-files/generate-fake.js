const componentName = process.argv[2];

const camelCase = componentName.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
const pascalCase = camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
const upperSnakeCase = componentName.toUpperCase().replace(/-/g, '_');
const pascalCaseWithSpace = componentName.toLocaleUpperCase().replace(/-/g, ' ');

// Function to generate content for api services files
function generateFakeDataContent(file) {
  console.log('\x1b[32m%s\x1b[0m', "CREATE ", file)

return `import { make } from '@sharedModule/test-suite/test.utils';
import { ResponseIdentity } from '@sharedModule/models';
import { ${pascalCase}Form } from '../models/${componentName}-form.model';

export const FAKE_${upperSnakeCase}_FORM_DATA = make<${pascalCase}Form>({

});

export const FAKE_SUCCESS_RESPONSE = make<ResponseIdentity<boolean>>({
  status: 1,
  message: 'success',
  data: true
});
`
}


module.exports = {
  generateFakeDataContent
}