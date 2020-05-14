import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.css']
})
export class VerifyComponent implements OnInit {

  tokenForm: FormGroup;
  show_token_error :boolean;
  isTokenPass : boolean;

  isLoading_resend = false;
  isLoading_checkToken = false;

  current_email:string;

  constructor(private fb: FormBuilder, private auth_service: AuthService, public router: Router,
    private notification: NzNotificationService) { }

  ngOnInit() {

    this.tokenForm = this.fb.group({
      token: [null, [Validators.required]],
    });

    this.current_email = localStorage.getItem('email_verify')
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
    this.auth_service.check_reset_password(localStorage.getItem('email_verify'), token, '').subscribe(
      (res : any) =>{
        this.isLoading_checkToken = false;
        this.isTokenPass = false;
        localStorage.setItem('access_token', localStorage.getItem('access_token'))
        this.router.navigate(['../']);
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
