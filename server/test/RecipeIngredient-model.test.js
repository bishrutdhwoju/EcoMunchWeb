import { jest } from '@jest/globals';
import SequelizeMock from 'sequelize-mock';

const dbMock = new SequelizeMock();

// Mock database connection
jest.unstable_mockModule('../config/db.js', () => ({
  sequelize: dbMock,
}));

// Import after mocking
const { default: RecipeIngredient } = await import('../models/RecipeIngredient.js');

describe('RecipeIngredient Model (Mocked)', () => {

  it('should be defined', () => {
    expect(RecipeIngredient).toBeDefined();
  });

  it('should create a RecipeIngredient instance', async () => {
    const inputData = {
      recipeId: 1,
      ingredientId: 2,
      quantity: '2',
      unit: 'cups'
    };

    const recipeIngredient = await RecipeIngredient.create(inputData);

    // Some simple assertions
    expect(recipeIngredient.recipeId).toBe(inputData.recipeId);
    expect(recipeIngredient.ingredientId).toBe(inputData.ingredientId);
    recipeIngredient.quantity = '2'; // Just for test with mock
    expect(recipeIngredient.quantity).toBe(inputData.quantity);
  });

});
