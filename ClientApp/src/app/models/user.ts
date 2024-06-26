import { UserRoles } from "../enums/user-roles-enum";

export interface User {
  username: string;
  token: string;
  photoUrl: string;
  knownAs: string;
  gender: string;
  roles: any[];
}
