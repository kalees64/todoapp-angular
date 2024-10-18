export interface I_TASK {
  id: number;
  name: string;
  status: string;
  created_by: any;
  description: string;
}

export interface I_ADD_TASK {
  name: string;
  status: string;
  created_by: number;
  description: string;
}

export interface I_UPDATE_TASK {
  name: string;
  status: string;
  created_by: number;
  description: string;
}

export interface I_CREATED_BY {
  id: number;
  name: string;
}
