import type { ProductProjectionPagedSearchResponse } from "@commercetools/platform-sdk";
import type { ClientResponse } from "@commercetools/ts-client";
import type { Locale } from "../../global-types/types";

interface CatalogData {
  id: string;
  image: string;
  name: string;
  description: string;
  price: number;
  discount?: number;
}

export default class DataParser {
  constructor() {}

  public static parseForCatalog(
    response: ClientResponse<ProductProjectionPagedSearchResponse>,
    country: Locale,
  ): CatalogData[] {
    const countryParse = country.slice(-2);
    const result: CatalogData[] = [];
    if (!response.body) return result;
    for (const item of response.body.results) {
      const productData: CatalogData = {
        id: item.id,
        image: item.masterVariant.images?.find((x) => x)?.url || "",
        name: Object.values(item.name)[0],
        description: Object.values(item.description || {}).find((x) => x) || "",
        price:
          item.masterVariant.prices?.find((i) => i.country === countryParse)
            ?.value.centAmount || 0,
      };
      const discount = item.masterVariant.prices?.find(
        (i) => i.country === country,
      )?.discounted?.value.centAmount;
      if (discount) productData.discount = discount;
      result.push(productData);
    }
    return result;
  }
}
