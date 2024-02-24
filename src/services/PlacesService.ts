import axios from "axios";

import { Location, SortOrder } from "src/types";

type GeoDBCitiesResponse<T> = {
  data: T[];
  links: {
    rel: "first" | "next" | "last";
    href: string;
  }[];
  metadata: {
    currentOffset: number;
    totalCount: number;
  };
};

type GeoDBCity = {
  id: number;
  wikiDataId: string;
  type: "CITY";
  city: string;
  name: string;
  country: string;
  countryCode: string;
  region: string;
  regionCode: string;
  latitude: number;
  longitude: number;
  population: number;
  distance: number;
};

type City = {
  id: number;
  city: string;
  name: string;
  country: string;
  countryCode: string;
  region: string;
  regionCode: string;
  lat: number;
  long: number;
  population: number;
  distance: number;
};

type Sort = {
  by: "countryCode" | "elevation" | "name" | "population";
  order: SortOrder;
};

type Pagination = {
  limit?: number;
  offset?: number;
};

type Filters = {
  location?: Location;
  radius?: number;
  distanceUnit?: DistanceUnit;
  countryIds?: string[];
  excludedCountryIds?: string[];
  minPopulation?: number;
  maxPopulation?: number;
};

enum DistanceUnit {
  "KM" = "KM",
  "MI" = "MI",
}

// Iran, North Korea, Syria, Cuba
const excludedCountryIds = ["IR", "KP", "SY", "CU"];

const defaultFilters: Filters = {
  distanceUnit: DistanceUnit.KM,
  excludedCountryIds,
};

export class PlacesService {
  private static BASE_URL = "https://wft-geo-db.p.rapidapi.com";

  private static getISO6709FormatLocation({ lat, long }: Location) {
    return `${lat > 0 ? "" : "-"}${lat}${long > 0 ? "+" : "-"}${long}`;
  }

  private static getUniqueGeoDBCities(cities: GeoDBCity[]) {
    return cities.reduce<GeoDBCity[]>((accumulator, city) => {
      const cityIsDuplicate = accumulator.some(
        (checkedCity) => checkedCity.name === city.name
      );

      if (!cityIsDuplicate) accumulator.push(city);
      return accumulator;
    }, []);
  }

  private static geoDBCityToCity(geoDBCity: GeoDBCity): City {
    return {
      id: geoDBCity.id,
      city: geoDBCity.city,
      country: geoDBCity.country,
      countryCode: geoDBCity.countryCode,
      distance: geoDBCity.distance,
      lat: geoDBCity.latitude,
      long: geoDBCity.longitude,
      name: geoDBCity.name,
      population: geoDBCity.population,
      region: geoDBCity.region,
      regionCode: geoDBCity.regionCode,
    };
  }

  static async findPlaces({
    filters: _filters,
    sort,
    pagination = { limit: 10 },
  }: {
    filters?: Filters;
    sort?: Sort;
    pagination?: Pagination;
  }) {
    const filters: Filters = { ...defaultFilters, ..._filters };

    const options = {
      method: "GET",
      url: `${this.BASE_URL}/v1/geo/places`,
      params: {
        type: "CITY",
        ...filters,
        countryIds: filters.countryIds
          ? filters.countryIds.join(",")
          : undefined,
        excludedCountryIds: filters.excludedCountryIds
          ? filters.excludedCountryIds.join(",")
          : undefined,
        location: filters.location
          ? this.getISO6709FormatLocation(filters.location)
          : undefined,
        pagination,
        sort: sort ? `${sort.order === "asc" ? "" : "-"}${sort.by}` : undefined,
      },
      headers: {
        "X-RapidAPI-Key": Bun.env.RAPIDAPI_KEY,
        "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com",
      },
    };

    const { data } = await axios.request<GeoDBCitiesResponse<GeoDBCity>>(
      options
    );

    return {
      ...data,
      data: this.getUniqueGeoDBCities(data.data).map(this.geoDBCityToCity),
    };
  }
}
