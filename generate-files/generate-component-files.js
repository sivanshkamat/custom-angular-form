const componentName = process.argv[2];

const camelCase = componentName.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
const pascalCase = camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
const upperSnakeCase = componentName.toUpperCase().replace(/-/g, '_');
const pascalCaseWithSpace = componentName.toLocaleUpperCase().replace(/-/g, ' ');

// Function to generate content for form component files
function generateFormComponentContent(file, keyNames, keyTypes) {
  console.log('\x1b[32m%s\x1b[0m', "CREATE ", file)
  switch (file) {
    case 'component.ts':
      return `import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
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

  describe('get form', () => {
    it("should return form from form service", () => {
      fixture.detectChanges();
      const result = component.${camelCase}Form;
      const expected = formService.formGroup;

      expect(result).toEqual(expected);
      expect(result).toBeInstanceOf(FormGroup);
    });
  });

  describe('ngOnInit', () => {
    it("should call buildForm function from form service with required config", () => {
      spyOn(formService, 'buildForm');
      component.ngOnInit();

      expect(formService.buildForm).toHaveBeenCalled();
    });
  });

  describe('ngOnDestroy', () => {
    it('should reset form and dispatch actions on ngOnDestroy', () => {
      spyOn(formService, 'resetForm');
      spyOn(store, 'dispatch');

      component.ngOnDestroy();

      expect(formService.resetForm).toHaveBeenCalled();
      expect(store.dispatch).toHaveBeenCalledWith(formActions.reset${pascalCase}Form());
    });
  });

  describe('cancel', () => {
    it('should call service.goBack', () => {
      spyOn(formService, 'goBack');
      component.cancel();
      expect(formService.goBack).toHaveBeenCalled();
    });
  });

  describe('submitForm', () => {
    it('should mark all form controls as touched', () => {
      spyOn(component.${camelCase}Form, 'markAllAsTouched');
      component.submitForm();
      expect(component.${camelCase}Form?.markAllAsTouched).toHaveBeenCalled();
    });

    it('should not dispatch actions if the form is invalid', () => {
      const spy = spyOn(store, 'dispatch');
      spyOn(component.${camelCase}Form, 'markAllAsTouched');
      spyOnProperty(component.${camelCase}Form, 'valid', 'get').and.returnValue(false);

      component.submitForm();

      expect(component.${camelCase}Form?.markAllAsTouched).toHaveBeenCalled();
      expect(spy).not.toHaveBeenCalled();
    });

    it('should dispatch add action if valid', () => {
      const spy = spyOn(store, 'dispatch');
      spyOn(component.${camelCase}Form, 'markAllAsTouched');
      spyOnProperty(component.${camelCase}Form, 'valid', 'get').and.returnValue(true);

      spyOnProperty(formService, '${camelCase}FormValue', 'get').and.returnValue(FAKE_${upperSnakeCase}_FORM_DATA);

      const expectedAddAction = formActions.add${pascalCase}Form({ formValue: FAKE_${upperSnakeCase}_FORM_DATA });

      component.submitForm();
      expect(component.${camelCase}Form?.markAllAsTouched).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith(expectedAddAction);
    });
  });
});
      `;
    case 'component.html':
      return `<ng-container header>
  <h6 class="app-toolbar__title">
    <button class="mr-4" mat-icon-button (click)="cancel()" type="button">
      <mat-icon>arrow_back</mat-icon>
    </button>
    <span>{{ constants.title | translate }}</span>
  </h6>
</ng-container>
<ng-container form *ngIf="${camelCase}Form">
  <form [formGroup]="${camelCase}Form" (submit)="submitForm()">
    <div class="page-card__form-body">
      <!-- Add input and other fields herer -->
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
</ng-container>
  `;
    case 'component.scss':
      return '';
    default:
      return '';
  }
}

module.exports = {
  generateFormComponentContent,
};
