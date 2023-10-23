import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from '../models/User';

const httpOptions: { headers: HttpHeaders } = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

/**A service for managing user-related HTTP requests */
@Injectable({
  providedIn: 'root',
})
export class UserService {
  /** api url server address
   * the server for local development is started with the `npm run server` command
   */
  private apiUrl: string = 'http://localhost:5000/users';

  constructor(private http: HttpClient) {}

  /**Get the list of users from server */
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  /**Add the user to db
   * @param user  - user data
   * @returns {Observable<User>} - observable that emits the added user data
   */
  addUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user, httpOptions);
  }

  /**The function makes a request to get users
   *  and then finds them who have the same email
   *
   * @param email - user email
   * @returns {Observable<boolean>} - `true` if the email exists, `false` otherwise.
   *  */
  isEmailExists(email: string): Observable<boolean> {
    return this.http
      .get<User[]>(this.apiUrl)
      .pipe(map((users) => users.some((user) => user.email === email)));
  }
}
