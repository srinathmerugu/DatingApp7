import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserDto } from '../models/user-dto';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { User } from '../models/user';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  baseUrl = environment.apiUrl;
  private currentUser = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUser.asObservable();

  constructor(private http: HttpClient) { }

  login(userInfo: UserDto): Observable<User> {
    return this.http.post<User>(this.baseUrl + 'account/login', userInfo).pipe(
      map((loggedInUserInfo: User) => {
        if (loggedInUserInfo) {
          this.setUserInfoInLocalStorageAndEmitUser(loggedInUserInfo);
        }
        return loggedInUserInfo;
      })
    );
  }

  register(userInfo: UserDto): Observable<any> {
    return this.http
      .post<User>(this.baseUrl + 'account/register', userInfo)
      .pipe(
        map((registeredUserInfo: User) => {
          if (registeredUserInfo) {
            this.setUserInfoInLocalStorageAndEmitUser(registeredUserInfo);
          }
          return registeredUserInfo;
        })
      );
  }

  setUserInfoInLocalStorageAndEmitUser(user: User) {
    user.roles = [];
    const roles = this.getDecodedToken(user.token).role;
    Array.isArray(roles) ? user.roles = roles : user.roles.push(roles);
    localStorage.setItem('user', JSON.stringify(user));
    this.emitCurrentUser(user);
  }

  emitCurrentUser(user: User | null) {
    this.currentUser.next(user);
  }

  logout() {
    localStorage.removeItem('user');
    this.emitCurrentUser(null);
  }

  getDecodedToken(token: string) {
    return JSON.parse(atob(token.split('.')[1]));
  }
}
