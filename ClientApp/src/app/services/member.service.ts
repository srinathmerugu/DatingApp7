import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Member } from '../models/member';
import { User } from '../models/user';
import { Observable, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MemberService {
  baseUrl = environment.apiUrl;
  members: Member[] = [];

  constructor(private http: HttpClient) {}

  getMembers(): Observable<Member[]> {
    if (_.size(this.members)) return of(this.members);
    return this.http.get<Member[]>(this.baseUrl + 'users').pipe(
      map((members: Member[]) => {
        this.members = members;
        return members;
      })
    );
  }

  getMember(userName: string): Observable<Member> {
    const member = _.find(
      this.members,
      (member: Member) => member.userName === userName
    );
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
}
