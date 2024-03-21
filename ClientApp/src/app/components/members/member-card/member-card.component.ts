import { Component, Input } from '@angular/core';
import { Member } from '../../../models/member';
import { RouterLink } from '@angular/router';
import { MemberService } from '../../../services/member.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-member-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './member-card.component.html',
  styleUrl: './member-card.component.scss',
})
export class MemberCardComponent {
  @Input() member!: Member;

  constructor(private memberService: MemberService, private toastrService: ToastrService) { }

  addLike(member: Member) {
    this.memberService.addLike(member.userName).subscribe({
      next: () => this.toastrService.success('You have liked ' + member.knownAs)
    });
  }
}
