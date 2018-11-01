import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';

@Injectable({
  providedIn: 'root'
})

export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const tasks = [
      { id: 1, name: 'Shopping' },
      { id: 2, name: 'Visiting Doctor' },
      { id: 3, name: 'Task 3' },
      { id: 4, name: 'Task 4' },
      { id: 5, name: 'Task 5' },
      { id: 6, name: 'Task 6' },
      { id: 7, name: 'Task 7' },
      { id: 8, name: 'Task 8' },
      { id: 9, name: 'Task 9' },
      { id: 10, name: 'Task 10' }
    ];
    return {tasks};
  }
}