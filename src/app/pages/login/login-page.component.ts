import {Component, Injectable} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {AuthRestService} from "../../rest/auth-rest.service";
import {Credential} from "../../models/credential";
import {Router} from "@angular/router";
import {NavigationService} from "@@app/services/navigation.service";
import { ToastrService } from 'ngx-toastr';

@Component({
  templateUrl: 'login-page.component.html',
  styleUrls: ['login-page.component.scss']
})
export class LoginPageComponent {

  public form: FormGroup;

  constructor(private taskRestService: AuthRestService,
              private router: Router,
              private navigationService: NavigationService,
              private toastr: ToastrService) {
    this.form = new FormGroup({
      username: new FormControl(null),
      password: new FormControl(null)
    });
  }

  login() {
    if (this.form.valid) {
      const credential: Credential = {
        username: this.form.controls.username.value,
        password: this.form.controls.password.value
      }
      this.taskRestService.loginUser$(credential).subscribe((res) => {
        this.navigationService.goToHome();
        this.toastr.success('', 'user is logged');
      })
    }
  }
}

