import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getMeals } from '@/services/mealService';
import { formatMealsForChart } from '@/utils/formatStats';

export function StatsPage() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const meals = await getMeals();
        const formattedData = formatMealsForChart(meals);
        setData(formattedData);
      } catch (error) {
        console.error("Erro ao carregar refeições:", error);
      }
    }
    loadData();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">Evolução de Calorias</h2>
      
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="calories" stroke="#8884d8" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
