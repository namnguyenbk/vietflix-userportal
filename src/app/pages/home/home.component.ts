import { Component, OnInit } from '@angular/core';
import { FilmService } from 'src/app/services/film.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  body_style = {
    padding: '5px',
    color: 'white',
    'background-color': 'rgb(20,20,20)',
    border: '1px'
  }

  is_logged =false;

  wishlist = [];
  mostLike = [];
  mostView = [];
  newest = [];
  recommended = [];

  search_key :string;
  result_search= [];
  is_searching = true;

  constructor(private film_service: FilmService, private router: Router, private route: ActivatedRoute) { 
    const search_key: string = this.route.snapshot.queryParamMap.get('search');
    if(search_key){
      this.search_key = search_key;
      this.search(search_key);
    }
  }

  ngOnInit() {
    this.film_service.wishlist().subscribe((res:any)=>{
      this.wishlist = res;
    });
    this.film_service.mostLike().subscribe((res:any)=>{
      this.mostLike = res;
      this.film_service.mostView().subscribe((res:any)=>{
        this.mostView = res;
        this.film_service.newest().subscribe((res:any)=>{
          this.newest = res;
          this.film_service.get_recommended_films().subscribe((res:any)=>{
            this.recommended = res
          })
        });
      });
    });
    
  }

  delete_wishlist(film_id: number){
    this.wishlist = this.wishlist.filter(function(value, index, arr){ return value.id != film_id;});
    this.film_service.del_wishlist(film_id).subscribe((res:any)=>{
    });
  }

  view_detail(film_id, url:string){
    localStorage.setItem('video_url', url);
    localStorage.setItem('video_id', '1');
    this.router.navigate([`film/${film_id}`])
  }

  search(search_key){
    let film = {
      'name': search_key,
      'categories': [],
      'from_date': '1970-01-01',
      'to_date': '2050-01-01'
    }

    this.is_searching = true;
    this.film_service.search_film(film).subscribe((res:any)=>{
      this.result_search = res;
      this.is_searching = false
    })
  }

}
