const componentName = process.argv[2];

const camelCase = componentName.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
const pascalCase = camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
const upperSnakeCase = componentName.toUpperCase().replace(/-/g, '_');
const pascalCaseWithSpace = componentName.toLocaleUpperCase().replace(/-/g, ' ');

// Function to generate content for api services files
function generateAPIServiceContent(file) {
  console.log('\x1b[32m%s\x1b[0m', "CREATE ", file)
  if (file === 'api.service.ts')
    return `
import { Injectable } from '@angular/core';
import { HttpClientService } from '@core/services/http-client/http-client.service';
import { Observable } from 'rxjs';
import { ResponseIdentity } from '@sharedModule/models';
import { ${pascalCase}Form } from '../../models/${componentName}-form.model';

@Injectable({
  providedIn: 'root',
})
export class ${pascalCase}ApiService {
  constructor(private readonly httpClient: HttpClientService) {}

  add${pascalCase}(formValue: ${pascalCase}Form): Observable<ResponseIdentity<boolean>> {
    return this.httpClient.post('required url', formValue);
  }
}
`;
  else return `import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ${pascalCase}ApiService } from './${componentName}-api.service';
import { HttpClientService } from '@core/services/http-client/http-client.service';
import { of } from 'rxjs';
import { ResponseIdentity } from '@sharedModule/models';
import { ${pascalCase}Form } from '../../models/${componentName}-form.model';
import { 
  FAKE_SUCCESS_RESPONSE,
  FAKE_${upperSnakeCase}_FORM_DATA
 } from '../../fake-test-data/${componentName}-fake';

describe('${pascalCase}ApiService', () => {
  let service: ${pascalCase}ApiService;
  let httpClientService: HttpClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [
        ${pascalCase}ApiService,
        HttpClientService
      ]
    });
    service = TestBed.inject(${pascalCase}ApiService);
    httpClientService = TestBed.inject(HttpClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('add${pascalCase}', () => {
    it("should add ${camelCase}", () => {
      const formValue: ${pascalCase}Form = FAKE_${upperSnakeCase}_FORM_DATA;
      const response: ResponseIdentity<boolean> = FAKE_SUCCESS_RESPONSE;
      spyOn(httpClientService, 'post').and.returnValue(of(response));
      service.add${pascalCase}(formValue).subscribe(data => {
        expect(data).toEqual(response);
      });
      expect(httpClientService.post).toHaveBeenCalledWith(
        'required url',
        formValue
      );
    });
  });

});
`;
}


module.exports = {
  generateAPIServiceContent
}