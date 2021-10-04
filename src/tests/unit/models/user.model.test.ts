import faker from 'faker';
import { userModel } from '@models/users.model';

describe('User model', () => {
  describe('User validation', () => {
    let newUser: any;
    beforeEach(() => {
      newUser = {
        name: faker.name.findName(),
        email: faker.internet.email().toLowerCase(),
        password: 'pass12345',
        passwordConfirm: 'pass12345',
      };
    });

    test('should correctly validate a valid user', async () => {
      await expect(new userModel(newUser).validate()).resolves.toBeUndefined();
    });

    test('should throw a validation error if email is valid', async () => {
      newUser.email = 'invalidEmail';
      await expect(new userModel(newUser).validate()).rejects.toThrow();
    });

    test('should throw a validation error if password length is less than 8 characters', async () => {
      newUser.password = 'password';
      await expect(new userModel(newUser).validate()).rejects.toThrow();
    });

    test('should throw an validation error if passwordConfirm does not match with password', async () => {
      newUser.passwordConfirm = 'password1235';
      await expect(new userModel(newUser).validate()).rejects.toThrow();
    });
  });
});
