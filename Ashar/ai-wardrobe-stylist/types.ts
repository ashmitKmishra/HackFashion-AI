export interface ClothingItem {
  id: string;
  image: string; // base64 string
  mimeType: string;
  category: string;
  description: string;
}

export interface OutfitSuggestion {
  name: string;
  itemDescriptions: string[];
  justification: string;
}

export interface DisplayOutfit {
  name: string;
  items: ClothingItem[];
  justification: string;
}

export interface OutfitCriteria {
  event: string;
  weather: string;
  mood: string;
}
