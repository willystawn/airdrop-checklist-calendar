export type CheckedDates = {
  [date: string]: boolean;
};

export interface Database {
  public: {
    Tables: {
      checked_dates: {
        Row: {
          id: number;
          created_at: string;
          date: string;
          user_id: string;
        };
        Insert: {
          id?: number;
          created_at?: string;
          date: string;
          user_id: string;
        };
        Update: {
          id?: number;
          created_at?: string;
          date?: string;
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}