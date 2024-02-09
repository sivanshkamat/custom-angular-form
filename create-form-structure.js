console.log(".......................")
console.log("T H E  B I G  F U D G E")
console.log(".......................")

const fs = require('fs');
const moduleFun = require('./generate-files/generate-module-content');
const componentFun = require('./generate-files/generate-component-files');
const formServiceFun = require('./generate-files/generate-form-service');
const apiServiceFun = require('./generate-files/generate-api-service');
const constantFun = require('./generate-files/generate-constant');
const storeFun = require('./generate-files/generate-store');
const keyConfigFun = require('./generate-files/generate-key-config');
const modelFun = require('./generate-files/generate-model');
const effectFun = require('./generate-files/generate-effects');
const fakeFun = require('./generate-files/generate-fake');


const componentName = process.argv[2];

if (!componentName) {
  console.error('Please provide a component name. Example: "get-form-folder-structure abc-def"');
  process.exit(1);
}

const parentFolder = `${componentName}-form`;
const folders = ['form-component', 'constants', 'services', 'store', 'models', 'key-config', 'fake-test-data'];
const nestedFolders = {
  services: ['api', 'form'],
  store: ['effects', 'reducers', 'selectors']
};
const files = {
  'form-component': ['component.ts', 'component.spec.ts', 'component.html', 'component.scss'],
  constants: ['constants.ts'],
  api: ['api.service.ts', 'api.service.spec.ts'],
  form: ['form.service.ts', 'form.service.spec.ts'],
  store: ['actions.ts', 'state.ts'],
  effects: ['effects.ts', 'effects.spec.ts'],
  reducers: ['reducers.ts', 'reducers.spec.ts'],
  selectors: ['selectors.ts', 'selectors.spec.ts'],
  'key-config': ['key-config.ts'],
  models: ['form.model.ts'],
  'fake-test-data': ['fake.ts']
};
const moduleFiles = ['', '-routing'];

// Function to generate file content
function generateFileContent(folder, file) {
  switch (folder) {
    case 'form-component':
      return componentFun.generateFormComponentContent(file);
    case 'constants':
      return constantFun.generateConstantsContent(file);
    case 'store':
      return storeFun.generateStoreContent(file);
    case 'key-config':
      return keyConfigFun.generateKeyConfigContent(file);
    case 'api':
      return apiServiceFun.generateAPIServiceContent(file);
    case 'form':
      return formServiceFun.generateFormServiceContent(file);
    case 'models':
      return modelFun.generateModelsContent(file);
    case 'effects':
      return effectFun.generateEffectsContent(file);
    case 'module':
      return moduleFun.generateModuleContent(file);
    case 'fake-test-data':
      return fakeFun.generateFakeDataContent(file);
    default:
      return '';
  }
}


// Create parent folder
fs.mkdirSync(parentFolder);

// Create subfolders and files
folders.forEach(folder => {
  console.log('\x1b[32m%s\x1b[0m', "CREATE ", folder);

  const folderPath = `${parentFolder}/${folder}`;
  fs.mkdirSync(folderPath);

  if (nestedFolders[folder]) {
    nestedFolders[folder].forEach(subfolder => {
      fs.mkdirSync(`${folderPath}/${subfolder}`);
      files[subfolder].forEach(file => {
        const content = generateFileContent(subfolder, file);
        fs.writeFileSync(`${folderPath}/${subfolder}/${componentName}-${file}`, content);
      });
    });
  }

  if (folder === 'form-component') {
    files[folder].forEach(file => {
      const content = generateFileContent(folder, file);
      fs.writeFileSync(`${folderPath}/${componentName}.${file}`, content);
    });
  }
  else if (!nestedFolders[folder]) {
    files[folder].forEach(file => {
      const content = generateFileContent(folder, file);
      fs.writeFileSync(`${folderPath}/${componentName}-${file}`, content);
    });
  }
  if (folder === 'store') {
    files[folder].forEach(file => {
      const content = generateFileContent(folder, file);
      fs.writeFileSync(`${folderPath}/${componentName}.${file}`, content);
    });
  }
});

// Create module files
moduleFiles.forEach(file => {
  const content = generateFileContent('module', file);
  fs.writeFileSync(`${parentFolder}/${componentName}${file}.module.ts`, content);
});
