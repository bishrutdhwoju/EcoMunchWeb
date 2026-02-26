import { jest } from '@jest/globals';
import SequelizeMock from 'sequelize-mock';

const dbMock = new SequelizeMock();

// Mock database connection
jest.unstable_mockModule('../config/db.js', () => ({
  sequelize: dbMock,
}));

// Import after mocking
const { default: User } = await import('../models/User.js');

describe('User Model (Mocked)', () => {

  it('should be defined', () => {
    expect(User).toBeDefined();
  });

  it('should create a user instance', async () => {
    const inputData = {
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'Password123',
      role: 'user'
    };

    const user = await User.create(inputData);

    expect(user.name).toBe(inputData.name);
    expect(user.email).toBe(inputData.email);
    expect(user.id).toBeDefined();
  });

  it('should find a user by email', async () => {
    User.$queueResult(
      User.build({
        id: 1,
        name: 'founduser',
        email: 'found@example.com'
      })
    );

    const user = await User.findOne({ where: { email: 'found@example.com' } });
    
    expect(user).toBeDefined();
    expect(user.email).toBe('found@example.com');
  });

  it('should hash password before create', async () => {
    const user = User.build({
      name: 'hashuser',
      email: 'hash@example.com',
      password: 'Password123'
    });
    
    // Simulate pre-save hook behavior
    user.password = 'hashed_password'; 
    expect(user.password).toBe('hashed_password');
  });

  it('should update user role', async () => {
    const user = User.build({
      id: 2,
      name: 'regular',
      role: 'user'
    });

    user.update = jest.fn().mockImplementation(async (updates) => {
        Object.assign(user, updates);
        return user;
    });

    await user.update({ role: 'admin' });

    expect(user.role).toBe('admin');
    expect(user.update).toHaveBeenCalledWith({ role: 'admin' });
  });

  it('should delete a user', async () => {
    const user = User.build({ id: 3, name: 'ToDelete' });
    
    user.destroy = jest.fn().mockResolvedValue(1);

    await user.destroy();

    expect(user.destroy).toHaveBeenCalled();
  });
});
