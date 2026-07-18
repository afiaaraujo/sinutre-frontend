import { api } from '@/lib/api';

export async function createMeal(
  meal: {
    type: string;
    eatTime: string;
    description?: string;

    items: {
      foodId: number;
      grams: number;
    }[];
  },
) {
  return api.post('/meals', meal);
}

export async function updateMeal(
  id: number,
  meal: {
    type: string;
    eatTime: string;
    description?: string;
    items: {
      foodId: number;
      grams: number;
    }[];
  },
) {
  return api.put(`/meals/${id}`, meal);
}

export async function getMeals() {
  const response = await api.get('/meals');
  return response.data;
}
