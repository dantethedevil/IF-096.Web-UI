import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { Journal } from '../models/journal-data';

@Injectable()
export class JournalsStorageService {
  constructor(private httpClient: HttpClient) {}

  loadingStateChanged = new Subject<boolean>();

  // not used so far;
  /**
   * Method fetches from the server all journals
   * @returns - object representing a journal.
   */
  getAllJournals(): Observable<Journal[]> {
    return this.httpClient.get<any>('/journals').pipe(
      map((response: { status: any; data: Journal[] }) => {
        const journals = response.data;
        return journals;
      })
    );
  }

  /**
   * Method fetches from the server a single
   * journal object by provided subject ida and class id.
   * @param idSubject - number representing subject id of requested teacher.
   * @param idClass - number representing class id of requested teacher.
   * @returns - object representing a journal.
   */
  getJournaL(idSubject, idClass): Observable<Journal[]> {
    this.loadingStateChanged.next(true);
    return this.httpClient
      .get(`/journals/subjects/${idSubject}/classes/${idClass}`)
      .pipe(
        map((response: { status: any; data: Journal[] }) => {
          const journal = response.data;
          return journal;
        })
      );
  }

  // helper function;
  // not used so far;
  distinctJournals(journals) {
    const result = [];
    const mapped = new Map();
    for (const item of journals) {
      if (!mapped.has(item.idClass)) {
        mapped.set(item.idClass, true);
        result.push({
          idClass: item.idClass,
          className: item.className,
          academicYear: item.academicYear
        });
      }
    }
    console.log(result);
    return result;
  }

  // not used so far;
  /**
   * Method for fetching from the server list of all journals
   * for requested class.
   * @param idClass - number representing id of requested class.
   * @returns - object representing a journal of class.
   */
  getClassJournal(idClass): Observable<Journal> {
    return this.httpClient.get(`/journals/class/${idClass}`).pipe(
      map((response: { status: any; data: Journal }) => {
        const journal = response.data;
        return journal;
      })
    );
  }

  /**
   * Method fetches journal by given id, groups subjects by classes
   * and returns the result.
   * @param teacherId - number representing id of the journal.
   * @returns - an array of objects with subjects grouped by classes.
   */
  getTeacherJournal(idTeacher): Observable<Journal> {
    return this.httpClient.get(`/journals/teachers/${idTeacher}`).pipe(
      map((response: { status: any; data: Journal }) => {
        const journal = response.data;
        return journal;
      })
    );
  }

  /**
   * Common method for fetching from the server list of all journals
   * in class or list of all teacher's journals.
   * The list depends on provided param.
   * @param id - number representing id of requested class/teacher.
   * @param data - string saying whether class or teacher must be fetched.
   * @returns - object representing a journal of class/teacher.
   */
  getJournal(id, data): Observable<Journal> {
    this.loadingStateChanged.next(true);
    return this.httpClient.get(`/journals/${data}/${id}`).pipe(
      map((response: { status: any; data: Journal }) => {
        const journal = response.data;
        return journal;
      })
    );
  }

  /**
   * Method receives configurable object for a mark
   * and saves it to the server in post request.
   * @param obj - object for a mark to be cadded.
   * @returns - object of a newly created mark.
   */
  saveMark(obj): Observable<any> {
    return this.httpClient.post(`/marks`, obj, {
      observe: 'response'
    });
  }
}