import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '@/lib/metricsUtils';

interface SpendDataPoint {
  date: string;
  usd: number;
  forecast?: number;
}

interface SpendTrendChartProps {
  data: SpendDataPoint[];
  loading?: boolean;
  timeRange?: '7d' | '30d' | 'mtd' | 'qtd';
}

export default function SpendTrendChart({ data, loading = false }: SpendTrendChartProps) {
  if (loading) {
    return (
      <div className="h-64 bg-white/5 rounded-lg animate-pulse flex items-center justify-center">
        <span className="text-white/50">Loading chart...</span>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-64 bg-white/5 rounded-lg flex items-center justify-center">
        <span className="text-white/50">No data for selected range</span>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black/80 border border-white/20 rounded-lg p-3 text-sm">
          <p className="text-white/70 mb-1">{label}</p>
          <p className="text-white">
            Spend: <span className="text-cyan-300">{formatCurrency(payload[0].value)}</span>
          </p>
          {payload[1] && (
            <p className="text-white">
              Forecast: <span className="text-amber-300">{formatCurrency(payload[1].value)}</span>
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis 
            dataKey="date" 
            stroke="rgba(255,255,255,0.6)"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="rgba(255,255,255,0.6)"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line 
            type="monotone" 
            dataKey="usd" 
            stroke="#06b6d4" 
            strokeWidth={2}
            dot={{ fill: '#06b6d4', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#06b6d4', strokeWidth: 2 }}
          />
          {data.some(d => d.forecast) && (
            <Line 
              type="monotone" 
              dataKey="forecast" 
              stroke="#f59e0b" 
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
