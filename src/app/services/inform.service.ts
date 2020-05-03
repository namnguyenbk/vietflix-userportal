import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InformService {

  constructor(private http: HttpClient) { }

  get_inform(){
    let url = environment.base_url_api + "/inform"
    let access_token = localStorage.getItem('access_token')
    let headers = {
      'Authorization': 'Bearer '+ access_token
    }

    return this.http.get(url, {headers})
  }

  search(title:string, text:string){
    let url = environment.base_url_api + "/search-inform"
    let access_token = localStorage.getItem('access_token')
    let headers = {
      'Authorization': 'Bearer '+ access_token
    }

    return this.http.post(url, {title: title, text: text},{headers})
  }

  add_inform(title: string, text: string){
    let url = environment.base_url_api + "/inform"
    let access_token = localStorage.getItem('access_token')
    let headers = {
      'Authorization': 'Bearer '+ access_token
    }

    return this.http.post(url,{title: title, text: text}, {headers})
  }

  update_inform(id: number, title: string, text: string){
    let url = environment.base_url_api + `/inform/${id}`
    let access_token = localStorage.getItem('access_token')
    let headers = {
      'Authorization': 'Bearer '+ access_token
    }

    return this.http.put(url,{title: title, text: text}, {headers})
  }

  delete_inform(id: number){
    let url = environment.base_url_api + `/inform/${id}`
    let access_token = localStorage.getItem('access_token')
    let headers = {
      'Authorization': 'Bearer '+ access_token
    }

    return this.http.delete(url, {headers})
  }
}
