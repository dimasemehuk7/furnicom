import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {RegistrationData} from "../models/registration-data";
import {UrlConstants} from "../constans/url.constants";
import { Credential } from '../models/credential';
import {NavigationConfig} from "@@app/models/navigation-config";

@Injectable({providedIn: 'root'})
export class NavigationMenuRestService {

  constructor(private http: HttpClient) {}

  getNavItems$(): Observable<NavigationConfig> {
    return this.http.get<NavigationConfig>(`${UrlConstants.API}/nav-items`);
  }
}
