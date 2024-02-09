const componentName = process.argv[2];

const camelCase = componentName.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
const pascalCase = camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
const upperSnakeCase = componentName.toUpperCase().replace(/-/g, '_');
const pascalCaseWithSpace = componentName.toLocaleUpperCase().replace(/-/g, ' ');

// Function to generate content for fake data file
function generateFakeDataContent(file, keyNames, keyTypes) {
  console.log('\x1b[32m%s\x1b[0m', "CREATE ", file);

  // Function to generate random number less than 9
  function generateRandomNumber() {
    return Math.floor(Math.random() * 9); 
  }

  // Function to generate random string of length less than 6
  function generateRandomString() {
    const length = Math.floor(Math.random() * 6);
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return `'${result}'`;
  }

  // Function to generate random boolean (true or false) with 50% probability
  function generateRandomBoolean() {
    return Math.random() < 0.5;
  }

  let fakeData = {};

  // Generate fake data for each key based on its type
  for (let i = 0; i < keyNames.length; i++) {
    const key = keyNames[i];
    const type = keyTypes[i];
    switch (type) {
      case 'number':
        fakeData[key] = generateRandomNumber();
        break;
      case 'string':
        fakeData[key] = generateRandomString();
        break;
      case 'boolean':
        fakeData[key] = generateRandomBoolean();
        break;
      default:
        fakeData[key] = '';
        break;
    }
  }

  const content = `
import { make } from '@sharedModule/test-suite/test.utils';
import { ResponseIdentity } from '@sharedModule/models';
import { ${pascalCase}Form } from '../models/${componentName}-form.model';

export const FAKE_${upperSnakeCase}_FORM_DATA = make<${pascalCase}Form>(\n${JSON.stringify(fakeData, null, 2).replace(/"/g, '')}\n);

export const FAKE_SUCCESS_RESPONSE = make<ResponseIdentity<boolean>>({
  status: 1,
  message: 'success',
  data: true
});
`;

  return content;
}

module.exports = {
  generateFakeDataContent
}



module.exports = {
  generateFakeDataContent
}