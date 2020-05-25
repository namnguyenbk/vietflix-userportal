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
  watching = []


  is_getting_wishlist = false;
  is_getting_recommended_film = false;
  is_getting_new = false;

  constructor(private film_service: FilmService, private router: Router, private route: ActivatedRoute) { 
    let type_load = this.route.snapshot.queryParamMap.get("type")
    if(type_load =='reload'){
      window.location.href = "/home"
    }
  }

  ngOnInit() {
    this.is_getting_wishlist = true;
    this.film_service.wishlist().subscribe((res:any)=>{
      this.wishlist = res;
      this.is_getting_wishlist = false;

      this.is_getting_wishlist = true;
      this.film_service.watchings().subscribe((res:any)=>{
      this.watching = res;
      this.is_getting_wishlist = false;
        }, error =>{
        this.is_getting_wishlist = false;
      });

    this.film_service.get_recommended_films().subscribe((res:any)=>{
            this.recommended = res;
    });
    }, error =>{
      this.is_getting_wishlist = false;
    });

    this.film_service.newest().subscribe((res:any)=>{
      this.newest = res;
      this.film_service.mostLike().subscribe((res:any)=>{
        this.mostLike = res;
        this.film_service.mostView().subscribe((res:any)=>{
          this.mostView = res;
          this.film_service.watchings().subscribe((res:any)=>{this.watching = res;}, error =>{});
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
    this.router.navigate([`film/${film_id}`])
  }

  continue_watching(id:number, video_url: string, time: number, meta_data:any){
    localStorage.setItem('video_url', video_url);
    localStorage.setItem('video_id', meta_data.episode );
    console.log({queryParams: {time: time, episode: meta_data.episode, continue_watching: true}})
    this.router.navigate([`film/${id}/episodes/${meta_data.episode}`],{queryParams: {time: time, continue_watching: true}} )
  }

}
