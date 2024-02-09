
import { Injectable } from '@angular/core';
import { HttpClientService } from '@core/services/http-client/http-client.service';
import { Observable } from 'rxjs';
import { ResponseIdentity } from '@sharedModule/models';
import { HelloWorldForm } from '../../models/hello-world-form.model';

@Injectable({
  providedIn: 'root',
})
export class HelloWorldApiService {
  constructor(private readonly httpClient: HttpClientService) {}

  addHelloWorld(formValue: HelloWorldForm): Observable<ResponseIdentity<boolean>> {
    return this.httpClient.post('required url', formValue);
  }
}
