import { Component } from '@angular/core';
import { Member } from '../../../models/member';
import { MemberService } from '../../../services/member.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';
import { Photo } from '../../../models/photo';

@Component({
  selector: 'app-member-detail',
  standalone: true,
  imports: [RouterLink, TabsModule, GalleryModule],
  templateUrl: './member-detail.component.html',
  styleUrl: './member-detail.component.scss',
})
export class MemberDetailComponent {
  member!: Member;
  images: GalleryItem[] = [];

  constructor(
    private memberService: MemberService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.loadMember();
  }

  private loadMember() {
    const userName = this.route.snapshot.paramMap.get('username');
    if (!userName) return;
    this.memberService.getMember(userName).subscribe({
      next: (member: Member) => {
        this.member = member;
        this.getImages();
      },
    });
  }

  private getImages() {
    if (!this.member) return;
    this.member.photos.forEach((photo: Photo) => {
      this.images.push(new ImageItem({ src: photo.url, thumb: photo.url }));
    });
  }
}
