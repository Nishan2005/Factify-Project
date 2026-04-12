import { useEffect, useMemo, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import Card from "../components/Card";
import Button from "../components/Button";

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/admin/dashboard");
        setData(response.data);
      } catch (err) {
        if (err.response?.status === 403) {
          setError("You are not authorized to access this dashboard.");
        } else {
          setError("Failed to load dashboard.");
        }
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const performance = useMemo(() => {
    if (!data?.modelPerformance) return [];
    return [
      { label: "Avg Final Score", value: data.modelPerformance.averageFinalScore },
      { label: "Avg Pattern Score", value: data.modelPerformance.averagePatternScore },
      { label: "Avg Evidence Score", value: data.modelPerformance.averageEvidenceScore },
    ];
  }, [data]);

  const handleDownload = async () => {
    try {
      setDownloading(true);
      const response = await axiosInstance.get("/admin/export", {
        responseType: "blob",
      });
      const blob = new Blob([response.data], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "prediction-data-export.csv";
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      setError("Failed to download export.");
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return <div className="container-max py-10">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="container-max py-10 text-rose-600 font-semibold">{error}</div>;
  }

  return (
    <div className="bg-slate-50 pl-6 pr-6">
      <section className="container-max py-8 md:py-10 space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Admin Dashboard</h1>
          <Button variant="primary" onClick={handleDownload} disabled={downloading}>
            {downloading ? "Preparing Export..." : "Download Excel Data (CSV)"}
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <StatCard label="Total Users" value={data.totalUsers} />
          <StatCard label="Total Predictions" value={data.totalPredictions} />
          <StatCard label="Total Feedback" value={data.totalFeedback} />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <ChartCard title="Verdict Distribution" items={data.verdictChart ?? []} />
          <ChartCard title="Language Distribution" items={data.languageChart ?? []} />
          <ChartCard title="Feedback Distribution" items={data.feedbackChart ?? []} />
        </div>

        <Card className="p-5">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Model Performance</h2>
          <div className="grid gap-3 md:grid-cols-3">
            {performance.map((metric) => (
              <div key={metric.label} className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                <p className="text-sm text-slate-500">{metric.label}</p>
                <p className="text-xl font-bold text-brand-700">{(metric.value * 100).toFixed(2)}%</p>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <Card className="p-5">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-3xl font-extrabold text-slate-900">{value ?? 0}</p>
    </Card>
  );
}

// function ChartCard({ title, items }) {
//   const max = Math.max(...items.map((item) => item.count)) || 1;

//   return (
//     <Card className="p-5">
//       <h2 className="text-lg font-bold text-slate-900 mb-4">{title}</h2>
//       <div className="space-y-3">
//         {items.length === 0 ? (
//           <p className="text-sm text-slate-400">No data yet.</p>
//         ) : (
//           items.map((item) => (
//             <div key={item.label}>
//               <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-1">
//                 <span>{item.label}</span>
//                 <span>{item.count}</span>
//               </div>
//               <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
//                 <div className="h-full rounded-full bg-brand-700" style={{ width: `${(item.count / max) * 100}%` }} />
//               </div>
//             </div>
//           ))
//         )}
//       </div>
//     </Card>
//   );
// }
function ChartCard({ title, items }) {
  const total = items.reduce((sum, item) => sum + Number(item.count), 0) || 1;

  return (
    <Card className="p-5">
      <h2 className="text-lg font-bold text-slate-900 mb-4">{title}</h2>
      <div className="space-y-3">
        {items.length === 0 ? (
          <p className="text-sm text-slate-400">No data yet.</p>
        ) : (
          items.map((item) => {
            const percent = Math.min((Number(item.count) / total) * 100, 100);
            return (
              <div key={item.label}>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-1">
                  <span>{item.label}</span>
                  <span>{item.count}</span>
                </div>
                <div className="h-2 rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${percent}%`,
                      backgroundColor: "var(--color-brand-700, #1d4ed8)",
                      minWidth: percent > 0 ? "4px" : "0",
                      transition: "width 0.3s ease",
                    }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
}
