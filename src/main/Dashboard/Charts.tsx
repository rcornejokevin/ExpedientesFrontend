import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/auth/AuthContext';
import { Indicators } from '@/models/Expediente';
import {
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const COLORS = ['#B18BFF', '#2F68FF', '#FF9736', '#00C49F', '#FF6384'];

const Charts = () => {
  const { user } = useAuth();
  const [series, setSeries] = useState<any[]>([]);
  const [slices, setSlices] = useState<any[]>([]);
  const [attended, setAttended] = useState<any[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const response: any = await Indicators(user?.jwt ?? '');
      if (response.code !== '000') return;
      const assignedByType = Array.isArray(response?.data?.assignedByType)
        ? response.data.assignedByType
        : [];
      const attendedByType = Array.isArray(response?.data?.attendedByType)
        ? response.data.attendedByType
        : [];
      const seriesByType = Array.isArray(response?.data?.series)
        ? response.data.series
        : [];

      const slicesI = assignedByType.map((item: any) => ({
        name: item.flow,
        value: Number(item.count) || 0,
      }));
      setSlices(slicesI);
      const seriesI = seriesByType.map((item: any) => ({
        value: item.date,
        assigned: Number(item.assigned) || 0,
        attended: Number(item.attended) || 0,
      }));
      setSeries(seriesI);
      const attendedI = attendedByType.map((item: any) => ({
        name: item.flow,
        value: Number(item.count) || 0,
      }));
      setAttended(attendedI);
    };
    fetchData();
  }, [user?.jwt]);

  const total = useMemo(
    () =>
      slices.reduce(
        (sum, s) => sum + (Number.isFinite(s.value) ? s.value : 0),
        0,
      ),
    [slices],
  );
  const totalAttended = useMemo(
    () =>
      attended.reduce(
        (sum, s) => sum + (Number.isFinite(s.value) ? s.value : 0),
        0,
      ),
    [attended],
  );

  return (
    <div>
      {series.length > 0 && (
        <>
          <div className="text-[12px] font-extrabold uppercase tracking-wide text-[#1E2851] mb-2">
            EXPEDIENTES ASIGNADOS / ATENDIDOS
          </div>
          <LineChart
            width={250}
            height={250}
            data={series.map((item: any) => ({
              name: item.value,
              Asignados: item.assigned,
              Atendidos: item.attended,
            }))}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="5 5" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="Asignados" stroke="#8884d8" />
            <Line type="monotone" dataKey="Atendidos" stroke="#82ca9d" />
          </LineChart>
        </>
      )}

      <hr
        className="my-5"
        style={{ backgroundColor: '#18CED7', height: '2px' }}
      />
      {slices.length > 0 && (
        <>
          <div className="text-[12px] font-extrabold uppercase tracking-wide text-[#1E2851] mb-2">
            TIPOS DE EXPEDIENTES ASIGNADOS
          </div>
          <div className="flex gap-3 items-start">
            <PieChart width={160} height={160}>
              <Pie
                data={slices}
                dataKey="value"
                nameKey="name"
                cx={80}
                cy={80}
                innerRadius={48}
                outerRadius={70}
                paddingAngle={2}
                stroke="#ffffff"
                strokeWidth={2}
              >
                {slices.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
            <div className="flex-1 mt-2 space-y-2">
              {slices.map((s, i) => {
                const pct = total > 0 ? Math.round((s.value / total) * 100) : 0;
                return (
                  <div
                    key={s.name + i}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="inline-block h-3 w-3 rounded-full"
                        style={{ backgroundColor: COLORS[i % COLORS.length] }}
                      />
                      <span className="text-[12px] text-[#1E2851]">
                        {s.name}
                      </span>
                    </div>
                    <span className="text-[12px] font-extrabold text-[#1E2851]">
                      {pct}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
      <hr
        className="my-5"
        style={{ backgroundColor: '#18CED7', height: '2px' }}
      />
      {attended.length > 0 && (
        <>
          <div className="text-[12px] font-extrabold uppercase tracking-wide text-[#1E2851] mb-2">
            TIPOS DE EXPEDIENTES ATENDIDOS
          </div>
          <div className="flex gap-3 items-start">
            <PieChart width={160} height={160}>
              <Pie
                data={attended}
                dataKey="value"
                nameKey="name"
                cx={80}
                cy={80}
                innerRadius={48}
                outerRadius={70}
                paddingAngle={2}
                stroke="#ffffff"
                strokeWidth={2}
              >
                {attended.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
            <div className="flex-1 mt-2 space-y-2">
              {attended.map((s, i) => {
                const pct =
                  totalAttended > 0
                    ? Math.round((s.value / totalAttended) * 100)
                    : 0;
                return (
                  <div
                    key={s.name + i}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="inline-block h-3 w-3 rounded-full"
                        style={{ backgroundColor: COLORS[i % COLORS.length] }}
                      />
                      <span className="text-[12px] text-[#1E2851]">
                        {s.name}
                      </span>
                    </div>
                    <span className="text-[12px] font-extrabold text-[#1E2851]">
                      {pct}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
export default Charts;
