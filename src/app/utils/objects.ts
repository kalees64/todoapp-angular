export interface I_TASK {
  id: string;
  name: string;
  status: string;
  created_by: string;
}

export interface I_ADD_TASK {
  name: string;
  status: string;
  created_by: string;
}

export interface I_UPDATE_TASK {
  id: string;
  name: string;
  status: string;
  created_by: string;
}

export interface I_USER {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
}
