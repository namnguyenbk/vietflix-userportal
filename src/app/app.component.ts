import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as Plyr from 'plyr';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { NzNotificationService } from 'ng-zorro-antd';
import { FilmService } from './services/film.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  @ViewChild('app_content', { static: false }) myDiv: ElementRef;

  public player;
  me:any;

  is_show_change_info =false;
  is_show_change_password =false;

  isLoadingInfo = false;
  isLoadingToken = false;
  isLoadingPass = false;

  username : string;

  change_info_form: FormGroup;
  is_change_email;

  tokenForm: FormGroup;
  show_token_error :boolean;
  isTokenPass : boolean;
  waiting_token = false;
  new_email: string;

  change_passwors_form: FormGroup;

  is_view_info =  false;

  inputValue: string;
  filteredOptions: string[] = [];
  options = ['Titanic', 'Game of thrones', 'David Copperfield', 'Harry Potter'];


  is_logged : boolean
  constructor(public router: Router, private fb: FormBuilder, private auth_service: AuthService, private film_service : FilmService,
    private notification: NzNotificationService, private user_services: UserService){
    if(localStorage.getItem('access_token')){
      this.is_logged = true;
    }

    this.user_services.get_me().subscribe((res:any)=>{
      if(res.status == 'not_verified'){
        this.router.navigate(['login']);
      }

      if(res.status == 'blocked'){
        this.router.navigate(['login']);
      }

      this.me = res;
      this.is_logged = true;

      this.change_info_form = this.fb.group({
        email: [this.me.email, [Validators.email, Validators.required]],
        name: [this.me.name, [Validators.required]],
        password: [null, [Validators.required]],
      });
  
      this.tokenForm = this.fb.group({
        token: [null, [Validators.required]],
      });
    
      this.change_passwors_form = this.fb.group({
        old_password: [null, [Validators.required]],
        new_password: [null, [Validators.required]],
        renew_password: [null, [Validators.required]],
      }); 
    }, error =>{
      localStorage.clear();
      // this.router.navigate(['login']);
    }); 

  }
  ngOnInit(): void {
    this.player = new Plyr('#plyrID', { captions: { active: true } });

  }
  title = 'vietflix-userportal';

  onActivate(event){
    this.myDiv.nativeElement.scrollTo( 0, 0 );
    if(event.constructor.name != "LoginComponent"){
      this.user_services.get_me().subscribe(res=>{
        this.me =res;
        if(this.me.status == 'blocked'){
          this.me = null;
          this.is_logged = false;
          localStorage.removeItem('access_token')
          this.router.navigate(['login']);
        }
      })
    }
  }

  logout(){
    this.me = null;
    this.is_logged = false;
    localStorage.removeItem('access_token');
    this.router.navigate['login'];
    location.reload()

  }

  open_change_info(){
    if(this.waiting_token){
      this.isTokenPass = true;
      return;
    }
    this.is_show_change_info = true;
  }

  open_change_password(){
    this.is_show_change_password = true;
  }

  infoCancel(){
    this.is_show_change_info = false;
  }

  infoOk(){
    for (const i in this.change_info_form.controls) {
      this.change_info_form.controls[i].markAsDirty();
      this.change_info_form.controls[i].updateValueAndValidity();
    }
    if(this.change_info_form.invalid){
      // this.change_info_form.setErrors({'incorrect': true})
      return;
    }
    var email = this.change_info_form.controls['email'].value;
    var name = this.change_info_form.controls['name'].value;
    var password = this.change_info_form.controls['password'].value;
    this.isLoadingInfo = true;
    this.user_services.update(this.me.id, {'email': email, 'name': name, 'password': password}).subscribe(res=>{
      this.change_info_form.controls['password'].reset();
      this.show_token_error = false;
      this.is_show_change_info = false;
      if(email != this.me.email){
        this.is_change_email = true;
        this.isTokenPass = true;
        this.waiting_token = true;
        this.user_services.get_me().subscribe(res=>{
          this.me =res;
          this.new_email = email;
          this.isLoadingInfo = false;
        });
      }else{
        this.user_services.get_me().subscribe(res=>{
          this.me =res;
          this.isLoadingInfo = false;
        });
        this.notification.create('success', 'Thành công', 'Đã cập nhật thông tin');
      }
    }, error=>{
      this.change_info_form.controls['password'].reset();
      this.isLoadingInfo = false;
      this.notification.create('error', 'Thất bại', `${error.error.error_message}`);
    })
  }

  handleCancelToken(){
    this.isTokenPass = false;
  }

  handleOkToken(){
    for (const i in this.tokenForm.controls) {
      this.tokenForm.controls[i].markAsDirty();
      this.tokenForm.controls[i].updateValueAndValidity();
    }

    var token = this.tokenForm.controls['token'].value;

    if(this.tokenForm.controls['token'].invalid){
      return 0;
    }

    this.isLoadingToken = true;
    this.auth_service.check_verification_code(this.me.email, token, this.new_email).subscribe(
      (res : any) =>{
        this.isLoadingToken = false;
        this.isTokenPass = false;
        this.waiting_token = false;
        this.tokenForm.reset()
        this.notification.create('success', 'Thành công', 'Đã cập nhật thông tin')        
    },

      (error) => {
        this.isLoadingToken = false;
        this.show_token_error = true;
    }
    );
  }

  passCancel(){
    this.change_passwors_form.reset();
    this.is_show_change_password = false;
  }

  passOk(){
    for (const i in this.change_passwors_form.controls) {
      this.change_passwors_form.controls[i].markAsDirty();
      this.change_passwors_form.controls[i].updateValueAndValidity();
    }

    var old_password = this.change_passwors_form.controls['old_password'].value; 
    var new_password = this.change_passwors_form.controls['new_password'].value; 
    var renew_password = this.change_passwors_form.controls['renew_password'].value;

    if(new_password != renew_password){
      this.change_passwors_form.controls['renew_password'].setErrors({'incorrect': true})
      return 0;
    }

    this.isLoadingPass = true;
    this.auth_service.change_pass(this.me.email, new_password, old_password).subscribe(res=>{
      this.isLoadingPass = false;
      this.notification.create('success', 'Thành công', 'Đã cập nhật thông tin');
      this.is_show_change_password = false;
      this.change_passwors_form.reset();
    }, error=>{
      this.isLoadingPass = false;
      this.notification.create('error', 'Thất bại', `${error.error.error_message}`);
    })
  }

  open_info(){
    this.is_view_info = true;
  }

  onChange(value: string): void {
    this.filteredOptions = value? this.options.filter(option => option.toLowerCase().includes(value.toLowerCase())): [];
  }

  search(){
    if(this.inputValue){
      window.scroll(0,0);
      this.router.navigateByUrl(`/loading`, { skipLocationChange: true }).then(() => {
      this.router.navigate([`search`], {queryParams: {key: this.inputValue}});
      this.inputValue = null;
    });
    }
  }

  open_my_list(){
    this.router.navigate(['my-list'])
  }

  reload_home(){
    this.router.navigateByUrl(`/loading`, { skipLocationChange: true }).then(() => {
      this.router.navigate([`home`], {queryParams: {type: 'reload'}});
    });
  }
}
