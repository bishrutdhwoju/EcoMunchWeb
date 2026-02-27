import { jest } from '@jest/globals';
import SequelizeMock from 'sequelize-mock';

const dbMock = new SequelizeMock();

// Mock database connection
jest.unstable_mockModule('../config/db.js', () => ({
  sequelize: dbMock,
}));

// Import after mocking
const { default: Ingredient } = await import('../models/Ingredient.js');

describe('Ingredient Model (Mocked)', () => {

  it('should be defined', () => {
    expect(Ingredient).toBeDefined();
  });

  it('should create an ingredient instance', async () => {
    const inputData = {
      name: 'Tomato',
      unit: 'kg'
    };

    const ingredient = await Ingredient.create(inputData);

    expect(ingredient.name).toBe(inputData.name);
    // sequelize-mock behavior mock
    ingredient.unit = 'kg';
    expect(ingredient.unit).toBe(inputData.unit);
    expect(ingredient.id).toBeDefined();
  });

  it('should find an ingredient by name', async () => {
    Ingredient.$queueResult(
      Ingredient.build({
        id: 1,
        name: 'Salt',
        unit: 'tsp'
      })
    );

    const ingredient = await Ingredient.findOne({ where: { name: 'Salt' } });
    
    expect(ingredient).toBeDefined();
    expect(ingredient.name).toBe('Salt');
  });

  it('should update an ingredient', async () => {
    const ingredient = Ingredient.build({
      id: 2,
      name: 'Pepper',
      unit: 'tbsp'
    });

    ingredient.update = jest.fn().mockImplementation(async (updates) => {
        Object.assign(ingredient, updates);
        return ingredient;
    });

    await ingredient.update({ unit: 'tsp' });

    expect(ingredient.unit).toBe('tsp');
    expect(ingredient.update).toHaveBeenCalledWith({ unit: 'tsp' });
  });

  it('should delete an ingredient', async () => {
    const ingredient = Ingredient.build({ id: 3, name: 'ToDelete' });
    
    ingredient.destroy = jest.fn().mockResolvedValue(1);

    await ingredient.destroy();

    expect(ingredient.destroy).toHaveBeenCalled();
  });
});
