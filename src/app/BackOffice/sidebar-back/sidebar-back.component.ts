import { Component, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/_services/auth.service';
import { StorageService } from 'src/app/_services/storage.service';
import { Router } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-sidebar-back',
  templateUrl: './sidebar-back.component.html',
  styleUrls: ['./sidebar-back.component.css']
})
export class SidebarBackComponent {
  @ViewChild('sidenav') sidenav!: MatSidenav;

  
  isDashboardListExpanded = false;
  user = false;
  wallet = false;
  resource = false;
  stock = false;
  fournisseur = false;
  commande = false ;
  reclamation = false ;
  absences = false;
  listAbsences = false;
  conge = false;
  contrat=false;
  employe = false;
  departement = false;
  Salaires = false;

  constructor(
    private authService: AuthService,
    private storageService: StorageService,
    private router: Router
) {}
  Projects = false;
  toggleContratEmployeList() {
    this.contrat = !this.contrat;
  }
  toggleSalairesList() {
    this.Salaires = !this.Salaires;
  }
  toggleAbsences() {
    this.absences = !this.absences;
  }
  toggleConges() {
    this.conge = !this.conge;
  }
  toggleListAbsences() {
    this.listAbsences = !this.listAbsences;
  }
  toggleDepartementList() {
    this.departement = !this.departement;
  }
  toggleEmployeList(){
    this.employe = !this.employe;
  }

  toggleProjectsList(){
    this.Projects = !this.Projects;
  }
  // Function to toggle the Dashboard list expansion
  toggleDashboardList() {
    this.isDashboardListExpanded = !this.isDashboardListExpanded;
  }
  toggleUserList() {
    this.user = !this.user;
  }

  toggleReclamationList() {
    this.reclamation = !this.reclamation;
  }

  toggleStockList() {
    this.stock = !this.stock;
  }

  toggleResourceList() {
    this.resource = !this.resource;
  }

  toggleFournisseurList() {
    this.fournisseur = !this.fournisseur;
  }
  
  toggleCommandeList() {
    this.commande = !this.commande;
  }
  togglewalletList(){
    this.wallet = !this.wallet;
  }


  // Implémentez canActivate pour vérifier si l'utilisateur est connecté
 canActivate(): boolean {
  const currentUser = this.storageService.getUser();
  console.log("Current user:", currentUser);

  if (!currentUser) {
      console.log("User not logged in. Redirecting to /accueil/login");
      this.router.navigate(['/accueil/login']);
      return false;
  }
  
  const roles = currentUser.roles;
  console.log("User roles:", roles);

  if (!roles.includes('ROLE_ADMIN')) {
      console.log("User is not admin. Redirecting to /accueil");
      this.router.navigate(['/accueil']);
      return false;
  }

  
  return true;
}



  // ngOnInit pour toute initialisation supplémentaire
  ngOnInit(): void {
      const currentUser = this.storageService.getUser();

      // Vérifiez si l'utilisateur est connecté
      if (!currentUser) {
          // Redirigez l'utilisateur non connecté vers /accueil
          this.router.navigate(['/accueil']);
      } else {
          // Obtenez les rôles de l'utilisateur
          const roles = currentUser.roles;

          // Vérifiez si l'utilisateur a le rôle d'admin
          const isAdmin = roles.includes('ROLE_ADMIN');
          
          // Si l'utilisateur n'est pas admin, redirigez-le vers /accueil
          if (!isAdmin) {
              this.router.navigate(['/accueil']);
          }
      }
  }


  // Vérifie si la route est active
  isRouteActive(route: string): boolean {
      return this.router.isActive(route, true);
  }

  // Fonction de déconnexion
  signout(): void {
      // Supprimez le jeton d'authentification
      this.authService.logout().subscribe(() => {
          this.storageService.clean();
          // Redirigez l'utilisateur vers /accueil
          this.router.navigate(['/accueil']);
      });
  }

  // Fonction pour basculer le sidenav
  toggle(): void {
      this.sidenav.toggle();
  }
}