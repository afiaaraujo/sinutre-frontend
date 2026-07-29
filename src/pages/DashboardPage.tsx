import { useState, useEffect, useMemo } from 'react';
import { AddMealCard } from '@/components/cards/AddMealCard';
import { TotalMealsCard } from '@/components/cards/TotalMealsCard';
import { Header } from '@/components/layout/Header';
import { MacroStatsBar } from '@/components/macros/MacroStatsBar';
import { MealFab } from '@/components/meals/MealFab';
import { MealsTable } from '@/components/meals/MealsTable';
import { AddMealModal } from '@/components/modal/AddMealModal';
import { useAuth } from '@/context/AuthContext';
import { Meal } from '@/types/mealSummary';
import { MealCategory } from '@/types/meal';
import { api } from '@/lib/api';
import { deleteMeal } from '@/services/mealService';
import { useMealModal } from '@/hooks/useMealModal';

interface DashboardPageProps {
  drawerId: string;
}

export function DashboardPage({ drawerId }: DashboardPageProps) {
  const { user } = useAuth();
  if (!user){
    return <></>
  }
  const modal = useMealModal();

  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null);

  async function loadMeals() {
    try {
      const response = await api.get('/meals');
      setMeals(response.data);
    } finally {
      setLoading(false);
    }
  }

  // Função chamada ao clicar em editar na tabela
  const handleEditMeal = (meal: Meal) => {
    setEditingMeal(meal);
    modal.openWith(meal.type); 
  };

  // Função dedicada para abrir o modal limpando qualquer rastro de edição anterior (Criação nova)
  const handleOpenCreateModal = (category: MealCategory) => {
    setEditingMeal(null);
    modal.openWith(category);
  };

  useEffect(() => {
    loadMeals();
  }, []);

  async function handleDeleteMeal(meal: Meal) {
    if (window.confirm(`Deseja realmente excluir a refeição "${meal.name || 'sem descrição'}"?`)) {
      try {
        await deleteMeal(meal.id); 
        loadMeals(); 
      } catch (error) {
        console.error("Erro ao excluir refeição:", error);
      }
    }
  }

  const mealsSummary = useMemo(() => {
    const today = new Date();

    const total = meals.length;

    const todayCount = meals.filter((meal) => {
      const date = new Date(meal.eatTime);

      return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
      );
    }).length;

    const monthCount = meals.filter((meal) => {
      const date = new Date(meal.eatTime);

      return (
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
      );
    }).length;

    return {
      total,
      thisMonth: monthCount,
      today: todayCount,
    };
  }, [meals]);

  const macroSummary = useMemo(() => {
    const today = new Date();
    return meals.filter((meal) => {
      const date = new Date(meal.eatTime);
      return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
      );
    }).reduce(
      (acc, meal) => {
        acc.carbs += meal.totals.carbs ?? 0;
        acc.proteins += meal.totals.proteins ?? 0;
        acc.fats += meal.totals.fats ?? 0;
        acc.calories += meal.totals.calories ?? 0;

        return acc;
      },
      {
        carbs: 0,
        proteins: 0,
        fats: 0,
        calories: 0,
        caloriesGoal: 2000,
      },
    );
  }, [meals]);

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <span className="text-gray-500">Carregando...</span>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-6 w-full max-w-[1200px] mx-auto mb-8">
        <Header
          drawerId={drawerId}
          userName={user.name}
          avatarUrl={user.avatarUrl}
        />

        <MacroStatsBar summary={macroSummary} />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6 items-stretch">
          <TotalMealsCard summary={mealsSummary} />
          {/* Usa a função que limpa o editingMeal para novos cadastros */}
          <AddMealCard onSelectCategory={handleOpenCreateModal} />
        </div>

        <MealsTable 
          meals={meals} 
          onEdit={handleEditMeal} 
          onDelete={handleDeleteMeal} 
        />
      </div>

      {/* Usa a função que limpa o editingMeal para novos cadastros */}
      <MealFab onSelectCategory={handleOpenCreateModal} />

      <AddMealModal
        open={modal.open}
        typeMeal={modal.selectedCategory}
        onClose={() => {
          setEditingMeal(null);
          modal.close();
        }}
        onSave={modal.close}
        onMealCreated={loadMeals}
        mealToEdit={editingMeal}
      />
    </>
  );
}
