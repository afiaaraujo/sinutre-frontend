import { useState, useRef, useEffect } from 'react';
import { DotsThree, Pencil, Trash } from '@phosphor-icons/react';
import { MEAL_CATEGORY_BY_ID } from '@/constants/mealCategories';
import type { Meal } from '@/types/mealSummary';
import { formatDate } from '@/utils/date';

interface MealsTableRowProps {
  meal: Meal;
  onEdit: (meal: Meal) => void;
  onDelete: (meal: Meal) => void;
}

export function MealsTableRow({ meal, onEdit, onDelete }: MealsTableRowProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const category = MEAL_CATEGORY_BY_ID[meal.type];

  // Fecha o menu se o usuário clicar fora dele
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <tr className="hover">
      <td className="text-center font-bold text-base-content/60">{meal.id}</td>
      <td className="font-medium">{meal.name}</td>
      <td className="font-medium">{formatDate(meal.eatTime)}</td>
      <td className="font-semibold">{category.label}</td>
      <td>
        <span className="badge badge-primary badge-outline">
          {meal.totals.calories} kcal
        </span>
      </td>
      <td className="text-center relative">
        <div className="inline-block" ref={menuRef}>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="btn btn-sm btn-ghost btn-square"
            aria-label="Mais ações"
          >
            <DotsThree size={20} weight="bold" />
          </button>

          {/* Menu Flutuante (Dropdown) */}
          {isOpen && (
            <div className="absolute right-8 top-0 w-32 bg-base-100 border border-base-300 rounded-box shadow-lg z-20 py-1 flex flex-col">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onEdit(meal);
                }}
                className="flex items-center gap-2 w-full px-4 py-2 text-xs text-left hover:bg-base-200"
              >
                <Pencil size={14} /> Editar
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  // Trata o ID caso venha duplicado ou como string com dois pontos (ex: "1:1")
                  const rawId = String(meal.id);
                  const cleanId = rawId.includes(':') ? Number(rawId.split(':')[1]) : Number(rawId);
                  
                  onDelete({ ...meal, id: cleanId });
                }}
                className="flex items-center gap-2 w-full px-4 py-2 text-xs text-left text-error hover:bg-base-200"
              >
                <Trash size={14} /> Excluir
              </button>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
}
