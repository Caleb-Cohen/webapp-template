import { db } from '@/lib/db';
import { createUser, getUserFromGoogleId } from '@/lib/user';

jest.mock('@/lib/db', () => ({
  db: {
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
    },
  },
}));

describe('User Management', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    test('creates user with correct data', async () => {
      const mockUser = {
        id: 'test-user-id',
        googleId: 'test-google-id',
        name: 'John Doe',
      };

      (db.user.create as jest.Mock).mockResolvedValue(mockUser);

      const result = await createUser('test-google-id', 'John Doe');

      expect(result).toEqual(mockUser);
      expect(db.user.create).toHaveBeenCalledWith({
        data: {
          googleId: 'test-google-id',
          name: 'John Doe',
        },
      });
    });

    test('handles database errors when creating user', async () => {
      (db.user.create as jest.Mock).mockRejectedValue(new Error('DB error'));

      await expect(createUser('test-google-id', 'John Doe')).rejects.toThrow(
        'DB error',
      );
    });
  });

  describe('getUserFromGoogleId', () => {
    test('returns user when found', async () => {
      const mockUser = {
        id: 'test-user-id',
        googleId: 'test-google-id',
        name: 'John Doe',
      };

      (db.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const result = await getUserFromGoogleId('test-google-id');

      expect(result).toEqual(mockUser);
      expect(db.user.findUnique).toHaveBeenCalledWith({
        where: { googleId: 'test-google-id' },
      });
    });

    test('returns null when user not found', async () => {
      (db.user.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await getUserFromGoogleId('nonexistent-google-id');

      expect(result).toBeNull();
      expect(db.user.findUnique).toHaveBeenCalledWith({
        where: { googleId: 'nonexistent-google-id' },
      });
    });

    test('handles database errors when finding user', async () => {
      (db.user.findUnique as jest.Mock).mockRejectedValue(
        new Error('DB error'),
      );

      await expect(getUserFromGoogleId('test-google-id')).rejects.toThrow(
        'DB error',
      );
    });
  });
});
