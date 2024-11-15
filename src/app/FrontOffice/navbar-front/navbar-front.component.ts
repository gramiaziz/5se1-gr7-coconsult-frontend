import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { StorageService } from 'src/app/_services/storage.service'; 
import { AuthService } from 'src/app/_services/auth.service'; 
import { EventBusService } from 'src/app/_shared/event-bus.service'; 
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar-front',
  templateUrl: './navbar-front.component.html',
  styleUrls: ['./navbar-front.component.css']
})
export class NavbarFrontComponent {

  private roles: string[] = [];
  isLoggedIn = false;
  showAdminBoard = false;
  showModeratorBoard = false;
  username?: string;

  eventBusSub?: Subscription;
  currentUser: any;
  showforemploye: boolean = false;
  showmoderator: boolean = false;

  constructor(
    private storageService: StorageService,
    private authService: AuthService,
    private eventBusService: EventBusService,
    private router: Router

  ) { }

  ngOnInit(): void {
    console.log(this.username)
    this.isLoggedIn = this.storageService.isLoggedIn();

    // Si l'utilisateur est connecté, obtenir son rôle
    if (this.isLoggedIn) {
      const user = this.storageService.getUser();
      this.roles = user.roles;
      console.log(this.roles[0])
      this.username=user.username;
      // Vérifier si l'utilisateur a le rôle d'administrateur
      this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
      this.showforemploye = this.roles.includes('ROLE_EMPLOYEE') || this.roles.includes('ROLE_ADMIN');
      this.showmoderator = this.roles.includes('ROLE_MODERATOR') || this.roles.includes('ROLE_ADMIN');
    }

    // Abonnement à l'événement de déconnexion
    this.eventBusSub = this.eventBusService.on('logout', () => {
      this.logout();
    });
  }
  /*this.currentUser = this.storageService.getUser();

  this.isLoggedIn = this.storageService.isLoggedIn();

  if (this.isLoggedIn) {
    const user = this.storageService.getUser();
    this.roles = user.roles;

    this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
    this.showModeratorBoard = this.roles.includes('ROLE_MODERATOR');

    this.username = user.username;
  }

  this.eventBusSub = this.eventBusService.on('logout', () => {
    this.logout();
  });
}*/
logout(): void {
  this.authService.logout().subscribe({
    next: res => {
      console.log(res);
      this.storageService.clean();
      this.router.navigate(['/landingpage']);
    },
    error: err => {
      console.log(err);
    }
  });
}

}