export interface I_TASK {
  id: number;
  name: string;
  status: string;
  created_by: number;
}

export interface I_ADD_TASK {
  name: string;
  status: string;
  created_by: number;
}

export interface I_UPDATE_TASK {
  name: string;
  status: string;
  created_by: number;
}

export interface I_USER {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface I_NEW_USER {
  name: string;
  email: string;
  password: string;
  role: string;
}
