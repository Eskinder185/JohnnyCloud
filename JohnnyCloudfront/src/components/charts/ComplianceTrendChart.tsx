import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceDot } from 'recharts';

interface ComplianceDataPoint {
  date: string;
  score: number;
  passed: number;
  failed: number;
  total: number;
  hasRemediation?: boolean;
  remediationType?: string;
}

interface ComplianceTrendChartProps {
  data: ComplianceDataPoint[];
  loading?: boolean;
  timeRange?: '30d' | '90d';
}

export default function ComplianceTrendChart({ 
  data, 
  loading = false
}: ComplianceTrendChartProps) {
  if (loading) {
    return (
      <div className="h-64 bg-white/5 rounded-lg animate-pulse flex items-center justify-center">
        <span className="text-white/50">Loading compliance trend...</span>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-64 bg-white/5 rounded-lg flex items-center justify-center">
        <span className="text-white/50">No compliance data available</span>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-black/80 border border-white/20 rounded-lg p-3 text-sm">
          <p className="text-white/70 mb-1">{label}</p>
          <p className="text-white">
            Score: <span className="text-cyan-300">{data.score}%</span>
          </p>
          <p className="text-white">
            Passed: <span className="text-green-400">{data.passed}</span> / Failed: <span className="text-red-400">{data.failed}</span>
          </p>
          {data.hasRemediation && (
            <p className="text-white">
              Remediation: <span className="text-amber-300">{data.remediationType}</span>
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  const CustomReferenceDot = (props: any) => {
    const { payload } = props;
    if (payload.hasRemediation) {
      return (
        <ReferenceDot
          {...props}
          r={6}
          fill="#f59e0b"
          stroke="#f59e0b"
          strokeWidth={2}
        />
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
            tickFormatter={(value) => {
              const date = new Date(value);
              return `${date.getMonth() + 1}/${date.getDate()}`;
            }}
          />
          <YAxis 
            stroke="rgba(255,255,255,0.6)"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            domain={[0, 100]}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line 
            type="monotone" 
            dataKey="score" 
            stroke="#06b6d4" 
            strokeWidth={3}
            dot={(props) => <CustomReferenceDot {...props} />}
            activeDot={{ r: 6, stroke: '#06b6d4', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
