const fs = require('fs');
const path = require('path');

function updateRoutes() {
    const componentName = process.argv[2];
    const camelCase = componentName.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
    const pascalCase = camelCase.charAt(0).toUpperCase() + camelCase.slice(1);

    // Find the routing module file in the current directory
    const currentDirectoryFiles = fs.readdirSync('./');
    const routingModuleFile = currentDirectoryFiles.find(file => file.endsWith('-routing.module.ts'));

    if (routingModuleFile) {

        const routingModuleFilePath = path.join('./', routingModuleFile);

        let routingModuleContent = fs.readFileSync(routingModuleFilePath, 'utf8');

        const newRoute = `  {
    path: '${componentName}-form',
    loadChildren: () =>
      import('./${componentName}-form/${componentName}.module')
        .then(module => module.${pascalCase}FormModule)
  }`;

        const routesIndex = routingModuleContent.indexOf('const routes: Routes = [');
        if (routesIndex !== -1) {
            console.log('\x1b[34m%s\x1b[0m', 'UPDATE', `${routingModuleFile}`);
            const insertIndex = routesIndex + 'const routes: Routes = ['.length;
            routingModuleContent = routingModuleContent.slice(0, insertIndex) +
                '\n' + newRoute + ',' +
                routingModuleContent.slice(insertIndex);
            fs.writeFileSync(routingModuleFilePath, routingModuleContent);
        } else {
            console.error('Unable to find the position to insert the new route in the routing module file.');
        }
    } else {
        console.log('Routing module file not found in the current directory.');
    }
}

module.exports = {
    updateRoutes
};
