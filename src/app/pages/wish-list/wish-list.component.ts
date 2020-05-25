import { Component, OnInit } from '@angular/core';
import { FilmService } from 'src/app/services/film.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-wish-list',
  templateUrl: './wish-list.component.html',
  styleUrls: ['./wish-list.component.css']
})
export class WishListComponent implements OnInit {
  wishlist = [];
  is_getting_wishlist = false;
  is_getting_recommended_film = false;
  is_getting_new = false;

  recommended = [];

  body_style = {
    padding: '5px',
    color: 'white',
    'background-color': 'rgb(20,20,20)',
    border: '1px'
  }

  constructor(private film_service: FilmService, private router: Router, private route: ActivatedRoute) { 
  }

  ngOnInit() {
    this.is_getting_wishlist = true;
    this.film_service.wishlist().subscribe((res:any)=>{
      this.wishlist = res;
      this.is_getting_wishlist = false;
    }, error =>{
      this.is_getting_wishlist = false;
    });

    this.film_service.get_recommended_films().subscribe((res:any)=>{
      this.recommended = res;
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
