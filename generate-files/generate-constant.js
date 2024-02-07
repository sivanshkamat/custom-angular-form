const componentName = process.argv[2];

const camelCase = componentName.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
const pascalCase = camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
const upperSnakeCase = componentName.toUpperCase().replace(/-/g, '_');
const pascalCaseWithSpace = componentName.toLocaleUpperCase().replace(/-/g, ' ');


// Function to generate content for constants file
function generateConstantsContent(file) {
  console.log('\x1b[32m%s\x1b[0m', "CREATE ", file)
  return `export const ${upperSnakeCase}_FORM_CONSTANTS = {
  title: '${camelCase}.form.title',
  actions: {
    save: 'buttons.save',
    cancel: 'buttons.cancel',
  },
} as const;
`;
  }

  module.exports = { 
    generateConstantsContent
  }