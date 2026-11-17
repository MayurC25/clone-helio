"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CloudSun, Droplets, Wind, Navigation, AlertCircle, Sun, CloudRain, Thermometer } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface DailyForecast {
  date: string;
  tempMax: number;
  tempMin: number;
  condition: string;
  irradiance: number;
}

interface WeatherData {
  current: {
    temp: number;
    condition: string;
    irradiance: number;
    humidity: number;
    windSpeed: number;
  };
  forecast: DailyForecast[];
  location: string;
}

export function WeatherSection() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,shortwave_radiation_sum,weathercode&timezone=auto`
          );
          const data = await res.json();
          
          const forecast: DailyForecast[] = data.daily.time.map((time: string, i: number) => ({
            date: new Date(time).toLocaleDateString('en-US', { weekday: 'short' }),
            tempMax: data.daily.temperature_2m_max[i],
            tempMin: data.daily.temperature_2m_min[i],
            irradiance: Math.round(data.daily.shortwave_radiation_sum[i] / 3.6), // MJ/m2 to average W/m2 approximation
            condition: data.daily.weathercode[i] < 3 ? "Clear" : "Cloudy"
          }));

          setWeather({
            current: {
              temp: data.current_weather.temperature,
              condition: data.current_weather.weathercode < 3 ? "Clear Sky" : "Cloudy",
              irradiance: Math.round(data.daily.shortwave_radiation_sum[0] / 3.6),
              humidity: 45, // Placeholder as Open-Meteo current doesn't always provide it
              windSpeed: data.current_weather.windspeed,
            },
            forecast,
            location: `LAT: ${latitude.toFixed(2)}, LON: ${longitude.toFixed(2)}`
          });
        } catch (err) {
          setError("Failed to fetch local weather data");
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError("Location access denied.");
        setLoading(false);
      }
    );
  }, []);

  if (loading) return <div className="animate-pulse bg-white rounded-xl h-96 border border-slate-200" />;

  const getRecommendation = (w: WeatherData) => {
    const avgIrradiance = w.forecast.reduce((acc, f) => acc + f.irradiance, 0) / 7;
    if (avgIrradiance > 600) {
      return {
        title: "High Yield Week Ahead",
        desc: "Irradiance levels are exceptionally high. Maximize solar capture during peak hours to ensure maximum energy storage.",
        action: "Enable Weather-Adaptive Mode"
      };
    } else if (w.current.temp > 35) {
      return {
        title: "Efficiency Warning: High Heat",
        desc: "Current temperatures are affecting panel resistance. Generation efficiency may drop by 15%. Automated water cooling systems should be activated.",
        action: "Activate Cooling"
      };
    }
    return {
      title: "Balanced Generation",
      desc: "Standard conditions expected. Routine maintenance (panel cleaning) recommended on Tuesday to prepare for the mid-week sun spike.",
      action: "Schedule Cleaning"
    };
  };

  const recommendation = weather ? getRecommendation(weather) : null;

  return (
    <Card className="border-slate-200 shadow-lg overflow-hidden bg-white">
      <CardHeader className="bg-slate-50/50 border-b border-slate-200 py-4">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <CloudSun className="w-5 h-5 text-emerald-500" />
              Helio-Weather Intelligence
            </CardTitle>
            <p className="text-[10px] text-slate-400 mt-0.5 uppercase tracking-wider font-bold">{weather?.location}</p>
          </div>
          <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-100 px-3 py-1">
            Real-time GPS Sync
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Current Status */}
          <div className="space-y-6">
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-tight mb-4">Current Conditions</p>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-4xl font-black text-slate-900">{weather?.current.temp}°</h3>
                  <p className="text-sm font-medium text-slate-500">{weather?.current.condition}</p>
                </div>
                <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center">
                  <Sun className="w-8 h-8 text-yellow-500 animate-spin-slow" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-50 rounded-lg"><Wind className="w-4 h-4 text-blue-500" /></div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold">WIND</p>
                    <p className="text-sm font-bold text-slate-700">{weather?.current.windSpeed} km/h</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-emerald-50 rounded-lg"><Sun className="w-4 h-4 text-emerald-500" /></div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold">SOLAR</p>
                    <p className="text-sm font-bold text-emerald-600">{weather?.current.irradiance} W/m²</p>
                  </div>
                </div>
              </div>
            </div>

            {recommendation && (
              <div className="p-5 rounded-2xl bg-emerald-600 text-white shadow-xl shadow-emerald-100 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                  <AlertCircle className="w-12 h-12" />
                </div>
                <h4 className="text-sm font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {recommendation.title}
                </h4>
                <p className="text-xs text-emerald-50 mt-2 leading-relaxed font-medium">
                  {recommendation.desc}
                </p>
                <button className="mt-4 w-full bg-white text-emerald-600 text-[10px] font-bold py-2 rounded-lg hover:bg-emerald-50 transition-colors uppercase tracking-widest">
                  {recommendation.action}
                </button>
              </div>
            )}
          </div>

          {/* Forecast & Chart */}
          <div className="lg:col-span-2 space-y-6">
            <div className="h-48 w-full">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-tight mb-4">Predicted Solar Harvest (7 Days)</p>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weather?.forecast}>
                  <defs>
                    <linearGradient id="colorIrr" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                  <YAxis hide domain={[0, 'auto']} />
                  <Tooltip 
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                  />
                  <Area type="monotone" dataKey="irradiance" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorIrr)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-7 gap-2 pt-4 border-t border-slate-100">
              {weather?.forecast.map((day, i) => (
                <div key={i} className="text-center p-2 rounded-xl hover:bg-slate-50 transition-colors">
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">{day.date}</p>
                  <div className="flex justify-center mb-2">
                    {day.condition === "Clear" ? (
                      <Sun className="w-5 h-5 text-yellow-500" />
                    ) : (
                      <CloudRain className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                  <p className="text-xs font-bold text-slate-700">{day.tempMax}°</p>
                  <p className="text-[10px] font-medium text-slate-400">{day.tempMin}°</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </CardContent>
    </Card>
  );
}
