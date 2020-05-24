import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  status: string;
}

export interface LoginRes{
access_token: string;
user: User
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(email: string, password: string){
    let login_url = environment.base_url_api + "/login"

    let body = {
      email: email,
      password: password
    }

    return this.http.post(login_url, body);
  }

  signup(account: any){
    let signup_url = environment.base_url_api + "/signup"

    return this.http.post(signup_url, account);
  }

  reset_password(email: string){
    let url = environment.base_url_api + "/verification_code"
    return this.http.post(url, {email})
  }

  check_verification_code(email:string, token: string, new_email:string){
    let url = environment.base_url_api + "/verification_code"
    return this.http.post(url, {email:email, token: token, new_email: new_email})
  }

  change_pass(email: string, pass: string, old_pass: string){
    let url = environment.base_url_api + "/change-pass"
    return this.http.put(url, {email:email, password: pass, old_password: old_pass})
  }
}
