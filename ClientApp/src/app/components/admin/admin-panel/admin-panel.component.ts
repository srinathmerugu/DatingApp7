import { Component } from '@angular/core';
import { TabDirective, TabsModule, TabsetComponent } from 'ngx-bootstrap/tabs';
import { UserManagementComponent } from "../../../admin/user-management/user-management.component";
import { PhotoManagementComponent } from "../../../admin/photo-management/photo-management.component";
import { CommonModule } from '@angular/common';
import { HasRoleDirective } from '../../../directives/has-role.directive';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.scss',
  imports: [CommonModule, TabsModule, UserManagementComponent, PhotoManagementComponent, HasRoleDirective]
})
export class AdminPanelComponent {

}
