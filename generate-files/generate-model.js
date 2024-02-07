const componentName = process.argv[2];

const camelCase = componentName.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
const pascalCase = camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
const upperSnakeCase = componentName.toUpperCase().replace(/-/g, '_');
const pascalCaseWithSpace = componentName.toLocaleUpperCase().replace(/-/g, ' ');

// Function to generate content for models file
function generateModelsContent(file) {
    switch (file) {
      case 'form.model.ts':
        return `export interface ${pascalCase}Form {}
  `;
      default:
        return '';
    }
  }

  module.exports = {
    generateModelsContent
  }
  