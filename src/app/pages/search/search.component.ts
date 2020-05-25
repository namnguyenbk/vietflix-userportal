import { Component, OnInit } from '@angular/core';
import { FilmService } from 'src/app/services/film.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {


  search_key :string;
  result_search= [];
  is_searching = true;

  is_searched = false;

  body_style = {
    padding: '5px',
    color: 'white',
    'background-color': 'rgb(20,20,20)',
    border: '1px'
  }

  constructor(private film_service: FilmService, private router: Router, private route: ActivatedRoute) { 
    const search_key: string = this.route.snapshot.queryParamMap.get('key');
    if(search_key){
      this.search_key = search_key;
      this.search(search_key);
    }
  }

  ngOnInit() {
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
      this.is_searching = false;
      if(this.result_search.length == 0){
        this.is_searched = true;
      }
    })
  }

  view_detail(film_id, url:string){
    localStorage.setItem('video_url', url);
    localStorage.setItem('video_id', '1');
    this.router.navigate([`film/${film_id}`])
  }

}
