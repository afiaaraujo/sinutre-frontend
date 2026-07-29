export const formatMealsForChart = (meals: any[]) => {
  const dataMap = meals.reduce((acc, meal) => {
    // Formata a data para o gráfico (ex: "18/07")
    const date = new Date(meal.eatTime).toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit' 
    });
    
    // Pega as calorias totais que já vêm calculadas do backend
    const calories = meal.totals?.calories || 0;

    acc[date] = (acc[date] || 0) + calories;
    return acc;
  }, {});

  return Object.entries(dataMap).map(([date, calories]) => ({
    date,
    calories: Math.round(calories as number),
  }));
};
