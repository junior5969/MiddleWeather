export interface WeatherApiResponse {
  name: string;
  weather: {
    id: number;
    description: string;
    icon: string;
  }[];
    dt: number;
  main: {
    temp: number;
    temp_min: number;
    temp_max: number;
  };
  wind: {
    speed: number;
  };
}



export interface ForecastResponse {
  city: {
    name: string;
    country: string;
  };
  list: {
    dt: number;
    dt_txt: string;
    main: {
      temp: number;
      temp_min: number;
      temp_max: number;
    };
    weather: {
      id: number;
      description: string;
      icon: string;
    }[];
  }[];
}


export interface ForecastEntry {
  dt: number;
  dt_txt: string;
  main: {
    temp: number;
    temp_min: number;
    temp_max: number;
  };
  weather: {
    id: number;
    description: string;
    icon: string;
  }[];
}