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
  store_portal_id: number;
  portalStore_id: number;
  store_name: string;
  email_owner: string;
  user_id: number;
  step: number;
  legacy_finance_id: number;
  organization_id: string;
  contact: {
    name: string;
    phone: string;
    email: string;
  };
  tax_information: {
    business_name: string;
    rfc: string;
    regime: string;
    regime_type?: string;
    taxpayer_type?: string;
    tax_certificate?: string;
    business_description?: string;
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
    bank_statement?: string;
    rfc?: string;
  };
  creation_date: string;
  update_date: string;
  services: {
    store: {
      enabled: boolean;
      name?: string;
      slug?: string;
      domain?: string;
      logo_url?: string;
      favicon_url?: string;
      has_page?: boolean;
    };
    shipping: {
      enabled: boolean;
      name?: string;
      slug?: string;
    };
    payments: {
      enabled: boolean;
      status: string;
      spei: string;
      validation_status?: boolean;
      payment_id?: string;
    };
  };
  contracts?: {
    SR?: ContractDetail;
    SN?: ContractDetail;
  };
  country: string;
  currency: string;
  language: string;
  timezone: string;
  created_by: string;
  updated_by: string;
  origin: string;
  business_type: string;
  industry_type: string;
}

export interface ContractDetail {
  status: number;
  sign_signer: ContractSigner[];
}

export interface ContractSigner {
  multilateral_id: number;
  signer_name: string;
  type_signer: string;
  create_at: {
    $date: string;
  };
}
