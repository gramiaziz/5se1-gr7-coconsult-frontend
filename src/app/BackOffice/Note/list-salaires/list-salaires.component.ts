import { ExcelService } from './../../../core/services/excel.service';
import { Component, OnInit } from '@angular/core';
import { ServiceNoteService } from 'src/app/core/services/service-note.service';
import { ServiceSalaireService } from 'src/app/core/services/service-salaire.service';

@Component({
  selector: 'app-list-salaires',
  templateUrl: './list-salaires.component.html',
  styleUrls: ['./list-salaires.component.css']
})
export class ListSalairesComponent implements OnInit{ 
  departements: any[] = [];
  startingLetter: any = '';
  users: any[] = [];
  availablePercentage:number=0;
  max:number=0;
  p: number = 1;
  itemsPerPage:number=4;
  totalProduct:any;
  hasSalaryData: boolean = false;

  usernames: { [userId: number]: string } = {}; 
  user:any;



  constructor(
    private SalaireService: ServiceSalaireService,
    private excelService: ExcelService,
    private noteService: ServiceNoteService
    ) {}
    ngOnInit(): void {
      this.loadDepartements();
    }

    getUserNameById(userId: number): void {
      this.noteService.getUsernameById(userId).subscribe((user: any) => {
        this.usernames[userId] = user.username;
      });
    }
    getUserByIdEmpl(userId: number): void {
      this.noteService.getUserByIdEmpl(userId).subscribe((user: any) => {
        this.user = user;
      });
    }


    exportDataToExcel(): void {
      this.SalaireService.getall().subscribe(
        (salaries) => {
          const dataToExport = salaries.map(salary => ({
            employeePoste: salary.employe?.performanceEmployee, // Assuming salary.employee contains the employee information
            amount: salary.total_salaire,
            Supplement_Hours:salary.heures_supplementaires,
            prime:salary.prime,
            date:salary.date
          }));
          this.excelService.exportToExcel(dataToExport, 'salary_data');
        },
        (error) => {
          console.error('Error fetching salary data:', error);
        }
      );
    }
    private loadDepartements(): void {
      this.SalaireService.getall().subscribe((absences) => {
        this.departements = absences as any[];
        this.departements.forEach(department => {
          if (department.employe?.userId) {
            this.getUserNameById(department.employe.userId);
          }
        });
    
        this.totalProduct = absences.length;
    
        if (absences && Object.keys(absences).length > 0) {
          this.hasSalaryData = true;
        }
      });
    }
    

  removeAbsence(id: number): void {
    const confirmation = confirm("Are you sure you want to delete this salaire ?");

    if (confirmation) {
        this.SalaireService.removeNote(id).subscribe(() => {  
            this.SalaireService.getall().subscribe((datas) => {
                this.departements = datas as any[];
            }); 
        });
    }
}

}