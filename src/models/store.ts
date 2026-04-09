export interface ApiResponse<T> {
  metadata: {
    status: string;
    http_code: number;
    date_time: string;
    message: string;
  };
  data: T;
}

export interface ApiListResponse<T> extends ApiResponse<T[]> {
  pagination?: {
    total_count: number;
    page: number;
    page_size: number;
  };
}

export interface Store {
  id: number;
  name: string;
}

export interface StoreInfo {
  id_t1: number;
  id_cs: any;
  id_as400: string;
  store_name: string;
}

export interface StoreIdentityV3 {
  _id: string;
  id_seller: number;
  store_name: string;
  email_owner: string;
  contact: {
    name: string;
    phone: string;
    email: string;
  };
  tax_information: {
    business_name: string;
    rfc: string;
    regime: string;
    address: {
      street: string;
      outer_number: string;
      inside_number: string;
      zip: string;
      suburb: string;
      town: string;
      state: string;
    };
  };
  bank_information: {
    bank: string;
    clabe: string;
    holder_name: string;
  };
  creation_date: string;
  update_date: string;
  services: {
    store: { enabled: boolean };
    shipping: { enabled: boolean };
    payments: { enabled: boolean; status: string; spei: string };
  };
  legacy_finance_id?: string;
}
