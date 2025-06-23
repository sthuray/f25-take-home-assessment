import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export type WeatherData = {
  location: {
    name: string;
    country: string;
    localtime: string;
  };
  current: {
    temperature: number;
    feelslike: number;
    weather_descriptions: string[];
    weather_icons: string[];
    humidity: number;
    wind_speed: number;
    wind_dir: string;
    pressure: number;
    uv_index: number;
    astro: {
      sunrise: string;
      sunset: string;
    };
    air_quality: {
      "us-epa-index": string;
    };
  };
};

type WeatherDisplayProps = {
  data: WeatherData;
};

export function WeatherDisplay({ data }: WeatherDisplayProps) {
  const { location, current } = data;

  const renderAirQualityLabel = (index?: string) => {
    switch (index) {
      case "1":
        return "Good";
      case "2":
        return "Moderate";
      case "3":
        return "Unhealthy for Sensitive Groups";
      case "4":
        return "Unhealthy";
      case "5":
        return "Very Unhealthy";
      case "6":
        return "Hazardous";
      default:
        return "Unknown";
    }
  };

  const epaIndex = current.air_quality?.["us-epa-index"];

  return (
    <Card className="bg-slate-900/50 text-slate-100">
      <CardHeader>
        <CardTitle>{location.name}</CardTitle>
        <CardDescription>Local time: {location.localtime}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center space-x-6 w-full">
          <img
            src={current.weather_icons?.[0]}
            alt="weather icon"
            className="w-16 h-16 flex-shrink-0"
          />
          <div className="flex flex-col justify-center flex-grow">
            <p className="text-4xl font-semibold">{current.temperature}°C</p>
            <p className="text-slate-300">
              {current.weather_descriptions?.join(", ")}
            </p>
            <p className="text-sm">Feels like: {current.feelslike}°C</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>Humidity: {current.humidity}%</div>
          <div>
            Wind: {current.wind_speed} km/h {current.wind_dir}
          </div>
          <div>Pressure: {current.pressure} mb</div>
          <div>UV Index: {current.uv_index}</div>
          <div>Sunrise: {current.astro.sunrise}</div>
          <div>Sunset: {current.astro.sunset}</div>
          <div className="inline-flex items-center whitespace-nowrap col-span-2">
            Air Quality: {epaIndex} ({renderAirQualityLabel(epaIndex)})
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherDisplay;
