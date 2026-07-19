import { useState } from 'react';
import { createFood, updateFood } from '@/services/foodService';
import type { Food } from '@/types/food';
import { useEffect } from 'react';

interface AddFoodModalProps {
  modalId: string;
  onCreated: () => Promise<void> | void;
  foodToEdit?: Food | null;
}

export function AddFoodModal({
  modalId,
  onCreated,
  foodToEdit
}: AddFoodModalProps) {
  const [name, setName] = useState('');

  const [caloriesPer100g, setCaloriesPer100g] =
    useState('');

  const [carbsPer100g, setCarbsPer100g] =
    useState('');

  const [proteinPer100g, setProteinPer100g] =
    useState('');

  const [fatPer100g, setFatPer100g] =
    useState('');

  const [loading, setLoading] = useState(false);

  useEffect(() => {
  if (foodToEdit) {
    setName(foodToEdit.name);
    setCaloriesPer100g(String(foodToEdit.caloriesPer100g));
    setCarbsPer100g(String(foodToEdit.carbsPer100g));
    setProteinPer100g(String(foodToEdit.proteinPer100g));
    setFatPer100g(String(foodToEdit.fatPer100g));
  } else {
    // Limpa os campos se for um novo cadastro
    setName('');
    setCaloriesPer100g('');
    setCarbsPer100g('');
    setProteinPer100g('');
    setFatPer100g('');
  }
}, [foodToEdit]);

async function handleSave() {
  try {
    setLoading(true);

    const foodData = {
      name,
      caloriesPer100g: Number(caloriesPer100g),
      carbsPer100g: Number(carbsPer100g),
      proteinPer100g: Number(proteinPer100g),
      fatPer100g: Number(fatPer100g),
    };

    if (foodToEdit) {
      // Edição
      await updateFood(foodToEdit.id, foodData);
    } else {
      // Criação
      await createFood(foodData);
    }

    await onCreated();
    (document.getElementById(modalId) as HTMLDialogElement)?.close();
  } finally {
    setLoading(false);
  }
}

  return (
    <dialog id={modalId} className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">
  {foodToEdit ? 'Editar alimento' : 'Novo alimento'}
</h3>

        <div className="space-y-3 mt-4">
          <input
            className="input input-bordered w-full"
            placeholder="Nome"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
          />

          <input
            type="number"
            className="input input-bordered w-full"
            placeholder="Calorias por 100g"
            value={caloriesPer100g}
            onChange={(e) =>
              setCaloriesPer100g(e.target.value)
            }
          />

          <input
            type="number"
            className="input input-bordered w-full"
            placeholder="Carboidratos por 100g"
            value={carbsPer100g}
            onChange={(e) =>
              setCarbsPer100g(e.target.value)
            }
          />

          <input
            type="number"
            className="input input-bordered w-full"
            placeholder="Proteínas por 100g"
            value={proteinPer100g}
            onChange={(e) =>
              setProteinPer100g(e.target.value)
            }
          />

          <input
            type="number"
            className="input input-bordered w-full"
            placeholder="Gorduras por 100g"
            value={fatPer100g}
            onChange={(e) =>
              setFatPer100g(e.target.value)
            }
          />
        </div>

        <div className="modal-action">
          <form method="dialog">
            <button className="btn">
              Cancelar
            </button>
          </form>

          <button
            className="btn btn-primary"
            disabled={loading}
            onClick={handleSave}
          >
            {loading ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>
    </dialog>
  );
}
