import { jest } from '@jest/globals';
import SequelizeMock from 'sequelize-mock';

const dbMock = new SequelizeMock();

// Mock database connection
jest.unstable_mockModule('../config/db.js', () => ({
  sequelize: dbMock,
}));

// Import after mocking
const { default: Category } = await import('../models/Category.js');

describe('Category Model (Mocked)', () => {

  it('should be defined', () => {
    expect(Category).toBeDefined();
  });

  it('should create a category instance', async () => {
    const inputData = {
      name: 'Dessert'
    };

    const category = await Category.create(inputData);

    expect(category.name).toBe(inputData.name);
    expect(category.id).toBeDefined();
  });

  it('should find all categories', async () => {
    Category.$queueResult([
      Category.build({ name: 'Dessert' }),
      Category.build({ name: 'Main Course' })
    ]);

    const results = await Category.findAll();

    expect(results).toHaveLength(2);
    expect(results[0].name).toBe('Dessert');
    expect(results[1].name).toBe('Main Course');
  });

  it('should update a category', async () => {
    const category = Category.build({
      id: 1,
      name: 'Drinks'
    });

    category.update = jest.fn().mockImplementation(async (updates) => {
        Object.assign(category, updates);
        return category;
    });

    await category.update({ name: 'Beverages' });

    expect(category.name).toBe('Beverages');
    expect(category.update).toHaveBeenCalledWith({ name: 'Beverages' });
  });

  it('should delete a category', async () => {
    const category = Category.build({ id: 2, name: 'ToDelete' });
    
    category.destroy = jest.fn().mockResolvedValue(1);

    await category.destroy();

    expect(category.destroy).toHaveBeenCalled();
  });
});
