export interface AuthContext {
  user: {
    token: string;
    refreshtoken: string;
    email: string;
    entity_name: string;
    role: string;
    currency: string;
    access: string[];
    userName?: string;
    entity_Id: string;
    financial_year: string;
    selectedMenuItem?: string | null;
    permissions?: any;
  };
  login: (data: any) => void;
  logout: () => void;
  selectuserRole: (values: any, role: any) => void;
  isLoading: boolean;
}
