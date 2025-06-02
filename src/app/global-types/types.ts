export type Localization = "en-US" | "RU";
type Material = "wood" | "paper";
type Color = "red" | "green" | "blue";
type AgeRestriction = 6 | 14;
type SortDirection = "asc" | "desc";

export interface UseProductQuery {
  locale: Localization;
  price?: {
    from?: number;
    to?: number;
  };
  attributes?: {
    byName: {
      material?: Material;
    };
    byKey: {
      "card-color"?: Color;
      ageRestriction?: AgeRestriction;
      isAvailable?: boolean;
    };
  };
  sort?: {
    price?: SortDirection;
    name?: SortDirection;
  };
  offset?: number;
  limit?: number;
  categories?: string[];
}

export interface UseSearchQuery {
  locale: Localization;
  text: string;
  offset?: number;
  limit?: number;
}