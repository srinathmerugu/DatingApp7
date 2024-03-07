import { Component } from '@angular/core';
import { MemberService } from '../../../services/member.service';
import { Member } from '../../../models/member';
import { MemberCardComponent } from '../member-card/member-card.component';

@Component({
  selector: 'app-member-list',
  standalone: true,
  templateUrl: './member-list.component.html',
  styleUrl: './member-list.component.scss',
  imports: [MemberCardComponent],
})
export class MemberListComponent {
  members: Member[] = [];

  constructor(private memberService: MemberService) {}

  ngOnInit() {
    this.loadMembers();
  }

  loadMembers() {
    this.memberService.getMembers().subscribe({
      next: (members: Member[]) => (this.members = members),
      error: (err: any) => {
        throw err(err);
      },
    });
  }
}
