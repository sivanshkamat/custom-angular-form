import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HelloWorldApiService } from './hello-world-api.service';
import { HttpClientService } from '@core/services/http-client/http-client.service';
import { of } from 'rxjs';
import { ResponseIdentity } from '@sharedModule/models';
import { HelloWorldForm } from '../../models/hello-world-form.model';
import { 
  FAKE_SUCCESS_RESPONSE,
  FAKE_HELLO_WORLD_FORM_DATA
 } from '../../fake-test-data/hello-world-fake';

describe('HelloWorldApiService', () => {
  let service: HelloWorldApiService;
  let httpClientService: HttpClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [
        HelloWorldApiService,
        HttpClientService
      ]
    });
    service = TestBed.inject(HelloWorldApiService);
    httpClientService = TestBed.inject(HttpClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('addHelloWorld', () => {
    it("should add helloWorld", () => {
      const formValue: HelloWorldForm = FAKE_HELLO_WORLD_FORM_DATA;
      const response: ResponseIdentity<boolean> = FAKE_SUCCESS_RESPONSE;
      spyOn(httpClientService, 'post').and.returnValue(of(response));
      service.addHelloWorld(formValue).subscribe(data => {
        expect(data).toEqual(response);
      });
      expect(httpClientService.post).toHaveBeenCalledWith(
        'required url',
        formValue
      );
    });
  });

});
