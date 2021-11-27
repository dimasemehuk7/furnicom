import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {RegistrationData} from "../../models/registration-data";
import {AuthRestService} from "../../rest/auth-rest.service";
import {NavigationService} from "@@app/services/navigation.service";

@Component({
  templateUrl: 'registration-page.component.html',
  styleUrls: ['registration-page.component.scss']
})
export class RegistrationPageComponent implements OnInit {

  public form: FormGroup;

  constructor(private taskRestService: AuthRestService,
              private navigationService: NavigationService) {
    this.form = new FormGroup({
      email: new FormControl(null),
      username: new FormControl(null),
      password: new FormControl(null),
      confirmationPassword: new FormControl(null)
    });
  }

  ngOnInit(): void {
    this.form.valueChanges.subscribe(value => console.log(value));
  }

  register() {
    if (this.form.valid) {
      const registrationData: RegistrationData = {
        username: this.form.controls.username.value,
        email: this.form.controls.email.value,
        password: this.form.controls.password.value
      };
      console.log(registrationData)
      this.taskRestService.registerUser$(registrationData).subscribe((user) => {
        this.navigationService.goToHome();
      })
    }
  }
}
