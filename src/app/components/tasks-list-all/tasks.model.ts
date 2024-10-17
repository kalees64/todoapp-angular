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
