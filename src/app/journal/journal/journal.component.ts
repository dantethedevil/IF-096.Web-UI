import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { JournalsStorageService } from 'src/app/services/journals-storage.service';
import { MatSort, MatTableDataSource } from '@angular/material';
import { TeacherService } from 'src/app/services/teacher.service';
import { Teacher } from 'src/app/admin-panel/teachers/helpers/teacher.model';
import { TeacherData } from 'src/app/models/teacher-data';
import { TeachersStorageService } from 'src/app/services/teachers-storage.service';
import { ClassService } from 'src/app/services/class.service';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

@Component({
  selector: 'app-journal',
  templateUrl: './journal.component.html',
  styleUrls: ['./journal.component.scss']
})
export class JournalComponent implements OnInit {
  journals;
  filter: string;
  activeClasses = [];
  inactiveClasses = [];
  teachers: TeacherData[];
  chosenClasses = 'inactiveClasses';

  displayedColumns: string[] = ['num', 'className', 'classYear'];
  dataSource;

  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private journalsStorageService: JournalsStorageService,
    private teachersStorageService: TeachersStorageService,
    private classService: ClassService
  ) {}

  ngOnInit() {
    this.classService.getClasses('all').subscribe(classes => {
      for (const clas of classes) {
        if (clas.isActive) {
          this.activeClasses.push(clas);
        } else {
          this.inactiveClasses.push(clas);
        }
      }

      this.dataSource = new MatTableDataSource(this[this.chosenClasses]);
      this.dataSource.sort = this.sort;
    });
    this.teachersStorageService.getTeacherS().subscribe(teachers => {
      this.teachers = teachers;
    });
  }

  handleChange(e) {
    console.log(e);
    this.dataSource = new MatTableDataSource(this[e.value]);
    this.dataSource.sort = this.sort;
    this.applyFilter(this.filter);
  }

  applyFilter(filterValue: string) {
    if (!filterValue) {
      this.filter = '';
    }
    this.filter = filterValue.trim().toLowerCase();
    this.dataSource.filter = this.filter;
  }
}
