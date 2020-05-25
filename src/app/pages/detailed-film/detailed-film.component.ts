import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FilmService } from 'src/app/services/film.service';
import { CommentService } from 'src/app/services/comment.service';
import { UserService } from 'src/app/services/user.service';
import { NzModalService, NzNotificationService, NzMessageService } from 'ng-zorro-antd';
import { DomSanitizer } from '@angular/platform-browser';
import * as Plyr from 'plyr';

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

  score = 0;
  temp_score;

  me: any;

  is_logged = false;

  list_comments = [];
  slice_comments = [];

  current_episode = 1;
  current_video_url: any;

  is_love = false;

  comment: string;
  submitting = false;
  public player;
  public player2;


  visible_comment = false;

  share_link = ""

  trailer = true;

  episode = 0;

  similarFilm = [];

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

  constructor(
    private elRef: ElementRef, private route: ActivatedRoute,
    private film_service: FilmService, private comment_service: CommentService,
    private modalService: NzModalService, private user_service: UserService,
    private router: Router, public sanitizer: DomSanitizer, private message: NzMessageService) {
  }

  ngOnDestroy(): void {
    if (this.player) {
      let remaining_watching_time = this.player.currentTime;
      console.log('Remaining watching time: ', remaining_watching_time, remaining_watching_time > 120);

      if (parseInt(remaining_watching_time) > 0) {
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

        localStorage.setItem(`setting_continue`, 'true')
        this.film_service.remaining_watching_time(activity).subscribe(res => {
          localStorage.setItem(`setting_continue`, 'false');
        }, error => {
          this.message.create('error', error.error.error_message);
        });

      }
    }
  }

  ngOnInit() {

    let is_continue_watching = this.route.snapshot.queryParamMap.get("continue_watching")
    if (is_continue_watching) {
      this.start_time = parseInt(this.route.snapshot.queryParamMap.get("time"))
    }

    this.film_id = parseInt(this.route.snapshot.paramMap.get("film_id"));
    this.current_episode = parseInt(this.route.snapshot.paramMap.get("episodes"));

    this.film_service.get_film(this.film_id).subscribe((res: any) => {
      this.film = res
      this.film.meta_data = JSON.parse(res.meta_data);
      this.film.episodes = JSON.parse(res.episodes);
      this.is_love = this.film.favorite;
      this.score = this.film.score;
      this.is_logged = true;
      this.share_link = this.get_share_link(this.film.id)
      this.film.meta_data.trailer_url = "https://www.youtube-nocookie.com/embed/" + this.film.meta_data.trailer_url;

      if (this.film.type == 2) {
        this.current_video_url = this.episode[this.current_episode].video_url
      }

      this.player = new Plyr('#plyrID', {
        captions: { active: true }
      });
      this.player.load();
      this.player.on('play', event => {
        this.trailer = false;
        if (!this.me) {
          this.router.navigate(['/login']);
        }

        if (this.start_time > 0) {
          this.player.currentTime = this.start_time;
          this.start_time = 0;
          this.player.play()
        }

      });

      this.player.on('pause', event => {
        this.trailer = true;
      });

      this.player.on('enterfullscreen', event => {
        this.video_size = {
          'max-height': '100%'
        }
      });

      this.player.on('exitfullscreen', event => {
        this.video_size = {
          'max-height': '600px'
        }
      });


      this.user_service.get_me().subscribe((res: any) => {
        this.me = res;
        this.temp_score = this.score;
        this.film_service.view(this.film.id, this.me.id).subscribe(res => { window.scroll(0, 0); }, error => { window.scroll(0, 0); });
      }, error => {
        this.is_logged = false;
        this.film_service.view(this.film.id, null).subscribe(res => { window.scroll(0, 0); }, error => { window.scroll(0, 0); });
      });

      this.film_service.get_similar_films(this.film.id).subscribe((res: any) => {
        this.similarFilm = res;
      });


    }, error => {
      this.film_service.get_film_non_user(this.film_id).subscribe((res: any) => {
        this.film = res;
        this.film.meta_data = JSON.parse(res.meta_data);
        this.film.episodes = JSON.parse(res.episodes);
        this.film.meta_data.trailer_url = "https://www.youtube-nocookie.com/embed/" + this.film.meta_data.trailer_url
        this.is_logged = false;
      })
    });
  }

  onLoadMore(): void {
    this.slice_comments = this.list_comments.slice(0, this.slice_comments.length + 10)
  }

  change_episode(id: string, url: string) {
    this.current_video_url = url
    this.player.load()
    this.router.navigate([`/film/${this.film.id}?episode`]);
  }

  get_trailer_url() {
    return this.sanitizer.bypassSecurityTrustUrl(this.film.meta_data.trailer_url)
  }

  handleSubmit() {
    this.comment_service.add_comment(this.comment, this.film.id).subscribe((res: any) => {
      res.username = this.me.name
      res.date_in_word = '< 1 phút'
      this.list_comments.push(res);
      this.comment = null
      this.slice_comments = this.list_comments.slice(0, 10)
    })
  }

  add_favorite() {
    this.is_love = true;
    this.film_service.add_wishlist(this.film_id).subscribe(res => {
      this.is_love = true;
    }, error => {
      this.message.create('error', error.error.error_message);
    });
  }

  remove_favorite() {
    this.is_love = false;
    this.film_service.del_wishlist(this.film.id).subscribe((res: any) => {
    });
  }

  send_rating(score: number) {
    let activity = {
      user_id: this.me.id,
      film_id: this.film.id,
      name: 'rate',
      data: score
    }
    this.score = score;
    this.temp_score = score;
    this.film_service.send_activity(activity).subscribe(res => {
    }, error => {
      this.message.create('error', error.error.error_message);
    });
  }


  delete_comment(comment_id: number) {
    this.list_comments = this.list_comments.filter(function (value, index, arr) { return value.id != comment_id; });
    this.slice_comments = this.list_comments.filter(function (value, index, arr) { return value.id != comment_id; });
    this.comment_service.delete_comments(comment_id).subscribe(res => {
    });
  }

  open_comment() {
    this.visible_comment = true;
    this.comment_service.get_comments(this.film.id).subscribe((res: any) => {
      this.list_comments = res;
      this.initLoading = false;
      this.slice_comments = this.list_comments.slice(0, this.slice_comments.length + 10)
    }, error => { console.log('errrprprpr') });
  }

  close_comment() {
    this.visible_comment = false;
  }

  get_share_link(film_id) {
    return `https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fvietflix-userportal.herokuapp.com%2Ffilm%2F${film_id}&amp;src=sdkpreparse`
  }

  view_detail(film_id, url: string) {
    localStorage.setItem('video_url', url);
    localStorage.setItem('video_id', '1');

    this.router.navigateByUrl(`/film/${film_id}/episodes/1`, { skipLocationChange: true }).then(() => {
      this.router.navigate([`/film/${film_id}`]);
    });
  }

}
