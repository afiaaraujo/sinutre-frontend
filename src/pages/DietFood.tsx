import { useEffect, useState } from 'react';
import { Plus } from '@phosphor-icons/react';

import { SimpleHeader } from '@/components/layout/SimpleHeader';
import { AddFoodModal } from '@/components/modal/AddFoodModal';

import { getFoods } from '@/services/foodService';
import type { Food } from '@/types/food';

const MODAL_ID = 'create-food-modal';

export function DietFoodPage() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingFood, setEditingFood] = useState<Food | null>(null);
  const EDIT_MODAL_ID = 'edit-food-modal';

  async function loadFoods() {
    try {
      const data = await getFoods();
      setFoods(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFoods();
  }, []);

  return (
    <div className="w-full max-w-[1200px] mx-auto">
      <SimpleHeader
        title="Dieta"
        subtitle="Gerencie seus alimentos"
      />

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <div className="grid gap-4 mt-6">
          {foods.map((food) => (
            <div
              key={food.id}
              className="card bg-base-100 shadow-sm"
            >
              <div className="card-body">
                <h2 className="card-title flex justify-between items-center">
  {food.name}
  <button 
    className="btn btn-ghost btn-sm"
    onClick={() => {
      setEditingFood(food);
      (document.getElementById(EDIT_MODAL_ID) as HTMLDialogElement)?.showModal();
    }}
  >
    ✏️
  </button>
</h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                  <span>
                    🔥 {food.caloriesPer100g} kcal
                  </span>

                  <span>
                    🍞 {food.carbsPer100g} g
                  </span>

                  <span>
                    🍗 {food.proteinPer100g} g
                  </span>

                  <span>
                    🥑 {food.fatPer100g} g
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
  className="btn btn-primary btn-circle btn-lg fixed bottom-6 right-6 shadow-lg z-50"
  onClick={() => {
    setEditingFood(null);
    (document.getElementById(MODAL_ID) as HTMLDialogElement)?.showModal();
  }}
>
  <Plus size={24} weight="bold" />
</button>

      <AddFoodModal
  key="modal-create" 
  modalId={MODAL_ID}
  foodToEdit={null}
  onCreated={loadFoods}
/>

<AddFoodModal
  key="modal-edit"
  modalId={EDIT_MODAL_ID}
  foodToEdit={editingFood}
  onCreated={loadFoods}
/>
    </div>
  );
}
