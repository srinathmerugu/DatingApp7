import { Component, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef, ModalModule } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-server-error',
  standalone: true,
  imports: [ModalModule],
  templateUrl: './server-error.component.html',
  styleUrl: './server-error.component.scss',
})
export class ServerErrorComponent {
  error: any;
  modalRef?: BsModalRef;

  @ViewChild('template') templateRef!: TemplateRef<void>;
  constructor(private router: Router, private modalService: BsModalService) {
    const navigation = this.router.getCurrentNavigation();
    this.error = navigation?.extras?.state?.['error'];
    if (this.error) {
      setTimeout(() => {
        this.openModal(this.templateRef);
      });
    }
  }

  openModal(template: TemplateRef<void>) {
    this.modalRef = this.modalService.show(template);
  }
}
