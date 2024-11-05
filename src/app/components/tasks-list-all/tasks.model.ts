export interface I_TASK {
  id: number;
  name: string;
  status: string;
  created_by: I_CREATED_BY;
  description: string;
  assigned_date: string;
  assigned_to: I_ASSIGNED_TO;
  completed_date: string;
  created_at: string;
  due_date: string;
  modified_at: string;
  priority: string;
  image?: any;
}

export interface I_ADD_TASK {
  name: string;
  status: string;
  created_by: number;
  description: string;
  assigned_date: string;
  assigned_to: number;
  completed_date: string;
  created_at: string;
  due_date: string;
  modified_at: string;
  priority: string;
  image?: any;
}

export interface I_UPDATE_TASK {
  id: number;
  name: string;
  status: string;
  created_by: number;
  description: string;
  assigned_date?: string;
  assigned_to?: number;
  completed_date?: string;
  created_at?: string;
  due_date?: string;
  modified_at?: string;
  priority?: string;
  image?: any;
}

export interface I_CREATED_BY {
  id: number;
  name: string;
}

export interface I_ASSIGNED_TO {
  id: number;
  name: string;
}
