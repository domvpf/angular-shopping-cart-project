import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  loginForm: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder,
              private router: Router,
              private authService: AuthService,
              private messageService: MessageService
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', Validators.required]
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit = () => {
    this.submitted = true;
    const { username, password } = this.loginForm.getRawValue();
  
    if(this.loginForm.invalid) {
      return;
    }
    
    this.authService.getUserByUsername(username as string).subscribe(
      response => {
        if(response.length > 0 && response[0].password === password) {
          sessionStorage.setItem('username', username as string);
          sessionStorage.setItem('first_name', response[0].first_name as string);
          sessionStorage.setItem('last_name', response[0].last_name);
          sessionStorage.setItem('is_admin', String(response[0].is_admin))
          console.log(sessionStorage.getItem('is_admin'))

          if(response[0].is_admin){
            this.router.navigate(['/admin']);
          } else{
            this.router.navigate(['/home']);
          }

        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Username or password is incorrect' });
        }
      },
      error => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error in logging in' });
      }
    )
  }

}
