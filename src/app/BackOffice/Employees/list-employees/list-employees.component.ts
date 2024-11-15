import { Component, OnInit } from '@angular/core';
import { SericeEmployeeService } from 'src/app/core/services/serice-employee.service';
import { ServiceNoteService } from 'src/app/core/services/service-note.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-list-employees',
  templateUrl: './list-employees.component.html',
  styleUrls: ['./list-employees.component.css'],
})
export class ListEmployeesComponent implements OnInit {
  employees: any[] = [];
  starsArray: any[] = [];
  emptyStarsArray: any[] = [];
  availablePercentage: number = 0;
  max: number = 0;
  errorMessage: string = '';
  startingLetter: any = '';
  p: number = 1;
  itemsPerPage: number = 4;
  totalProduct: any;
  fileName = 'ExcelSheet.xlsx';
  usernames: { [userId: number]: string } = {}; 

  constructor(private employeeService: SericeEmployeeService,
    private noteService: ServiceNoteService) {}

  ngOnInit(): void {
    this.loadAbsences();
    this.fetchAnalytics();
    this.fetchmax();
  }
  onInput(event: any): void {
    this.startingLetter = event.target.value;
    this.searchUsers();
  }
  searchUsers(): void {
    this.employeeService.searchUsers(this.startingLetter).subscribe(
      (data) => {
        this.employees = data;
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }
  getUserNameById(userId: number): void {
    this.noteService.getUsernameById(userId).subscribe((user: any) => {
      this.usernames[userId] = user.username;
    });
  }

  private loadAbsences(): void {
    this.employeeService.getall().subscribe((absences) => {
      this.employees = absences as any[];
      this.employees.forEach(department => {
        if (department.userId) {
          this.getUserNameById(department.userId);
        }
      });
      this.totalProduct = absences.length;
    });
  }

  removeEmployee(id: number): void {
    const confirmation = confirm(
      'Are you sure you want to delete this absence?'
    );

    if (confirmation) {
      this.employeeService.removeEmployee(id).subscribe(() => {
        this.employeeService.getall().subscribe((datas) => {
          this.employees = datas as any[];
        });
      });
    }
  }
  fetchAnalytics() {
    this.employeeService.moyennedeperf().subscribe(
      (availablePercentage) =>
        (this.availablePercentage = availablePercentage as number),
      (errorResponse) => {
        if (errorResponse.error && errorResponse.error.error) {
          this.errorMessage = errorResponse.error.error;
        } else {
          this.errorMessage = 'An unexpected error occurred.';
        }
      }
    );
  }
  fetchmax() {
    this.employeeService.calculateNbreEmpl().subscribe(
      (max) => (this.max = max as number),
      (errorResponse) => {
        if (errorResponse.error && errorResponse.error.error) {
          this.errorMessage = errorResponse.error.error;
        } else {
          this.errorMessage = 'An unexpected error occurred.';
        }
      }
    );
  }
}