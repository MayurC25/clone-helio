export interface HelioLiveContext {
  location?: {
    latitude: number;
    longitude: number;
    label: string;
  };
  weather?: {
    tempC: number;
    condition: string;
    irradianceWm2: number;
    windSpeedKmh: number;
    humidity?: number;
  };
  forecast?: Array<{
    date: string;
    tempMax: number;
    tempMin: number;
    irradiance: number;
    condition: string;
  }>;
  telemetry?: {
    generationKw?: number;
    voltage?: number;
    currentA?: number;
    healthScore?: number;
    irradianceWm2?: number;
    temperatureC?: number;
  };
  scanner?: {
    modelLoaded: boolean;
    inferenceMode?: string;
    backendOnline?: boolean;
  };
  fetchedAt: string;
}

export async function fetchWeatherByCoords(
  latitude: number,
  longitude: number
): Promise<Pick<HelioLiveContext, "weather" | "forecast" | "location">> {
  const res = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,shortwave_radiation_sum,weathercode&timezone=auto`
  );

  if (!res.ok) {
    throw new Error("Weather API unavailable");
  }

  const data = await res.json();
  const forecast = data.daily.time.map((time: string, i: number) => ({
    date: new Date(time).toLocaleDateString("en-US", { weekday: "short" }),
    tempMax: data.daily.temperature_2m_max[i],
    tempMin: data.daily.temperature_2m_min[i],
    irradiance: Math.round(data.daily.shortwave_radiation_sum[i] / 3.6),
    condition: data.daily.weathercode[i] < 3 ? "Clear" : "Cloudy",
  }));

  return {
    location: {
      latitude,
      longitude,
      label: `LAT ${latitude.toFixed(2)}, LON ${longitude.toFixed(2)}`,
    },
    weather: {
      tempC: data.current_weather.temperature,
      condition:
        data.current_weather.weathercode < 3 ? "Clear Sky" : "Cloudy",
      irradianceWm2: Math.round(data.daily.shortwave_radiation_sum[0] / 3.6),
      windSpeedKmh: data.current_weather.windspeed,
      humidity: 45,
    },
    forecast,
  };
}

export function getBrowserLocation(): Promise<GeolocationCoordinates> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation not supported"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position.coords),
      (error) => reject(error),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  });
}

export async function fetchScannerContext(): Promise<
  HelioLiveContext["scanner"]
> {
  try {
    const res = await fetch("/api/scan", { cache: "no-store" });
    const data = await res.json();
    return {
      modelLoaded: !!data.model_loaded,
      inferenceMode: data.inference_mode,
      backendOnline: !!data.backend_online,
    };
  } catch {
    return { modelLoaded: false, backendOnline: false, inferenceMode: "offline" };
  }
}

export async function buildHelioContext(options?: {
  telemetry?: HelioLiveContext["telemetry"];
}): Promise<HelioLiveContext> {
  const context: HelioLiveContext = {
    fetchedAt: new Date().toISOString(),
    telemetry: options?.telemetry,
  };

  try {
    const coords = await getBrowserLocation();
    const weatherData = await fetchWeatherByCoords(
      coords.latitude,
      coords.longitude
    );
    Object.assign(context, weatherData);
  } catch {
    // Location denied or unavailable — chat can still use telemetry/scanner data.
  }

  context.scanner = await fetchScannerContext();
  return context;
}

export function formatContextForPrompt(context: HelioLiveContext): string {
  return JSON.stringify(context, null, 2);
}
