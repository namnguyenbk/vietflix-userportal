import { Component, OnInit, OnDestroy } from '@angular/core';
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
export class DetailedFilmComponent implements OnInit, OnDestroy {

  initLoading = true; // bug
  loadingMore = false;

  film_id: number;
  film: any;

  score = 0 ;
  temp_score;

  me: any;

  is_logged = false;

  list_comments = [];
  slice_comments = [];

  current_episode = localStorage.getItem('video_id');
  // current_video_url : string;

  is_love = false;

  comment: string;
  submitting= false;
  public player;
  public player2;

  current_video_url = localStorage.getItem('video_url');

  visible_comment = false;

  share_link = ""

  trailer = true;

  episode = 0;

  similarFilm =[];

  video_size = {
    'max-height': '600px'
  };

  body_style = {
    padding: '5px',
    color: 'white',
    'background-color': 'rgb(20,20,20)',
    border: '1px'
  }

  start_time = 0;


  
  constructor(private route: ActivatedRoute, private film_service: FilmService, private comment_service: CommentService,
    private modalService: NzModalService, private user_service: UserService, private router: Router,
    public sanitizer : DomSanitizer, private message: NzMessageService) { 
      let is_continue_watching = this.route.snapshot.queryParamMap.get("continue_watching")
      if(is_continue_watching){
        console.log('is', is_continue_watching);
        this.current_episode = this.route.snapshot.queryParamMap.get("episode")
        this.start_time = parseInt(this.route.snapshot.queryParamMap.get("time"))
      }

      this.film_id = parseInt(this.route.snapshot.paramMap.get("film_id"));
      this.episode = parseInt(this.route.snapshot.queryParamMap.get("episodes"));
    this.film_service.get_film(this.film_id).subscribe((res:any)=>{
      this.film = res
      this.film.meta_data = JSON.parse(res.meta_data);
      this.film.episodes = JSON.parse(res.episodes);
      this.is_love = this.film.favorite;
      this.score = this.film.score;
      this.is_logged = true;
      this.share_link = this.get_share_link(this.film.id)
      window.scroll(0,0);
      this.film.meta_data.trailer_url = "https://www.youtube-nocookie.com/embed/" + this.film.meta_data.trailer_url


      if(this.film.video_url && this.film.type == "1"){
        this.current_video_url = this.film.video_url;
      }else{
        if(!is_continue_watching){
          this
          .current_video_url = this.film.episodes[0]['video_url'];
        }

      }

      // if(this.film.type == "1"){
      //   if(localStorage.getItem('video_url') != this.film.video_url){
      //     localStorage.setItem('video_url', this.film.video_url)
      //     this.router.navigateByUrl(`/film/${this.film.id}/episodes/0`, { skipLocationChange: true }).then(() => {
      //       this.router.navigate([`/film/${this.film.id}`]);
      //     }); 
      //   }
      // }else{
      // }

      this.comment_service.get_comments(this.film.id).subscribe((res: any) => {
        this.list_comments = res;
        this.slice_comments = this.list_comments.slice(0, 10)
        this.initLoading = false;
      }, error=>{console.log('errrprprpr')});

      this.user_service.get_me().subscribe((res:any)=>{
        this.me = res;
        this.temp_score = this.score;
        this.film_service.view(this.film.id, this.me.id).subscribe(res=>{window.scroll(0,0);}, error=>{window.scroll(0,0);});    
      }, error=>{
        this.is_logged = false;
        this.film_service.view(this.film.id, null).subscribe(res=>{window.scroll(0,0);}, error=>{window.scroll(0,0);}); 
      });

      this.film_service.get_similar_films(this.film.id).subscribe((res:any)=>{
        this.similarFilm = res;
      }); 

    }, error =>{
      this.film_service.get_film_non_user(this.film_id).subscribe((res:any)=>{
        this.film = res;
        this.film.meta_data = JSON.parse(res.meta_data);
        this.film.episodes = JSON.parse(res.episodes);
        this.film.meta_data.trailer_url = "https://www.youtube-nocookie.com/embed/" + this.film.meta_data.trailer_url
        this.is_logged = false;
      })
    });
      
    }

  ngOnDestroy(): void {
    if(this.player){
      

    let remaining_watching_time = this.player.currentTime;
    console.log('Remaining watching time: ', remaining_watching_time, remaining_watching_time > 120);

    if(parseInt(remaining_watching_time) > 0){
      let activity = {
        user_id: this.me.id,
        film_id: this.film.id,
        name: 'watching',
        data: remaining_watching_time,
        meta_data: JSON.stringify({
          episode: this.current_episode,
          duration: this.player.duration,
          video_url: this.current_video_url
        })
      }

      // alert(localStorage.getItem('video_url') )

      localStorage.setItem(`setting_continue`, 'true')

      // async function send_activity(){
      //   await this.film_service.remaining_watching_time(activity).toPromise().then(
      //     (res: any)=>{
      //       console.log(1)
      //     }, error => {this.message.create('error', error.error.error_message);}
      //   )
      // }

      // send_activity();
      // console.log('fejhje')

      this.film_service.remaining_watching_time(activity).subscribe(res=>{
        localStorage.setItem(`setting_continue`, 'false');
      }, error=>{
        this.message.create('error', error.error.error_message);
      });  

    }
  }
  }

  ngOnInit() {
    window.scroll(0,0);
    this.player = new Plyr('#plyrID', { 
      captions: { active: true }
    });


    this.player.on('play', event => {
      this.trailer = false;
      if(!localStorage.getItem('access_token')){
        this.router.navigate(['/login']);
      }

      if(this.start_time > 0){
        let start_time = this.start_time.toFixed(2)
        this.player.currentTime = this.start_time;
        this.start_time = 0;
        this.player.play()
      }

    });

    this.player.on('pause', event => {
      this.trailer = true;
    });

    this.player.on('enterfullscreen', event =>{
      this.video_size = {
        'max-height': '100%'
      }
    });

    this.player.on('exitfullscreen', event =>{
      this.video_size = {
        'max-height': '600px'
      }
    });

          // this.player2 = new Plyr('#plyrID2', { 
      //   captions: { active: true }
      // });
      // this.player2.source = {
      //   type: 'video',
      //   sources: [
      //     {
      //       src: this.film.meta_data.trailer_url,
      //       provider: 'youtube',
      //     },
      //   ],
      // };
  }

  onLoadMore(): void {
    this.slice_comments = this.list_comments.slice(0, this.slice_comments.length+10)
  }

  change_episode(id: string, url: string){
    this.current_video_url = url;
    // localStorage.setItem('video_url', url);
    // localStorage.setItem('video_id', id);
    window.scroll(0,0);
    // this.router.navigateByUrl(`/film/${this.film.id}/episodes/0`, { skipLocationChange: true }).then(() => {
    //   this.router.navigate([`/film/${this.film.id}`]);
    // }); 
  }

  get_trailer_url(){
    return this.sanitizer.bypassSecurityTrustUrl(this.film.meta_data.trailer_url)
  }

  handleSubmit(){
    this.comment_service.add_comment(this.comment, this.film.id).subscribe((res:any)=>{
      res.username = this.me.name
      res.date_in_word = '< 1 phút'
      this.list_comments.push(res);
      this.comment = null
      this.slice_comments = this.list_comments.slice(0,10)
    })
  }

  add_favorite(){
    this.is_love = true;
    this.film_service.add_wishlist(this.film_id).subscribe(res=>{
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
    let activity = {
      user_id: this.me.id,
      film_id: this.film.id,
      name: 'rate',
      data: score
    }
    this.score = score;
    this.temp_score = score;
    this.film_service.send_activity(activity).subscribe(res=>{
      // this.message.create('success', `Đã lưu ${this.film.name} vào yêu thích`);
    }, error=>{
      this.message.create('error', error.error.error_message);
    });    
  }


  delete_comment(comment_id:number){
    this.list_comments = this.list_comments.filter(function(value, index, arr){ return value.id != comment_id;});
      this.slice_comments = this.list_comments.filter(function(value, index, arr){ return value.id != comment_id;});
    this.comment_service.delete_comments(comment_id).subscribe(res=>{
    });
  }

  open_comment(){
    this.slice_comments = this.list_comments.slice(0, this.slice_comments.length+10)
    this.visible_comment = true;
  }

  close_comment(){
    this.visible_comment = false;
  }

  get_share_link(film_id){
    return `https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fvietflix-userportal.herokuapp.com%2Ffilm%2F${film_id}&amp;src=sdkpreparse`
  }

  view_detail(film_id, url:string){
    localStorage.setItem('video_url', url);
    localStorage.setItem('video_id', '1');

    this.router.navigateByUrl(`/film/${film_id}/episodes/1`, { skipLocationChange: true }).then(() => {
      this.router.navigate([`/film/${film_id}`]);
    }); 
  }

}
