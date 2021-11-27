import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginPageComponent} from "./pages/login/login-page.component";
import {RegistrationPageComponent} from "./pages/registration/registration-page.component";
import {ProductsPageComponent} from "./pages/products/products-page.component";
import {HomePageComponent} from "@@app/pages/home/home-page.component";

const routes: Routes = [
  {path: 'login', component: LoginPageComponent},
  {path: 'registration', component: RegistrationPageComponent},
  {path: 'home', component: HomePageComponent},
  {path: 'products', component: ProductsPageComponent},
  {
    path: 'dashboard',
    loadChildren: () => import('./subsystems/dashboard/dashboard.module').then(m => m.DashboardModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
