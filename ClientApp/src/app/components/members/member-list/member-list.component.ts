import { Component } from '@angular/core';
import { MemberService } from '../../../services/member.service';
import { Member } from '../../../models/member';
import { MemberCardComponent } from '../member-card/member-card.component';
import { CommonModule } from '@angular/common';
import { PaginatedResult, Pagination } from '../../../models/pagination';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { FormsModule } from '@angular/forms';
import { UserParams } from '../../../models/user-params';
import { Gender } from '../../../enums/gender-enum';
import { ButtonsModule } from 'ngx-bootstrap/buttons';

@Component({
  selector: 'app-member-list',
  standalone: true,
  templateUrl: './member-list.component.html',
  styleUrl: './member-list.component.scss',
  imports: [CommonModule, MemberCardComponent, PaginationModule, FormsModule, ButtonsModule],
})
export class MemberListComponent {
  members: Member[] = [];
  pagination: Pagination | undefined;
  userParams: UserParams | undefined;
  genderList = [{ value: Gender.Male, displayName: 'Male' }, { value: Gender.Female, displayName: "Female" }]

  constructor(private memberService: MemberService) { }

  ngOnInit() {
    // this.members$ = this.memberService.getMembers();
    this.userParams = this.memberService.getUserParams();
    this.loadMembers();
  }

  loadMembers() {
    if (this.userParams) {
      this.memberService.setUserParams(this.userParams);
      this.memberService.getMembers(this.userParams).subscribe({
        next: (response: PaginatedResult<Member[]>) => {
          if (response.result && response.pagination) {
            this.members = response.result;
            this.pagination = response.pagination;
          }
        },
      });
    }
  }

  pageChanged(event: any) {
    if (this.userParams && this.userParams.pageNumber !== event.page) {
      this.userParams.pageNumber = event.page;
      this.memberService.setUserParams(this.userParams);
      this.loadMembers();
    }
  }

  resetFilters() {
    this.userParams = this.memberService.resetUserparams();
    this.loadMembers();
  }
}
