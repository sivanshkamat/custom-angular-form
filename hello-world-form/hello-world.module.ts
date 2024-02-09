import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { TranslateModule } from '@ngx-translate/core';
import { AsArrayPipe } from '@sharedModule/pipes/as-array/as-array.pipe';
import { HelloWorldFormRoutingModule } from './hello-world-routing.module';
import { HelloWorldFormComponent } from './form-component/hello-world.component';
import { HelloWorldEffects } from './store/effects/hello-world-effects';
import { MaterialModule } from 'src/app/material/material.module';

@NgModule({
  declarations: [
    HelloWorldFormComponent
  ],
  imports: [
    CommonModule,
    HelloWorldFormRoutingModule,
    ReactiveFormsModule,
    TranslateModule,
    AsArrayPipe,
    EffectsModule.forFeature([HelloWorldEffects]),
    MaterialModule,
  ],
  providers: [ ]
})
export class HelloWorldFormModule { }
