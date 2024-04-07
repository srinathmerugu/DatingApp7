import { Component, Input, ViewChild } from '@angular/core';
import { Message } from '../../../models/message';
import { CommonModule } from '@angular/common';
import { TimeagoModule } from 'ngx-timeago';
import { MessageService } from '../../../services/message.service';
import { FormsModule, NgForm } from '@angular/forms';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

@Component({
  selector: 'app-member-messages',
  standalone: true,
  imports: [CommonModule, TimeagoModule, FormsModule, TooltipModule],
  templateUrl: './member-messages.component.html',
  styleUrl: './member-messages.component.scss'
})
export class MemberMessagesComponent {
  @ViewChild('messageForm', { static: true }) messageForm!: NgForm;
  @Input() userName?: string;
  @Input() messages: Message[] = [];
  messageContent = '';
  constructor(private messageService: MessageService) {

  }

  ngOnInit() {
  }

  sendMessage() {
    if (!this.userName) { return; }
    this.messageService.sendMessage(this.userName, this.messageContent).subscribe({
      next: (message: Message) => {
        this.messages.push(message);
        this.messageForm.reset();
      }
    })
  }

}
