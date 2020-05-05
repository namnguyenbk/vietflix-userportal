import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FilmService } from 'src/app/services/film.service';
import { CommentService } from 'src/app/services/comment.service';
import { UserService } from 'src/app/services/user.service';
import { NzModalService } from 'ng-zorro-antd';
import { DomSanitizer } from '@angular/platform-browser';
import * as Plyr from 'plyr';
@Component({
  selector: 'app-detailed-film',
  templateUrl: './detailed-film.component.html',
  styleUrls: ['./detailed-film.component.css']
})
export class DetailedFilmComponent implements OnInit {

  initLoading = true; // bug
  loadingMore = false;
  data: any[] = [];
  list: Array<{ loading: boolean; name: any }> = [];

  film_id: number;
  film: any;
  comments: any;

  current_episode = localStorage.getItem('video_id');;
  // current_video_url : string;

  comment: string;
  submitting= false;
  public player;

  current_video_url = localStorage.getItem('video_url');

  
  constructor(private route: ActivatedRoute, private film_service: FilmService, private comment_service: CommentService,
    private modalService: NzModalService, private user_service: UserService, private router: Router,
    public sanitizer : DomSanitizer) { 
      this.film_id = parseInt(this.route.snapshot.paramMap.get("film_id"));
    this.film_service.get_film(this.film_id).subscribe((res:any)=>{
      this.film = res
      this.film.meta_data = JSON.parse(res.meta_data);
      this.film.episodes = JSON.parse(res.episodes);

      if(this.film.video_url){
        this.current_video_url = this.film.video_url;
      }else{
        this
        .current_video_url = this.film.episodes[0]['video_url'];
      }

    });
      
    }

  ngOnInit() {
    window.scroll(0,0);
    this.player = new Plyr('#plyrID', { 
      captions: { active: true }
    });

    this.getData((res: any) => {
      this.data = res;
      this.list = res;
      this.initLoading = false;
    });
  }

  getData(callback: (res: any) => void): void {
    this.comment_service.get_comments(this.film_id).subscribe((res: any) => callback(res));
  }

  onLoadMore(): void {
  }

  change_episode(id: string, url: string){
    // console.log(id)
    // this.current_episode = id
    localStorage.setItem('video_url', url);
    localStorage.setItem('video_id', id);
    // this.router.navigate([`/film/${this.film.id}/episodes/${id}`]);
    // this.router.navigateByUrl('home', { skipLocationChange: true });
    // this.router.navigate([`film/${this.film.id}`]);
    window.scroll(0,0);
    this.router.navigateByUrl(`/film/${this.film.id}/episodes/0`, { skipLocationChange: true }).then(() => {
      this.router.navigate([`/film/${this.film.id}`]);
    }); 
    // this.player.source = {
    //   type: 'video',
    //   sources:[
    //     {
    //       src: url
    //     }
    //   ]
    // }
  }

  get_trailer_url(){
    return this.sanitizer.bypassSecurityTrustUrl(this.film.meta_data.trailer_url)
  }

  handleSubmit(){
    // this.comment_service.a
  }

  add_favorite(){
  }

  remove_favorite(){
    
  }

  send_rating(score:number){
    
  }

}
