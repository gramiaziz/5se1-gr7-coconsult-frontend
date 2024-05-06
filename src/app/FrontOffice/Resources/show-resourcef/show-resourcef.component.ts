import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Resources } from 'src/app/BackOffice/Resources/resources.model';
import { ResourcesService } from 'src/app/BackOffice/Resources/resources.service';

@Component({
  selector: 'app-show-resourcef',
  templateUrl: './show-resourcef.component.html',
  styleUrls: ['./show-resourcef.component.css']
})
export class ShowResourcefComponent implements OnInit {

  resources: Resources[] = [];
  resourceImages: Map<number, string> = new Map<number, string>();
  p: number = 1;
  searchText: string = '';

  constructor(private resourceservice: ResourcesService, private router: Router) {}

  ngOnInit(): void {
    this.resourceservice.getResources().subscribe((datas: Resources[]) => {
      this.resources = datas;
      this.loadResourceImages();
    });
  }

  loadResourceImages(): void {
    this.resources.forEach(resource => {
      this.resourceservice.getResourceImage(resource.resourceID).subscribe(image => {
        const reader = new FileReader();
        reader.onload = () => {
          this.resourceImages.set(resource.resourceID, reader.result as string);
        };
        reader.readAsDataURL(image);
      });
    });
  }

  removeResource(id: number): void {
    this.resourceservice.removeResource(id).subscribe(() => {
      this.resourceservice.getResources().subscribe((datas: Resources[]) => {
        this.resources = datas;
        this.loadResourceImages();
      });
    });
  }

  updateResource(resource: Resources): void {
    this.resourceservice.updateResource(resource).subscribe(
      updatedResource => {
        console.log('Resource updated successfully:', updatedResource);
        this.resourceservice.getResources().subscribe((datas: Resources[]) => {
          this.resources = datas;
          this.loadResourceImages();
        });
      },
      error => {
        console.error('Error updating resource:', error);
      }
    );
  }

  editResource(resource: Resources): void {
    console.log('Edit button clicked for resource:', resource);
    this.router.navigate(['/accueil/editResource', resource.resourceID]);
  }
}