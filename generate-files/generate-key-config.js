const componentName = process.argv[2];
const upperSnakeCase = componentName.toUpperCase().replace(/-/g, '_');

// Function to generate content for key-config file
function generateKeyConfigContent(file, keyNames) {
  console.log('\x1b[32m%s\x1b[0m', "CREATE ", file);
  
  // Import necessary modules and constants
  const content = `
import { Validators } from '@angular/forms';
import { FIELDS_CONSTANT } from '@sharedModule/constants';

const {
  ${keyNames.join(',\n  ')}
} = FIELDS_CONSTANT.attributes;

export const ${upperSnakeCase}_FORM_KEY_CONFIG = {
  ${keyNames.map(key => `[${key}.key]: ['', [Validators.required]],`).join('\n  ')}
};
`;
  
  return content;
}

module.exports = {
  generateKeyConfigContent
}