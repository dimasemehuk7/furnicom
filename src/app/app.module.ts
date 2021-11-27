import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LoginPageComponent} from "./pages/login/login-page.component";
import {RegistrationPageComponent} from "./pages/registration/registration-page.component";
import {ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {ProductsPageComponent} from "./pages/products/products-page.component";
import {HomePageComponent} from "@@app/pages/home/home-page.component";
import {HeaderComponent} from "@@app/components/header/header.component";
import {NavigationMenuComponent} from "@@app/components/navigation-menu/navigation-menu.component";
import {ProductComponent} from "@@app/components/product/product.component";
import {ToastrModule} from "ngx-toastr";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

@NgModule({
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 1000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true
    })
  ],
  declarations: [
    AppComponent,
    LoginPageComponent,
    RegistrationPageComponent,
    HomePageComponent,
    ProductsPageComponent,
    HeaderComponent,
    NavigationMenuComponent,
    ProductComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
