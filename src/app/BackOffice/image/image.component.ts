import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Image } from 'src/app/core/models/image';
import { ImageServiceService } from 'src/app/core/services/image-service.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.css']
})
export class ImageComponent implements OnInit {


  image: File | null = null;
  imageMin: File | null = null;
  images: Image[] = [];
  absenceId: number | null = null; 


  constructor(
    private imageService: ImageServiceService,
    private route: ActivatedRoute,  // Inject ActivatedRoute,
    private router: Router
  ) {

  }

  ngOnInit(): void {
    this.fetchImages();
    this.getAbsence();
  }

  onFileChange(event: any) {
    this.image = event.target.files[0];
    this.imageMin = null;
    const fr = new FileReader();
    fr.onload = (evento: any) => {
      this.imageMin = evento.target.result;
    };
    if (this.image) {
      fr.readAsDataURL(this.image);
    }
  }
  private getAbsence():void{
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.absenceId = +id;
      }
    });
  }

  onUpload(): void {
    if (this.image) {
      this.imageService.upload(this.image,this.absenceId).subscribe(
        data => {
          this.fetchImages();
        },
        err => {
          this.reset();
          this.fetchImages();
        }
      );
    }
  }

  reset(): void {
    this.image = null;
    this.imageMin = null;
    const imageInputFile = document.getElementById('image') as HTMLInputElement;
    if (imageInputFile) {
      imageInputFile.value = '';
    }
  }

  fetchImages(): void {
    this.imageService.list().subscribe(
      (images) => {
        this.images = images;
      },
      (error) => {
        console.error('Error fetching images:', error);
      }
    );
  }

  deleteImage(id: any): void {
    Swal.fire({
      title: 'Confirmation',
      text: 'Are you sure you want to continue?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non',
    }).then((result) => {
      if (result.isConfirmed) {
        this.imageService.delete(id).subscribe(
          () => {
            this.fetchImages();
            Swal.fire('Image deleted !');
    
          },
          error => {
            console.error('Error deleting image:', error);
          }
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Operation canceled', '', 'error');
      }
    });
    
  }

} 
