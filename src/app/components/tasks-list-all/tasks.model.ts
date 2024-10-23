export interface I_TASK {
  id: number;
  name: string;
  status: string;
  created_by: any;
  description: string;
  assigned_date: string;
  assigned_to: number;
  completed_date: string;
  created_at: string;
  due_date: string;
  modified_at: string;
  priority: string;
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
}

export interface I_CREATED_BY {
  id: number;
  name: string;
}
