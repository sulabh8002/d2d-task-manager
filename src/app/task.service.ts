import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Task } from './task';
import { MessageService } from './message.service';
import { TASKS } from './mock-tasks';
import { RouterModule, Routes, Router } from '@angular/router';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({ providedIn: 'root' })
export class TaskService {

  private tasksUrl = 'api/tasks';  // URL to web api

  constructor(
    private http: HttpClient,
    private messageService: MessageService, private router: Router) { }

  /** GET tasks from the server */
  getTasks (): Observable<Task[]> {
    this.messageService.add('TaskService: fetched tasks');
    // return this.http.get<Task[]>(this.tasksUrl)
    //   .pipe(
    //     tap(tasks => this.log(`fetched tasks`)),
    //     catchError(this.handleError('getTasks', []))
    //   );
    return of(TASKS);
  }

  /** GET task by id. Return `undefined` when id not found */
  getTaskNo404<Data>(id: number): Observable<Task> {
    const url = `${this.tasksUrl}/?id=${id}`;
    return this.http.get<Task[]>(url)
      .pipe(
        map(tasks => tasks[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          this.log(`${outcome} task id=${id}`);
        }),
        catchError(this.handleError<Task>(`getTask id=${id}`))
      );
  }

  /** GET task by id. Will 404 if id not found */
  getTask(id: number): Observable<Task> {
    // const url = `${this.tasksUrl}/${id}`;
    // return this.http.get<Task>(url).pipe(
    //   tap(_ => this.log(`fetched task id=${id}`)),
    //   catchError(this.handleError<Task>(`getTask id=${id}`))
    // );
    const url = './mock-tasks.ts'
    return of(TASKS[id-1]);
  }

  /* GET taskes whose name contains search term */
  searchTasks(term: string): Observable<Task[]> {
    if (!term.trim()) {
      // if not search term, return empty task array.
      return of([]);
    }
    return this.http.get<Task[]>(`${this.tasksUrl}/?name=${term}`).pipe(
      tap(_ => this.log(`found tasks matching "${term}"`)),
      catchError(this.handleError<Task[]>('searchTasks', []))
    );
  }

  //////// Save methods //////////

  /** POST: add a new task to the server */
  addTask () {
    // return this.http.post<Task>(this.tasksUrl, task, httpOptions).pipe(
      // tap((task: Task) => this.log(`added task w/ id=${task.id}`)),
      // catchError(this.handleError<Task>('addTask'))
    // );
    const task: Task = {
      id: TASKS.length + 1,
      name: ""
    };
    TASKS.push(task);
    this.router.navigateByUrl('/detail/' + task.id);
  }

  /** DELETE: delete the task from the server */
  deleteTask (task: Task) {
    const id = task.id;
    TASKS.splice(1, id-1);

  }

  /** PUT: update the task on the server */
  updateTask (task: Task) {
    // return this.http.put(this.tasksUrl, task, httpOptions).pipe(
    //   tap(_ => this.log(`updated task id=${task.id}`)),
    //   catchError(this.handleError<any>('updateTask'))
    // );
    for (let i = 0; i < TASKS.length; i++) {
      if  (TASKS[i].id == task.id) {
        TASKS[i] = task;
      }
    }
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a TaskService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`TaskService:   ${message}`);
  }
}
