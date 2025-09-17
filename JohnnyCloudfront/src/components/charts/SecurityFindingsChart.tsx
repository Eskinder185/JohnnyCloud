import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface SecurityDataPoint {
  date: string;
  high: number;
  medium: number;
  low: number;
}

interface SecurityFindingsChartProps {
  data: SecurityDataPoint[];
  loading?: boolean;
  dataSource?: 'guardduty' | 'securityhub' | 'both';
}

export default function SecurityFindingsChart({ 
  data, 
  loading = false
}: SecurityFindingsChartProps) {
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
        <span className="text-white/50">No security findings for selected range</span>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black/80 border border-white/20 rounded-lg p-3 text-sm">
          <p className="text-white/70 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-white">
              <span 
                className="inline-block w-3 h-3 rounded-full mr-2" 
                style={{ backgroundColor: entry.color }}
              />
              {entry.name}: <span className="text-cyan-300">{entry.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="high" stackId="a" fill="#ef4444" name="High" />
          <Bar dataKey="medium" stackId="a" fill="#f59e0b" name="Medium" />
          <Bar dataKey="low" stackId="a" fill="#10b981" name="Low" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
