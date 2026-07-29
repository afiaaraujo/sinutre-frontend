import { useState, useMemo, useEffect } from 'react';
import type { FoodItem } from '@/types/meal';
import { MealItemForm } from './MealItemForm';
import { MealItemsTable } from './MealItemsTable';
import { MealMacrosSummary } from './MealMacrosSummary';
import { MealMetadataForm } from './MealMetadataForm';
import { MealCategory } from '@/types/meal';
import { MEAL_CATEGORY_BY_ID } from '@/constants/mealCategories';
import { createMeal, updateMeal } from '@/services/mealService';
import { Meal } from '@/types/mealSummary';

import { MealState } from '@/types/meal';

interface AddMealModalProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  typeMeal: MealCategory | null;
  onMealCreated: () => Promise<void>;
  mealToEdit?: Meal | null;
}


export function AddMealModal({
  open,
  typeMeal,
  onClose,
  //onSave,
  onMealCreated,
  mealToEdit,
}: AddMealModalProps) {
  if(!typeMeal){
    return <></>
  }

  const category = MEAL_CATEGORY_BY_ID[typeMeal];

  const [meal, setMeal] = useState<MealState>({
    description: '',
    type: category.id,
    eatTime: '',
  });

  const [items, setItems] = useState<FoodItem[]>([]);

  useEffect(() => {
  if (mealToEdit) {
    // Formata a data para o padrão aceito pelo input datetime-local (YYYY-MM-DDTHH:mm)
    const formattedEatTime = mealToEdit.eatTime 
      ? new Date(mealToEdit.eatTime).toISOString().slice(0, 16) 
      : '';

    setMeal({
      description: mealToEdit.name,
      type: mealToEdit.type,
      eatTime: formattedEatTime,
    });
    
    setItems(mealToEdit.items.map(item => ({
      id: item.id,
      foodId: item.foodId,
      grams: item.grams,
      name: item.food?.name || '',
      calories: item.food?.caloriesPer100g ? (item.food.caloriesPer100g * item.grams / 100) : 0,
      carbs: item.food?.carbsPer100g ? (item.food.carbsPer100g * item.grams / 100) : 0,
      protein: item.food?.proteinPer100g ? (item.food.proteinPer100g * item.grams / 100) : 0,
      fat: item.food?.fatPer100g ? (item.food.fatPer100g * item.grams / 100) : 0,
    })));
  } else {
    setMeal({ 
      description: '', 
      type: category.id, 
      eatTime: '' 
    });
    setItems([]);
  }
}, [mealToEdit, category.id]);

  function handleAddItem(
    item: FoodItem,
  ) {
    setItems((current) => [
      ...current,
      item,
    ]);
  }

  function handleRemoveItem(
    item: FoodItem,
  ) {
    setItems((current) =>
      current.filter(
        (x) => x.id !== item.id,
      ),
    );
  }

  async function handleSaveMeal() {
    // Valida se a data preenchida é real. Se estiver vazia ou inválida, usa a data/hora atual.
    let dateToProcess = meal.eatTime ? new Date(meal.eatTime) : new Date();
    
    if (isNaN(dateToProcess.getTime())) {
      dateToProcess = new Date(); // fallback de segurança se a data vier corrompida
    }

    const formattedEatTime = dateToProcess.toISOString();

    const mealData = {
      ...meal,
      eatTime: formattedEatTime, 
      items: items.map((item) => ({
        foodId: item.foodId,
        grams: item.grams,
      })),
    };

    if (mealToEdit) {
      await updateMeal(mealToEdit.id, mealData);
    } else {
      await createMeal(mealData);
    }

    await onMealCreated();
    onClose();
  }

  const macros = useMemo(
    () =>
      items.reduce(
        (acc, item) => {
          acc.carbs += Number(item.carbs) || 0;
          acc.proteins += Number(item.protein) || 0;
          acc.fats += Number(item.fat) || 0;
          acc.calories += Number(item.calories) || 0;

          return acc;
        },
        {
          carbs: 0,
          proteins: 0,
          fats: 0,
          calories: 0,
          caloriesGoal: 0,
        },
      ),
    [items],
  );


  return (
    <div className={`modal ${open ? 'modal-open' : ''}`} role="dialog">
      <div className="modal-box max-w-6xl">
        <h2 className="text-3xl font-semibold mb-6">
    {mealToEdit ? 'Editar Refeição' : 'Adicionar Refeição'}
  </h2>
        
        <MealMacrosSummary macros={macros} />
        <MealMetadataForm meal={meal} setMeal={setMeal} />

        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-4">Itens da Refeição</h3>
          <MealItemForm onAdd={handleAddItem} />
        </div>

        <MealItemsTable items={items} onRemove={handleRemoveItem} />

        <div className="modal-action">
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            Cancelar
          </button>
          <button type="button" className="btn btn-primary" onClick={handleSaveMeal}>
            Salvar refeição
          </button>
        </div>
      </div>
    </div>
  );
}
