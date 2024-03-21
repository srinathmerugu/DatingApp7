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

    let params = this.getPaginationHeaders(userParams.pageNumber, userParams.pageSize);
    params = params.append('minAge', userParams.minAge);
    params = params.append('maxAge', userParams.maxAge);
    params = params.append('gender', userParams.gender);
    params = params.append('orderBy', userParams.orderBy);
    return this.getpaginatedResult<Member[]>(this.baseUrl + 'users', params).pipe(map((response) => {
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

  private getpaginatedResult<T>(url: string, params: HttpParams): Observable<PaginatedResult<T>> {
    const paginatedResult: PaginatedResult<T> = new PaginatedResult<T>;
    return this.http.get<T>(url, { observe: 'response', params }).pipe(
      map((response) => {
        if (response.body) {
          paginatedResult.result = response.body;
        }
        const pagination = response.headers.get('Pagination');
        if (pagination) {
          paginatedResult.pagination = JSON.parse(pagination);
        }
        return paginatedResult;
      })
    );
  }

  private getPaginationHeaders(pageNumber: number, pageSize: number) { //queryParms in the endpoint
    let params = new HttpParams();
    params = params.append('pageNumber', pageNumber);
    params = params.append('pageSize', pageSize);
    return params;
  }
}
