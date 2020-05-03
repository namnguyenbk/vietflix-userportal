import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) { 
  }

  get_category(){
    let url = environment.base_url_api + "/categories"
    let access_token = localStorage.getItem('access_token')
    let headers = {
      'Authorization': 'Bearer '+ access_token
    }

    return this.http.get(url, {headers})
  }

  add_category(name: string){
    let url = environment.base_url_api + "/categories"
    let access_token = localStorage.getItem('access_token')
    let headers = {
      'Authorization': 'Bearer '+ access_token
    }

    return this.http.post(url,{name}, {headers})
  }

  update_category(id: number, name: string){
    let url = environment.base_url_api + `/categories/${id}`
    let access_token = localStorage.getItem('access_token')
    let headers = {
      'Authorization': 'Bearer '+ access_token
    }

    return this.http.put(url,{name}, {headers})
  }

  delete_category(id: number){
    let url = environment.base_url_api + `/categories/${id}`
    let access_token = localStorage.getItem('access_token')
    let headers = {
      'Authorization': 'Bearer '+ access_token
    }

    return this.http.delete(url, {headers})
  }

  search(name:string){
    let url = environment.base_url_api + `/search-category?name=${name}`
    let access_token = localStorage.getItem('access_token')
    let headers = {
      'Authorization': 'Bearer '+ access_token
    }

    return this.http.get(url, {headers})
  }

}
