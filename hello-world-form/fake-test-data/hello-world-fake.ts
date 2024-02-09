
import { make } from '@sharedModule/test-suite/test.utils';
import { ResponseIdentity } from '@sharedModule/models';
import { HelloWorldForm } from '../models/hello-world-form.model';

export const FAKE_HELLO_WORLD_FORM_DATA = make<HelloWorldForm>(
{
  id: ,
  idd: 
}
);

export const FAKE_SUCCESS_RESPONSE = make<ResponseIdentity<boolean>>({
  status: 1,
  message: 'success',
  data: true
});
