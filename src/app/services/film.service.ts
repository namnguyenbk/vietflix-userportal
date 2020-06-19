import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FilmService {

  constructor(private http: HttpClient) { }

  get_film(id: number){
    let url = environment.base_url_api + `/films/${id}`
    let access_token = localStorage.getItem('access_token')
    let headers = {
      'Authorization': 'Bearer '+ access_token
    }

    return this.http.get(url, {headers})
  }

  search_film(film: any){
    let url = environment.base_url_api + `/search-film`
    let access_token = localStorage.getItem('access_token')
    let headers = {
      'Authorization': 'Bearer '+ access_token
    }

    return this.http.post(url, film, {headers})
  }


  wishlist(){
    let url = environment.base_url_api + `/wish-list`
    let access_token = localStorage.getItem('access_token')
    let headers = {
      'Authorization': 'Bearer '+ access_token
    }

    return this.http.get(url, {headers})
  }

  del_wishlist(film_id:number){
    let url = environment.base_url_api + `/wish-list/${film_id}`
    let access_token = localStorage.getItem('access_token')
    let headers = {
      'Authorization': 'Bearer '+ access_token
    }

    return this.http.delete(url, {headers})
  }

  add_wishlist(film_id:number){
    let url = environment.base_url_api + `/wish-list/${film_id}`
    let access_token = localStorage.getItem('access_token')
    let headers = {
      'Authorization': 'Bearer '+ access_token
    }

    return this.http.post(url,{}, {headers})
  }

  mostLike(){
    let url = environment.base_url_api + `/most-liked-film`
    let access_token = localStorage.getItem('access_token')
    let headers = {
      'Authorization': 'Bearer '+ access_token
    }

    return this.http.get(url, {headers})
  }

  mostView(){
    let url = environment.base_url_api + `/most-viewed-film`
    let access_token = localStorage.getItem('access_token')
    let headers = {
      'Authorization': 'Bearer '+ access_token
    }

    return this.http.get(url, {headers})
  }

  watchings(){
    let url = environment.base_url_api + `/watching`
    let access_token = localStorage.getItem('access_token')
    let headers = {
      'Authorization': 'Bearer '+ access_token
    }

    return this.http.get(url, {headers})
  }

  newest(){
    let url = environment.base_url_api + `/newest-film`
    let access_token = localStorage.getItem('access_token')
    let headers = {
      'Authorization': 'Bearer '+ access_token
    }

    return this.http.get(url, {headers})
  }

  send_activity(activity:any){
    let url = environment.base_url_api + `/ratings`
    let access_token = localStorage.getItem('access_token')
    let headers = {
      'Authorization': 'Bearer '+ access_token
    }

    return this.http.post(url, activity,{headers})
  }

  remaining_watching_time(activity){
    let url = environment.base_url_api + `/watching`
    let access_token = localStorage.getItem('access_token')
    let headers = {
      'Authorization': 'Bearer '+ access_token
    }

    return this.http.post(url, activity,{headers})
  }

  view(film_id:number, user_id:number){
    let url = environment.base_url_api + `/view/${film_id}`
    if(user_id){
      url = url + `?from_id=${user_id}`
    }
    let access_token = localStorage.getItem('access_token')
    let headers = {
      'Authorization': 'Bearer '+ access_token
    }

    return this.http.post(url,{headers})
  }

  get_film_non_user(id:number){
    let url = environment.base_url_api + `/films/${id}/non-user`
    let access_token = localStorage.getItem('access_token')
    let headers = {
      'Authorization': 'Bearer '+ access_token
    }

    return this.http.get(url, {headers})
  }

  get_recommended_films(){
    let url = environment.base_url_api + `/recommended-films`
    let access_token = localStorage.getItem('access_token')
    let headers = {
      'Authorization': 'Bearer '+ access_token
    }

    return this.http.get(url, {headers})
  }

  get_similar_films(film_id:number){
    let url = environment.base_url_api + `/similar-films/${film_id}`
    let access_token = localStorage.getItem('access_token')
    let headers = {
      'Authorization': 'Bearer '+ access_token
    }

    return this.http.get(url, {headers})
  }


}
