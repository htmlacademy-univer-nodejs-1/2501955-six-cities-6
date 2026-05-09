import { UserRdo } from '../user/user-rdo';

export class CommentRdo {
  public id!: string;

  public text!: string;

  public publishDate!: Date;

  public rating!: number;

  public author!: UserRdo;
}
