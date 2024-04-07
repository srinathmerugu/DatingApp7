import { Component } from '@angular/core';
import { Message } from '../../models/message';
import { PaginatedResult, Pagination } from '../../models/pagination';
import { MessageService } from '../../services/message.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { TimeagoModule } from 'ngx-timeago';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonsModule, TimeagoModule, PaginationModule, RouterLink],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.scss'
})
export class MessagesComponent {
  messages?: Message[] = [];
  pagination?: Pagination;
  container = 'Unread';
  pageNumber = 1;
  pageSize = 5;
  loading = false;

  constructor(private messageService: MessageService, private toastr: ToastrService) { }

  ngOnInit() {
    this.loadMessages();
  }

  loadMessages() {
    this.loading = true;
    this.messageService.getMessages(this.pageNumber, this.pageSize, this.container).subscribe({
      next: (response: PaginatedResult<Message[]>) => {
        this.pagination = response.pagination;
        this.messages = response.result;
        this.loading = false;
      }
    });
  }

  deleteMessage(messageId: number) {
    this.messageService.deleteMessage(messageId).subscribe({
      next: () => {
        this.messages?.splice(this.messages.findIndex(m => m.id === messageId), 1);
        this.toastr.success("Message Deleted Successfully");
      }
    })
  }

  pageChanged(event: any) {
    if (this.pageNumber != event.page) {
      this.pageNumber = event.page;
      this.loadMessages();
    }
  }

}
