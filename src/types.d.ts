interface Entity {
  id?: string; // used for rendering
  category?: string; // can have a category or be uncategorized otherwise
  name: string;
  value: number;
  currency: string;
}

export { Entity };
