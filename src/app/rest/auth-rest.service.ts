import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {RegistrationData} from "../models/registration-data";
import {UrlConstants} from "../constans/url.constants";
import {Credential} from '../models/credential';

@Injectable({providedIn: 'root'})
export class AuthRestService {

  constructor(private http: HttpClient) {}

  registerUser$(registrationData: RegistrationData): Observable<any> {
    return this.http.post<RegistrationData>(`${UrlConstants.API}/register`, registrationData);
  }

  loginUser$(credential: Credential): Observable<any> {
    return this.http.post<Credential>(`${UrlConstants.API}/login`, credential);
  }
}
