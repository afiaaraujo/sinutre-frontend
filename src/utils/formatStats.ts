export const formatMealsForChart = (meals: any[]) => {
  const dataMap = meals.reduce((acc, meal) => {
    // Formata a data para ficar bonitinha no gráfico (ex: "18/07")
    const date = new Date(meal.eatTime).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    
    const calories = meal.items.reduce((sum: number, item: any) => {
      const calPerG = (item.food?.caloriesPer100g || 0) / 100;
      return sum + (calPerG * item.grams);
    }, 0);

    acc[date] = (acc[date] || 0) + calories;
    return acc;
  }, {});

  return Object.entries(dataMap).map(([date, calories]) => ({
    date,
    calories: Math.round(calories as number),
  }));
};
