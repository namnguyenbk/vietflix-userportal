import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { NzNotificationService } from 'ng-zorro-antd';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  validateForm: FormGroup;
  show_error: boolean;
  step = 1
  is_blocked = false;

  email_reset: string;
  resetpassForm: FormGroup;
  show_reset_error :boolean;
  isVisibleResetPass : boolean;

  tokenForm: FormGroup;
  show_token_error :boolean;
  isTokenPass : boolean;

  enterForm: FormGroup;
  show_enter_error :boolean;
  isEnterPass : boolean;

  isLoading_login = false;
  isLoading_reset = false;
  isLoading_change = false;
  isLoading_resend = false;
  isLoading_checkToken = false;

  constructor(private fb: FormBuilder, private auth_service: AuthService, public router: Router,
    private notification: NzNotificationService) {
  }

  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    var email = this.validateForm.controls['email'].value;
    var password = this.validateForm.controls['password'].value;

    this.isLoading_login = true;
    this.auth_service.login(email, password).subscribe(
      (res : any) =>{
        this.show_error = false;
        this.isLoading_login = false;
        if(res.user.status == 'not_verified'){
          localStorage.setItem('email_verify', email)
          this.router.navigate(['verify'])
          return ;
        }
        if(res.user.status == 'blocked'){
          this.is_blocked = true;
          return;
        }else{
          this.router.navigate(['../'])
          localStorage.setItem('access_token', res.access_token)
        }
    },

      (error) => {
        this.isLoading_login = false
        this.show_error = true;
    }
    );
  }

  open_modal_reset(){
    if(this.step == 2){
      this.open_modal_enter();
      return ;
    }
    if(this.email_reset != ""){
      this.open_modal_token()
    }else{
      this.isVisibleResetPass = true;
    }
  }

  handleCancelResetPass(){
    this.isVisibleResetPass = false;
  }

  handleOkResetPass(){
    for (const i in this.resetpassForm.controls) {
      this.resetpassForm.controls[i].markAsDirty();
      this.resetpassForm.controls[i].updateValueAndValidity();
    }

    var email = this.resetpassForm.controls['email'].value;

    if(this.resetpassForm.controls['email'].invalid){
      return 0;
    }

    this.isLoading_reset = true
    this.auth_service.reset_password(email).subscribe(
      (res : any) =>{
        this.isLoading_reset = false;
        this.show_reset_error = false;
        this.isVisibleResetPass = false;
        this.email_reset = email;
        this.isTokenPass = true;
    },

      (error) => {
        this.isLoading_reset = false;
        this.show_reset_error = true;
        this.isVisibleResetPass = true;
    }
    );
  }

  open_modal_token(){
    this.isTokenPass = true;
  }

  handleCancelToken(){
    this.show_reset_error = false;
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

    this.isLoading_checkToken = true;
    this.auth_service.check_reset_password(this.email_reset, token, '').subscribe(
      (res : any) =>{
        this.isLoading_checkToken = false;
        this.step = 2;
        this.show_reset_error = false;
        this.isTokenPass = false;
        this.open_modal_enter();
    },

      (error) => {
        this.isLoading_checkToken = false;
        this.show_token_error = true;
    }
    );
  }


  open_modal_enter(){
    this.isEnterPass = true;
  }

  handleCancelEnter(){
    this.show_enter_error = false;
    this.isEnterPass = false;
  }

  handleOkEnter(){
    for (const i in this.enterForm.controls) {
      this.enterForm.controls[i].markAsDirty();
      this.enterForm.controls[i].updateValueAndValidity();
    }

    var pass = this.enterForm.controls['pass'].value;
    var re_pass = this.enterForm.controls['re_pass'].value;

    if(this.enterForm.controls['pass'].invalid || this.enterForm.controls['re_pass'].invalid){
      return 0;
    }
    if(pass != re_pass){
      this.enterForm.controls['re_pass'].setErrors({'incorrect': true})
      return 0;
    }

    this.isLoading_change =  true;
    this.auth_service.change_pass(this.email_reset, pass, 'no').subscribe(
      (res : any) =>{
        this.isLoading_change =  false;
        this.step = 3;
        this.show_enter_error = false;
        this.isEnterPass = false;
        this.notification.create(
          'success',
          'Thành công',
          'Mật khẩu của tài khoản đã được thay đổi.'
        );
        this.tokenForm.reset();
        this.email_reset = ""
    },

      (error) => {
        this.isLoading_change =  false;
        this.show_enter_error = true;
    }
    );
  }


  ngOnInit(): void {
    this.show_error = false;
    this.validateForm = this.fb.group({
      email: [null, [Validators.email]],
      password: [null, [Validators.required]],
    });

    this.email_reset = ""
    this.isVisibleResetPass = false;
    this.show_reset_error = false;

    this.isTokenPass = false;
    this.show_token_error = false;

    this.isEnterPass = false;
    this.show_enter_error = false;

    this.resetpassForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
    });

    this.tokenForm = this.fb.group({
      token: [null, [Validators.required]],
    });

    this.enterForm = this.fb.group({
      pass: [null, [Validators.required]],
      re_pass: [null, [Validators.required]],
    });
  }

  resend_email(){
    this.isLoading_resend = true;
    this.auth_service.reset_password(this.email_reset).subscribe(
      (res : any) =>{
        this.isLoading_resend = false;
    },

      (error) => {
        this.isLoading_resend = false;
    }
    );
  }

}
