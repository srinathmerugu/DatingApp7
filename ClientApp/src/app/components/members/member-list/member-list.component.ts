import { Component } from '@angular/core';
import { MemberService } from '../../../services/member.service';
import { Member } from '../../../models/member';
import { MemberCardComponent } from '../member-card/member-card.component';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-member-list',
  standalone: true,
  templateUrl: './member-list.component.html',
  styleUrl: './member-list.component.scss',
  imports: [CommonModule, MemberCardComponent],
})
export class MemberListComponent {
  members$: Observable<Member[]> | undefined;

  constructor(private memberService: MemberService) {}

  ngOnInit() {
    this.members$ = this.memberService.getMembers();
  }
}
