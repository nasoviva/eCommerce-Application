type Locale = "US" | "RU";
type Material = "wood" | "paper";
type Color = "red" | "green" | "blue";
type AgeRestriction = 6 | 14;

export interface UseProductQuery {
  locale: Locale;
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
}
