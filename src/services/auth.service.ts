import { userModel } from '@models/users.model';
import { UserDocument, UserModel } from '@interfaces/users.interface';

class AuthService {
  public users: UserModel = userModel;
}

export { AuthService };
