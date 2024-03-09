import { Component, Input } from '@angular/core';
import { Member } from '../../../models/member';
import {
  FileItem,
  FileUploadModule,
  FileUploader,
  ParsedResponseHeaders,
} from 'ng2-file-upload';
import { environment } from '../../../../environments/environment.development';
import { User } from '../../../models/user';
import { AccountService } from '../../../services/account.service';
import { take } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MemberService } from '../../../services/member.service';
import { Photo } from '../../../models/photo';
import _ from 'lodash';

@Component({
  selector: 'app-photo-editor',
  standalone: true,
  imports: [CommonModule, FileUploadModule],
  templateUrl: './photo-editor.component.html',
  styleUrl: './photo-editor.component.scss',
})
export class PhotoEditorComponent {
  @Input() member: Member | undefined;
  uploader: FileUploader | undefined;
  hasBaseDropZoneOver = false;
  basUrl = environment.apiUrl;
  user: User | undefined;

  constructor(
    private accountService: AccountService,
    private memberService: MemberService
  ) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: (user: User | null) => {
        if (user) {
          this.user = user;
        }
      },
    });
  }

  ngOnInit() {
    this.initializeUploader();
  }

  fileOverBase(e: any) {
    this.hasBaseDropZoneOver = e;
  }

  initializeUploader() {
    this.uploader = new FileUploader({
      url: this.basUrl + 'users/add-photo',
      authToken: 'Bearer ' + this.user?.token,
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024,
    });

    this.uploader.onAfterAddingFile = (file: FileItem) => {
      file.withCredentials = false;
    };

    this.uploader.onSuccessItem = (
      item: FileItem,
      response: string,
      status: number,
      headers: ParsedResponseHeaders
    ) => {
      if (response) {
        const photo = JSON.parse(response);
        this.member?.photos.push(photo);
      }
    };
  }

  setMainPhoto(photo: Photo) {
    this.memberService.updateMemberMainPhoto(photo.id).subscribe({
      next: () => {
        if (this.user && this.member) {
          this.user.photoUrl = photo.url;
          this.accountService.setUserInfoInLocalStorageAndEmitUser(this.user);
          this.member.photoUrl = photo.url;
          _.forEach(this.member.photos, (memberPhoto: Photo) => {
            if (memberPhoto.isMain) memberPhoto.isMain = false;
            if (memberPhoto.id === photo.id) memberPhoto.isMain = true;
          });
        }
      },
    });
  }

  deletePhoto(photoId: number) {
    this.memberService.deleteMemberPhoto(photoId).subscribe({
      next: () => {
        if (this.member) {
          _.remove(this.member.photos, (photo: Photo) => photo.id === photoId);
        }
      },
    });
  }
}
