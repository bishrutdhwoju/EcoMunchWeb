import { jest } from '@jest/globals';
import SequelizeMock from 'sequelize-mock';

const dbMock = new SequelizeMock();

// Mock database connection
jest.unstable_mockModule('../config/db.js', () => ({
  sequelize: dbMock,
}));

// Import after mocking
const { default: Bookmark } = await import('../models/Bookmark.js');

describe('Bookmark Model (Mocked)', () => {

  it('should be defined', () => {
    expect(Bookmark).toBeDefined();
  });

  it('should create a bookmark instance', async () => {
    const inputData = {
      userId: 1,
      recipeId: 2
    };

    const bookmark = await Bookmark.create(inputData);

    expect(bookmark.userId).toBe(inputData.userId);
    expect(bookmark.recipeId).toBe(inputData.recipeId);
    expect(bookmark.id).toBeDefined();
  });

  it('should find all bookmarks for a user', async () => {
    Bookmark.$queueResult([
      Bookmark.build({ userId: 1, recipeId: 2 }),
      Bookmark.build({ userId: 1, recipeId: 3 })
    ]);

    const results = await Bookmark.findAll({ where: { userId: 1 } });

    expect(results).toHaveLength(2);
    expect(results[0].recipeId).toBe(2);
    expect(results[1].recipeId).toBe(3);
  });

  it('should delete a bookmark', async () => {
    const bookmark = Bookmark.build({ id: 1, userId: 1, recipeId: 2 });
    
    bookmark.destroy = jest.fn().mockResolvedValue(1);

    await bookmark.destroy();

    expect(bookmark.destroy).toHaveBeenCalled();
  });
});
