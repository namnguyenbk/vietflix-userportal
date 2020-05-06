import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FilmService } from 'src/app/services/film.service';
import { CommentService } from 'src/app/services/comment.service';
import { UserService } from 'src/app/services/user.service';
import { NzModalService, NzNotificationService, NzMessageService } from 'ng-zorro-antd';
import { DomSanitizer } from '@angular/platform-browser';
import * as Plyr from 'plyr';
import { distanceInWords } from 'date-fns';
@Component({
  selector: 'app-detailed-film',
  templateUrl: './detailed-film.component.html',
  styleUrls: ['./detailed-film.component.css']
})
export class DetailedFilmComponent implements OnInit {

  initLoading = true; // bug
  loadingMore = false;

  film_id: number;
  film: any;

  score = 0 ;
  temp_score;

  me: any;

  list_comments = [];
  slice_comments = [];

  current_episode = localStorage.getItem('video_id');
  // current_video_url : string;

  is_love = false;

  comment: string;
  submitting= false;
  public player;

  current_video_url = localStorage.getItem('video_url');

  
  constructor(private route: ActivatedRoute, private film_service: FilmService, private comment_service: CommentService,
    private modalService: NzModalService, private user_service: UserService, private router: Router,
    public sanitizer : DomSanitizer, private message: NzMessageService) { 
      this.film_id = parseInt(this.route.snapshot.paramMap.get("film_id"));
    this.film_service.get_film(this.film_id).subscribe((res:any)=>{
      this.film = res
      this.film.meta_data = JSON.parse(res.meta_data);
      this.film.episodes = JSON.parse(res.episodes);
      this.is_love = this.film.favorite;
      this.score = this.film.score;

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

    this.user_service.get_me().subscribe((res:any)=>{
      this.me = res;
      this.temp_score = this.score;

      this.film_service.view(this.film.id).subscribe(res=>{});    
      this.comment_service.get_comments(this.film.id).subscribe((res: any) => {
        this.list_comments = res;
        this.slice_comments = this.list_comments.slice(0, 10)
        this.initLoading = false;
      });
    })
  }

  onLoadMore(): void {
    this.slice_comments = this.list_comments.slice(0, this.slice_comments.length+10)
  }

  change_episode(id: string, url: string){
    localStorage.setItem('video_url', url);
    localStorage.setItem('video_id', id);
    window.scroll(0,0);
    this.router.navigateByUrl(`/film/${this.film.id}/episodes/0`, { skipLocationChange: true }).then(() => {
      this.router.navigate([`/film/${this.film.id}`]);
    }); 
  }

  get_trailer_url(){
    return this.sanitizer.bypassSecurityTrustUrl(this.film.meta_data.trailer_url)
  }

  handleSubmit(){
    this.comment_service.add_comment(this.comment, this.film.id).subscribe((res:any)=>{
      res.username = this.me.name
      this.list_comments.push(res);
      this.comment = null
      this.slice_comments = this.list_comments.slice(0,10)
    })
  }

  add_favorite(){
    let rating = {
      user_id: this.me.id,
      film_id: this.film.id,
      type: 'favorite',
      data: 5
    }
    this.is_love = true;
    this.film_service.send_rating(rating).subscribe(res=>{
      // this.message.create('success', `Đã lưu ${this.film.name} vào yêu thích`);
      this.is_love = true;
    }, error=>{
      this.message.create('error', error.error.error_message);
    });
  }

  remove_favorite(){
    this.is_love = false;
    this.film_service.del_wishlist(this.film.id).subscribe((res:any)=>{
      // this.message.create('success', `Đã xoá ${this.film.name} khỏi yêu thích`);
    });
  }

  send_rating(score:number){
    let rating = {
      user_id: this.me.id,
      film_id: this.film.id,
      type: 'score',
      data: score
    }
    this.score = score;
    this.temp_score = score;
    this.film_service.send_rating(rating).subscribe(res=>{
      // this.message.create('success', `Đã lưu ${this.film.name} vào yêu thích`);
    }, error=>{
      this.message.create('error', error.error.error_message);
    });    
  }

  return_data(datetime){
    return distanceInWords(datetime, new Date())
  }

  delete_comment(comment_id:number){
    this.list_comments = this.list_comments.filter(function(value, index, arr){ return value.id != comment_id;});
      this.slice_comments = this.list_comments.filter(function(value, index, arr){ return value.id != comment_id;});
    this.comment_service.delete_comments(comment_id).subscribe(res=>{
    })
  }

}
