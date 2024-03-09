import { Component, HostListener, ViewChild } from '@angular/core';
import { Member } from '../../../models/member';
import { User } from '../../../models/user';
import { AccountService } from '../../../services/account.service';
import { MemberService } from '../../../services/member.service';
import { take } from 'rxjs';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { FormsModule, NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-member-edit',
  standalone: true,
  imports: [FormsModule, CommonModule, TabsModule],
  templateUrl: './member-edit.component.html',
  styleUrl: './member-edit.component.scss',
})
export class MemberEditComponent {
  @ViewChild('editForm', { static: false }) editForm: NgForm | undefined;
  // event we're listening inside browser
  @HostListener('window:beforeunload', ['$event']) unloadNotification(
    $event: any
  ) {
    if (this.editForm?.dirty) {
      $event.returnValue = true;
    }
  }
  member!: Member;
  user: User | null = null;

  constructor(
    private accountService: AccountService,
    private memberService: MemberService,
    private toastrService: ToastrService
  ) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: (user: User | null) => (this.user = user),
    });
  }

  ngOnInit() {
    this.loadMember();
  }

  private loadMember() {
    if (!this.user) return;
    this.memberService.getMember(this.user.username).subscribe({
      next: (member: Member) => {
        this.member = member;
      },
    });
  }

  updateMember() {
    console.log(this.member);
    this.memberService.updateMember(this.editForm?.value).subscribe({
      next: () => {
        this.toastrService.success('Profile Updated Successfully');
        this.editForm?.reset(this.member);
      },
    });
  }
}
