export type Factory = {
  id: number;
  name: string;
  lower_bound: number;
  upper_bound: number;
  children_count: number;
  created_at: string;
  updated_at: string;
  children?: Array<{
    id: number;
    value: number;
    created_at: string;
    factoryId: number;
  }>;
};
