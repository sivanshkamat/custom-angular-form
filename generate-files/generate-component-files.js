const componentName = process.argv[2];

const camelCase = componentName.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
const pascalCase = camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
const upperSnakeCase = componentName.toUpperCase().replace(/-/g, '_');
const pascalCaseWithSpace = componentName.toLocaleUpperCase().replace(/-/g, ' ');

// Function to generate content for form component files
function generateFormComponentContent(file, keyNames, isKeyDropDown) {
  console.log('\x1b[32m%s\x1b[0m', "CREATE ", file, isKeyDropDown)
  switch (file) {
    case 'component.ts':
      // Component TypeScript content
      return `import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ATTRIBUTES_CONSTANT } from '@sharedModule/constants';
import { ${upperSnakeCase}_FORM_CONSTANTS } from '../constants/${componentName}-constants';
import { ${pascalCase}FormService } from '../services/form/${componentName}-form.service';
import * as formActions from '../store/${componentName}.actions';

@Component({
  selector: 'app-${componentName}-form',
  templateUrl: './${componentName}.component.html',
  styleUrls: ['./${componentName}.component.scss'],
})
export class ${pascalCase}FormComponent implements OnInit, OnDestroy {
  constants = ${upperSnakeCase}_FORM_CONSTANTS;
  public attributesConstant = ATTRIBUTES_CONSTANT;

  constructor(
    private readonly store: Store,
    private formService: ${pascalCase}FormService,
  ) {}

  get ${camelCase}Form(): FormGroup {
    return this.formService.formGroup;
  }

  ngOnInit(): void {
    this.formService.buildForm();
  }

  ngOnDestroy(): void {
    this.formService.resetForm();
    this.store.dispatch(formActions.reset${pascalCase}Form());
  }

  submitForm(): void {
    this.${camelCase}Form?.markAllAsTouched();
    if (this.${camelCase}Form?.valid) {
      const value = this.formService.${camelCase}FormValue;
      this.store.dispatch(formActions.add${pascalCase}Form({ formValue: value }));
    }
  }

  cancel(): void {
    this.formService.goBack();
  }
}
      `;
    case 'component.spec.ts':
      // Component Test file content
      return `import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { ${pascalCase}FormComponent } from './${componentName}.component';
import { ${pascalCase}FormService } from '../services/form/${componentName}-form.service';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ActivatedRoute } from '@angular/router';
import { MaterialModule } from 'src/app/material/material.module';
import { emptyTemplate } from '@sharedModule/test-suite/test';
import * as formActions from '../store/${componentName}.actions';
import { FAKE_${upperSnakeCase}_FORM_DATA } from '../fake-test-data/${componentName}-fake';

describe('${pascalCase}FormComponent', () => {
  let component: ${pascalCase}FormComponent;
  let fixture: ComponentFixture<${pascalCase}FormComponent>;
  let store: MockStore;
  let formService: ${pascalCase}FormService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [${pascalCase}FormComponent],
      imports: [ReactiveFormsModule, MaterialModule],
      providers: [
        provideMockStore(),
        { provide: ActivatedRoute, useValue: {} },
        ${pascalCase}FormService
      ]
    }).compileComponents();

    emptyTemplate(${pascalCase}FormComponent);
    store = TestBed.inject(MockStore);
    formService = TestBed.inject(${pascalCase}FormService);
    fixture = TestBed.createComponent(${pascalCase}FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  // Test cases
});

      `;
    case 'component.html':
      // Component HTML content
      let htmlContent = `<ng-container header>
  <h6 class="app-toolbar__title">
    <button class="mr-4" mat-icon-button (click)="cancel()" type="button">
      <mat-icon>arrow_back</mat-icon>
    </button>
    <span>{{ constants.title | translate }}</span>
  </h6>
</ng-container>
<ng-container form *ngIf="${camelCase}Form">
  <form [formGroup]="${camelCase}Form" (submit)="submitForm()">
    <div class="page-card__form-body">`;

      // Loop over keys
      keyNames.forEach((keyName, index) => {
        if (isKeyDropDown[index]) {
          // Add nothing for dropdown
        } else {
          // Add input item template for non-dropdown
          htmlContent += `
      <div>
        <app-input-item-template
          [key]="attributesConstant.${keyName}.key"
          [formGroup]="${camelCase}Form"
        />
      </div>`;
        }
      });

      // Add remaining HTML content
      htmlContent += `
    </div>
    <div class="page-card__form-actions">
      <button type="button" (click)="cancel()" color="warn" mat-flat-button>
        {{ constants.actions.cancel | translate }}
      </button>
      <button mat-flat-button type="submit" color="primary">
        {{ constants.actions.save | translate }}
      </button>
    </div>
  </form>
</ng-container>`;
      return htmlContent;
    case 'component.scss':
      // Component SCSS content
      return '';
    default:
      return '';
  }
}

module.exports = {
  generateFormComponentContent,
};
