import { Injectable } from '@angular/core';
import _ from 'lodash';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Member } from '../models/member';
import { Observable, map, of, take } from 'rxjs';
import { PaginatedResult } from '../models/pagination';
import { UserParams } from '../models/user-params';
import { AccountService } from './account.service';
import { User } from '../models/user';
import { getPaginationHeaders, getPaginatedResult } from './pagination-helper';

@Injectable({
  providedIn: 'root',
})
export class MemberService {
  baseUrl = environment.apiUrl;
  members: Member[] = [];
  memberCache = new Map();
  userParams: UserParams | undefined;
  user: User | undefined;

  constructor(private http: HttpClient, private accountService: AccountService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: (user: User | null) => {
        if (user) {
          this.userParams = new UserParams(user);
          this.user = user;
        }
      }
    })
  }

  getUserParams() {
    return this.userParams;
  }

  setUserParams(userParams: UserParams) {
    this.userParams = userParams;
  }

  resetUserparams() {
    if (this.user) {
      this.userParams = new UserParams(this.user);
      return this.userParams;
    }
    return;
  }

  getMembers(userParams: UserParams): Observable<PaginatedResult<Member[]>> {
    const memberQueryKey = _.values(userParams).join('_');
    const memberQueryResponse = this.memberCache.get(memberQueryKey);
    if (memberQueryResponse) return of(memberQueryResponse);

    let params = getPaginationHeaders(userParams.pageNumber, userParams.pageSize);
    params = params.append('minAge', userParams.minAge);
    params = params.append('maxAge', userParams.maxAge);
    params = params.append('gender', userParams.gender);
    params = params.append('orderBy', userParams.orderBy);
    return getPaginatedResult<Member[]>(this.baseUrl + 'users', params, this.http).pipe(map((response) => {
      this.memberCache.set(memberQueryKey, response);
      return response;
    }))
  }

  getMember(userName: string): Observable<Member> {
    const members: Member[] = _.reduce([...this.memberCache.values()], ((arr: Member[], elem: PaginatedResult<Member>) => arr.concat(elem.result as Member)), []);
    const member = _.find(members, (member: Member) => member.userName === userName);
    if (member) return of(member);
    return this.http.get<Member>(this.baseUrl + 'users/' + userName);
  }

  updateMember(updatedMember: Member) {
    return this.http.put(this.baseUrl + 'users', updatedMember).pipe(
      map(() => {
        const index = _.indexOf(this.members, updatedMember);
        this.members[index] = { ...this.members[index], ...updatedMember };
      })
    );
  }

  updateMemberMainPhoto(photoId: number) {
    return this.http.put(this.baseUrl + 'users/set-main-photo/' + photoId, {});
  }

  deleteMemberPhoto(photoId: number) {
    return this.http.delete(this.baseUrl + 'users/delete-photo/' + photoId);
  }

  addLike(userName: string): Observable<any> {
    return this.http.post(this.baseUrl + 'likes/' + userName, {});
  }

  getLikes(predicate: string, pageNumber: number, pageSize: number): Observable<PaginatedResult<Member[]>> {
    let params = getPaginationHeaders(pageNumber, pageSize);
    params = params.append('predicate', predicate);
    return getPaginatedResult<Member[]>(this.baseUrl + 'likes', params, this.http);
  }


}
