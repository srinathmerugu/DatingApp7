import { Component, ViewChild, viewChild } from '@angular/core';
import { Member } from '../../../models/member';
import { MemberService } from '../../../services/member.service';
import { ActivatedRoute, Data, Params, RouterLink } from '@angular/router';
import { TabDirective, TabsModule, TabsetComponent } from 'ngx-bootstrap/tabs';
import { GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';
import { Photo } from '../../../models/photo';
import { CommonModule } from '@angular/common';
import { TimeagoModule } from 'ngx-timeago';
import { MemberMessagesComponent } from "../member-messages/member-messages.component";
import { MessageService } from '../../../services/message.service';
import { Message } from '../../../models/message';

@Component({
  selector: 'app-member-detail',
  standalone: true,
  templateUrl: './member-detail.component.html',
  styleUrl: './member-detail.component.scss',
  imports: [RouterLink, TabsModule, GalleryModule, CommonModule, TimeagoModule, MemberMessagesComponent]
})
export class MemberDetailComponent {
  @ViewChild('memberTabs', { static: true }) memberTabs!: TabsetComponent;
  member!: Member;
  images: GalleryItem[] = [];
  activeTab!: TabDirective
  messages: Message[] = [];

  constructor(
    private memberService: MemberService,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.loadMember();
    this.newMethod();
    this.getImages();
  }

  private newMethod() {
    this.route.queryParams.subscribe({
      next: (params: Params) => {
        params['tab'] && this.selectTab(params['tab']);
      }
    });
  }

  private loadMember() {
    this.route.data.subscribe({
      next: (data: Data) => this.member = data['member']
    })
  }

  selectTab(heading: string) {
    if (this.memberTabs) {
      this.memberTabs.tabs.find((tab: TabDirective) => tab.heading === heading)!.active = true;
    }
  }

  onTabActivated(data: TabDirective) {
    this.activeTab = data;
    if (this.activeTab.heading === 'Messages') {
      this.loadMesages();
    }
  }

  loadMesages() {
    if (this.member.userName) {
      this.messageService.getMessageThread(this.member.userName).subscribe({
        next: (messages: Message[]) => this.messages = messages
      })
    }
  }

  private getImages() {
    if (!this.member) return;
    this.member.photos.forEach((photo: Photo) => {
      this.images.push(new ImageItem({ src: photo.url, thumb: photo.url }));
    });
  }
}
