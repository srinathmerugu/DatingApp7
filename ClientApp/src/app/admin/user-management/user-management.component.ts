import { Component } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { User } from '../../models/user';
import { CommonModule } from '@angular/common';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { RolesModalComponent } from '../../modals/roles-modal/roles-modal.component';
import { UserRoles } from '../../enums/user-roles-enum';
import { initialState } from 'ngx-bootstrap/timepicker/reducer/timepicker.reducer';
import _ from 'lodash';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss'
})
export class UserManagementComponent {
  users: User[] = [];
  bsModalRef: BsModalRef<RolesModalComponent> = new BsModalRef<RolesModalComponent>();
  availableRoles = ['Admin', 'Moderator', 'Member'];
  constructor(private adminService: AdminService,
    private modalService: BsModalService
  ) { }

  ngOnInit() {
    this.getUsersWithRoles();
  }

  private getUsersWithRoles() {
    this.adminService.getUsersWithRoles().subscribe({
      next: (users: User[]) => this.users = users
    });
  }

  openRolesModal(user: User) {
    const config = {
      class: 'modal-dialog-centered',
      initialState: {
        userName: user.username,
        availableRoles: this.availableRoles,
        selectedRoles: [...user.roles]
      }
    }
    this.bsModalRef = this.modalService.show(RolesModalComponent, config);
    this.bsModalRef.onHide?.subscribe({
      next: () => {
        const selectedRoles = this.bsModalRef.content?.selectedRoles;
        if (!_.isEqual(selectedRoles, user.roles)) {
          this.adminService.updateUserRoles(user.username, selectedRoles?.toString()).subscribe({
            next: roles => user.roles = roles
          })
        }
      }
    })
  }

}
