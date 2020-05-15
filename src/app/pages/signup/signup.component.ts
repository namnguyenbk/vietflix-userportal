import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  validateForm: FormGroup;
  show_error: boolean;
  current_email = null;
  access_token = null;

  error_message = null;

  tokenForm: FormGroup;
  show_token_error :boolean;
  isTokenPass : boolean;

  isLoading_login = false;
  isLoading_resend = false;
  isLoading_checkToken = false;
  
  constructor(private fb: FormBuilder, private auth_service: AuthService, public router: Router, private user_services: UserService,
    private notification: NzNotificationService) { 
      this.user_services.get_me().subscribe(res=>{
        this.router.navigate(['home'])
      });
    }

  ngOnInit() {

    this.validateForm = this.fb.group({
      name: [null, [Validators.required]],
      email: [null, [Validators.email]],
      password: [null, [Validators.required, Validators.minLength(6)]],
      re_password: [null, [Validators.required]],
    });

    this.tokenForm = this.fb.group({
      token: [null, [Validators.required]],
    });

  }

  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    var name = this.validateForm.controls['name'].value;
    var email = this.validateForm.controls['email'].value;
    var re_password = this.validateForm.controls['re_password'].value;
    var password = this.validateForm.controls['password'].value;

    if(password != re_password){
      this.validateForm.controls['re_password'].setErrors({'incorrect': true})
      return ;
    }

    this.isLoading_login = true;

    let account = {
      name: name,
      email: email,
      password: password
    }

    this.show_error = false;
    this.auth_service.signup(account).subscribe(
      (res : any) =>{
        this.open_modal_token();
        this.current_email = email;
        this.isLoading_login = false;
        this.show_error = false;
        this.access_token = res.access_token;
        localStorage.removeItem('access_token');
        localStorage.setItem('access_token', this.access_token)
        // this.auth_service.login(email, password).subscribe((res2:any)=>{
        //   this.show_error = false;
        //   this.isLoading_login = false;
        //   this.router.navigate(['../']);
        //   localStorage.setItem('access_token', res2.access_token);
        // })
        
    },

      (error) => {
        this.isLoading_login = false
        this.show_error = true;
        this.error_message = error.error.error_message;
    }
    );
  }

  open_modal_token(){
    this.isTokenPass = true;
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

    this.isLoading_checkToken = true;
    this.auth_service.check_reset_password(this.current_email, token, '').subscribe(
      (res : any) =>{
        this.isLoading_checkToken = false;
        this.isTokenPass = false;
        localStorage.setItem('access_token', this.access_token)
        this.router.navigate(['../']);
        location.reload()
    },

      (error) => {
        this.isLoading_checkToken = false;
        this.show_token_error = true;
    }
    );
  }

  resend_email(){
    this.isLoading_resend = true;
    this.auth_service.reset_password(this.current_email).subscribe(
      (res : any) =>{
        this.isLoading_resend = false;
    },

      (error) => {
        this.isLoading_resend = false;
    }
    );
  }


}
