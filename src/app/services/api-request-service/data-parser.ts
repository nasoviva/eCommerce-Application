import type {
  CategoryPagedQueryResponse,
  ProductProjectionPagedSearchResponse,
} from "@commercetools/platform-sdk";
import type { ClientResponse } from "@commercetools/ts-client";
import type { Localization } from "../../global-types/types";

interface CatalogData {
  id: string;
  image: string;
  name: string;
  description: string;
  price: number;
  discount?: number;
}

interface CategoryData {
  id: string;
  description: string;
  name: string;
  ancestors?: string[];
}

export default class DataParser {
  constructor() {}

  public static parseForCatalog(
    response: ClientResponse<ProductProjectionPagedSearchResponse>,
    country: Localization,
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
        (i) => i.country === countryParse,
      )?.discounted?.value.centAmount;
      if (discount) productData.discount = discount;
      result.push(productData);
    }
    return result;
  }

  public static parseCategories(
    response: ClientResponse<CategoryPagedQueryResponse>,
    country: Localization,
  ): CategoryData[] {
    const result: CategoryData[] = [];
    if (!response.body) return result;
    for (const item of response.body.results) {
      const categoryData: CategoryData = {
        id: item.id,
        name: item.name[country],
        description: item.description ? item.description[country] : "",
      };
      if (item.ancestors) {
        const path: string[] = [];
        for (const ancestor of item.ancestors) {
          const pathPart = response.body.results.find(
            (x) => x.id === ancestor.id,
          )?.name[country];
          if (pathPart) path.push(pathPart);
        }
        categoryData.ancestors = path;
      }
      result.push(categoryData);
    }
    return result;
  }
}
