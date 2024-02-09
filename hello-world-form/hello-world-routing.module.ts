
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HelloWorldFormComponent } from './form-component/hello-world.component';

const routes: Routes = [
  {
    path: '',
    component: HelloWorldFormComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HelloWorldFormRoutingModule { }
        