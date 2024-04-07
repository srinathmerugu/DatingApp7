import { ResolveFn } from '@angular/router';
import { Member } from '../models/member';
import { inject } from '@angular/core';
import { MemberService } from '../services/member.service';

export const memberDetailedResolver: ResolveFn<Member> = (route, state) => {
  const memberService = inject(MemberService);
  return memberService.getMember(route.paramMap.get('username')!);
};
