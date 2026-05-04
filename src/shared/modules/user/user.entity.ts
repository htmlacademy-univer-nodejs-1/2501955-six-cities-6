import { defaultClasses, getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { User, UserType } from '../../types/index.js';
import { createSHA256 } from '../../helpers/index.js';

export interface UserEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'users',
    timestamps: true
  }
})
export class UserEntity extends defaultClasses.TimeStamps implements User {
  @prop({
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 15
  })
  public name!: string;

  @prop({
    required: true,
    unique: true,
    trim: true
  })
  public email!: string;

  @prop()
  public avatar?: string;

  @prop({
    required: true,
    type: () => String,
    enum: UserType,
    default: UserType.Default
  })
  public type!: UserType;

  @prop({
    required: true
  })
  private _password?: string;

  constructor(userData: User) {
    super();

    this.name = userData.name;
    this.email = userData.email;
    this.avatar = userData.avatar;
    this.type = userData.type;
  }

  public setPassword(password: string, salt: string): void {
    this._password = createSHA256(password, salt);
  }

  public getPassword(): string | undefined {
    return this._password;
  }

  public verifyPassword(password: string, salt: string): boolean {
    const passwordHash = createSHA256(password, salt);
    return passwordHash === this._password;
  }
}

export const UserModel = getModelForClass(UserEntity);
