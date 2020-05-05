import { Component, OnInit } from '@angular/core';
import { FilmService } from 'src/app/services/film.service';
import { Router } from '@angular/router';

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

  constructor(private film_service: FilmService, private router: Router) { }

  ngOnInit() {
    this.film_service.wishlist().subscribe((res:any)=>{
      this.wishlist = res;
      this.film_service.mostLike().subscribe((res:any)=>{
        this.mostLike = res;
        this.film_service.mostView().subscribe((res:any)=>{
          this.mostView = res;
          this.film_service.newest().subscribe((res:any)=>{
            this.newest = res;
          });
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

}
