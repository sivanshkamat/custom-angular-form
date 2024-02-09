const componentName = process.argv[2];
const upperSnakeCase = componentName.toUpperCase().replace(/-/g, '_');

// Function to generate content for key-config file
function generateKeyConfigContent(file, keyNames) {
    console.log('\x1b[32m%s\x1b[0m', "CREATE ", file)
    return `export const ${upperSnakeCase}_FORM_KEY_CONFIG = {};`;
  }
  
  module.exports = {
    generateKeyConfigContent
  }