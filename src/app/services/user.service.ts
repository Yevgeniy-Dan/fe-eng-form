import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from '../models/User';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class UserService {
  apiUrl = 'http://localhost:5000/users';

  constructor(private http: HttpClient) {}

  /**Get the users from server */
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  /**Add the user to db
   * @param user contains user data according to the interface
   */
  addUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user, httpOptions);
  }

  /**The function makes a request to get users
   *  and then finds them who have the same email */
  isEmailExists(email: string): Observable<boolean> {
    return this.http
      .get<User[]>(this.apiUrl)
      .pipe(map((users) => users.some((user) => user.email === email)));
  }
}
