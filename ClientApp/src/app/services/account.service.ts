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

  constructor(private http: HttpClient) {}

  login(userInfo: UserDto): Observable<any> {
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

  private setUserInfoInLocalStorageAndEmitUser(registeredUserInfo: User) {
    localStorage.setItem('user', JSON.stringify(registeredUserInfo));
    this.emitCurrentUser(registeredUserInfo);
  }

  emitCurrentUser(user: User | null) {
    this.currentUser.next(user);
  }

  logout() {
    localStorage.removeItem('user');
    this.emitCurrentUser(null);
  }
}
