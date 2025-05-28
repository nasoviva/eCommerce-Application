import type {
  CategoryPagedQueryResponse,
  ProductProjection,
  Customer,
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

interface DetailData {
  id: string;
  image: string[];
  name: string;
  description: string;
  price: number;
  discount?: number;
  attributes: { name: string; value: string }[];
}

interface CategoryData {
  id: string;
  description: string;
  name: string;
  ancestors?: string[];
}

export interface AddressData {
  street: string;
  city: string;
  state: string;
  zipcode: string;
  country: string;
  defaultBilling: boolean;
  defaultShipping: boolean;
}

interface UserData {
  version: number;
  email: string;
  name: string;
  lastName: string;
  dateOfBirth: string;
  addresses: AddressData[];
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

  public static parseProductDetail(
    response: ClientResponse<ProductProjection>,
    country: Localization,
  ): DetailData | {} {
    if (!response.body) return {};
    const item = response.body;
    const countryParse = country.slice(-2);
    const productData: DetailData = {
      id: item.id,
      image: item.masterVariant.images?.map((x) => x.url) || [],
      name: Object.values(item.name)[0],
      description: Object.values(item.description || {}).find((x) => x) || "",
      price:
        item.masterVariant.prices?.find((i) => i.country === countryParse)
          ?.value.centAmount || 0,
      attributes: item.masterVariant.attributes || [],
    };
    const discount = item.masterVariant.prices?.find(
      (i) => i.country === countryParse,
    )?.discounted?.value.centAmount;
    if (discount) productData.discount = discount;
    return productData;
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

  public static parseUserData(response: ClientResponse<Customer>): UserData {
    const version = response.body?.version || 0;
    const email = response.body?.email || "";
    const name = response.body?.firstName || "";
    const lastName = response.body?.lastName || "";
    const dateOfBirth = response.body?.dateOfBirth || "";
    let addresses: AddressData[] = [];
    if (response.body?.addresses) {
      addresses = response.body?.addresses.map((x) => {
        const isDefaultBilling =
          x.id === response.body?.defaultBillingAddressId;
        const isDefaultShipping =
          x.id === response.body?.defaultShippingAddressId;
        const address = {
          street: x.streetName || "",
          city: x.city || "",
          state: x.state || "",
          zipcode: x.postalCode || "",
          country: x.city || "",
          defaultBilling: isDefaultBilling,
          defaultShipping: isDefaultShipping,
        };
        return address;
      });
    }
    const result: UserData = {
      version: version,
      email: email,
      name: name,
      lastName: lastName,
      dateOfBirth: dateOfBirth,
      addresses: addresses,
    };
    return result;
  }
}
