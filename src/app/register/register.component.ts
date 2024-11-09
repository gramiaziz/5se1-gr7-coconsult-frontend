import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  form: any = {
    username: null,
    email: null,
    password: null,
    image: null,
    role: 'employee'
  };
  qrCodeUri: string = '';

  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';


  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }
 
 
  handleFileInput(event: any) {
    const file = event.target.files[0];
    this.form.image = file;
  }
  onSubmit(): void {
    const { username, email, password, image, role} = this.form;
  this.authService.register(username, email, password, image,role).subscribe({
    next: (response: any) => {
      console.log(response);
      this.qrCodeUri = response.body.qrCodeUri; // Assurez-vous que qrCodeUri est correctement défini
      this.isSuccessful = true;
      this.isSignUpFailed = false;
    },
    error: (error: any) => {
      console.error('Erreur lors de l\'inscription :', error);
      this.errorMessage = error.error.message;
      this.isSignUpFailed = true;
    }
  });
} 
  
 
}
