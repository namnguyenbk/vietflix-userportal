import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  get_me(){
    let login_url = environment.base_url_api + "/me"
    let access_token = localStorage.getItem('access_token')
    let headers = {
      'Authorization': 'Bearer '+ access_token
    }
    return this.http.get(login_url, {headers})
  }

  update(id:number, user:any){
    let url = environment.base_url_api + `/account/${id}`
    let access_token = localStorage.getItem('access_token')
    let headers = {
      'Authorization': 'Bearer '+ access_token
    }

    return this.http.put(url,user, {headers})
  }

}
