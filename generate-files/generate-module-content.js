const componentName = process.argv[2];
const camelCase = componentName.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
const pascalCase = camelCase.charAt(0).toUpperCase() + camelCase.slice(1);

// Function to generate content for module file
function generateModuleContent(file) {
    console.log('\x1b[32m%s\x1b[0m', "CREATE ", file);
    switch (file) {
      case '':
        return `import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { TranslateModule } from '@ngx-translate/core';
import { AsArrayPipe } from '@sharedModule/pipes/as-array/as-array.pipe';
import { ${pascalCase}FormRoutingModule } from './${componentName}-routing.module';
import { ${pascalCase}FormComponent } from './form-component/${componentName}.component';
import { ${pascalCase}Effects } from './store/effects/${componentName}-effects';
import { MaterialModule } from 'src/app/material/material.module';

@NgModule({
  declarations: [
    ${pascalCase}FormComponent
  ],
  imports: [
    CommonModule,
    ${pascalCase}FormRoutingModule,
    ReactiveFormsModule,
    TranslateModule,
    AsArrayPipe,
    EffectsModule.forFeature([${pascalCase}Effects]),
    MaterialModule,
  ],
  providers: [ ]
})
export class ${pascalCase}FormModule { }
`;
      case '-routing':
        return `
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ${pascalCase}FormComponent } from './form-component/${componentName}.component';

const routes: Routes = [
  {
    path: '',
    component: ${pascalCase}FormComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ${pascalCase}FormRoutingModule { }
        `; 
      default:
        return '';
    }
  }

  module.exports = {
    generateModuleContent,
  };