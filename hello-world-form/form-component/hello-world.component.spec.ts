import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { HelloWorldFormComponent } from './hello-world.component';
import { HelloWorldFormService } from '../services/form/hello-world-form.service';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ActivatedRoute } from '@angular/router';
import { MaterialModule } from 'src/app/material/material.module';
import { emptyTemplate } from '@sharedModule/test-suite/test';
import * as formActions from '../store/hello-world.actions';
import { FAKE_HELLO_WORLD_FORM_DATA } from '../fake-test-data/hello-world-fake';

describe('HelloWorldFormComponent', () => {
  let component: HelloWorldFormComponent;
  let fixture: ComponentFixture<HelloWorldFormComponent>;
  let store: MockStore;
  let formService: HelloWorldFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HelloWorldFormComponent],
      imports: [ReactiveFormsModule, MaterialModule],
      providers: [
        provideMockStore(),
        { provide: ActivatedRoute, useValue: {} },
        HelloWorldFormService
      ]
    }).compileComponents();

    emptyTemplate(HelloWorldFormComponent);
    store = TestBed.inject(MockStore);
    formService = TestBed.inject(HelloWorldFormService);
    fixture = TestBed.createComponent(HelloWorldFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  describe('get form', () => {
    it("should return form from form service", () => {
      fixture.detectChanges();
      const result = component.helloWorldForm;
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
      expect(store.dispatch).toHaveBeenCalledWith(formActions.resetHelloWorldForm());
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
      spyOn(component.helloWorldForm, 'markAllAsTouched');
      component.submitForm();
      expect(component.helloWorldForm?.markAllAsTouched).toHaveBeenCalled();
    });

    it('should not dispatch actions if the form is invalid', () => {
      const spy = spyOn(store, 'dispatch');
      spyOn(component.helloWorldForm, 'markAllAsTouched');
      spyOnProperty(component.helloWorldForm, 'valid', 'get').and.returnValue(false);

      component.submitForm();

      expect(component.helloWorldForm?.markAllAsTouched).toHaveBeenCalled();
      expect(spy).not.toHaveBeenCalled();
    });

    it('should dispatch add action if valid', () => {
      const spy = spyOn(store, 'dispatch');
      spyOn(component.helloWorldForm, 'markAllAsTouched');
      spyOnProperty(component.helloWorldForm, 'valid', 'get').and.returnValue(true);

      spyOnProperty(formService, 'helloWorldFormValue', 'get').and.returnValue(FAKE_HELLO_WORLD_FORM_DATA);

      const expectedAddAction = formActions.addHelloWorldForm({ formValue: FAKE_HELLO_WORLD_FORM_DATA });

      component.submitForm();
      expect(component.helloWorldForm?.markAllAsTouched).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith(expectedAddAction);
    });
  });
});
      