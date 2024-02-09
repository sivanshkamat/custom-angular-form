const componentName = process.argv[2];

const camelCase = componentName.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
const pascalCase = camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
const upperSnakeCase = componentName.toUpperCase().replace(/-/g, '_');
const pascalCaseWithSpace = componentName.toLocaleUpperCase().replace(/-/g, ' ');


// Function to generate content for form services files
function generateFormServiceContent(file) {
  console.log('\x1b[32m%s\x1b[0m', "CREATE ", file)
  switch (file) {
    case 'form.service.ts':
      return `import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { MessageHandlerService } from '@core/services/message-handler/message-handler.service';
import { ${upperSnakeCase}_FORM_KEY_CONFIG } from '../../key-config/${componentName}-key-config';
import * as formActions from '../../store/${componentName}.actions';
import { ${pascalCase}Form } from '../../models/${componentName}-form.model';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root',
})
export class ${pascalCase}FormService {
  #formGroup!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private messageHandlerService: MessageHandlerService,
    private router: Router
  ) {}

  get formGroup(): FormGroup {
    return this.#formGroup;
  }

  get ${camelCase}FormValue(): ${pascalCase}Form {
    const formValue = this.formGroup?.value as ${pascalCase}Form;
    return formValue;
  }

  buildForm(): void {
    this.#formGroup = this.fb.group(${upperSnakeCase}_FORM_KEY_CONFIG);
  }

  resetForm(): void {
    this.#formGroup.reset();
    this.store.dispatch(formActions.reset${pascalCase}Form());
  }

  success(message: string): void {
    this.messageHandlerService.show(message, 'dismiss');
  }

  goBack(): void {
    const url = this.router.url;
    const router = url.split('/');
    router.pop();
    this.router.navigate([router.join('/')]);
  }
}
`;
    default:
      return `import { TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MaterialModule } from 'src/app/material/material.module';
import { MessageHandlerService } from '@core/services/message-handler/message-handler.service';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { HttpClientService } from '@core/services/http-client/http-client.service';
import { ${pascalCase}FormService } from './${componentName}-form.service';
import * as formActions from '../../store/${componentName}.actions';

describe('${pascalCase}FormService', () => {
  let formService: ${pascalCase}FormService;
  let store: Store;
  let messageHandlerService: MessageHandlerService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore(),
        FormBuilder,
        Store,
        HttpClientService
      ],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        MaterialModule,
        ReactiveFormsModule
      ]
    });
    router = TestBed.inject(Router);
    formService = TestBed.inject(${pascalCase}FormService);
    store = TestBed.inject(Store);
    messageHandlerService = TestBed.inject(MessageHandlerService);
    spyOn(messageHandlerService, 'show');
    formService.buildForm();

  });

  it('should create the form group and initialize it correctly', () => {
    formService.buildForm();

    expect(formService.formGroup).toBeDefined();
    expect(formService.formGroup instanceof FormGroup).toBe(true);
  });

  it('should reset the form and dispatch reset action', () => {
    const dispatchSpy = spyOn(store, 'dispatch');

    formService.buildForm();
    formService.resetForm();

    expect(dispatchSpy).toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalledWith(formActions.reset${pascalCase}Form());
  });
  
  it('should navigate back and reset form when goBack() is called for non-edit route', () => {
    spyOn(router, 'navigate');
    spyOnProperty(router, 'url').and.returnValue('/non-edit-route');

    formService.goBack();

    expect(router.navigate).toHaveBeenCalled();
  });

  it('should display success message when success() is called', () => {
    const successMessage = 'Test success message';
    formService.success(successMessage);

    expect(messageHandlerService.show).toHaveBeenCalledWith(successMessage, 'dismiss');
  });
});
`;

  }
}


module.exports = {
  generateFormServiceContent
}