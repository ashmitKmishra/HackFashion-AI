import type { ClothingItem, OutfitCriteria, OutfitSuggestion } from "../types";

interface CategorizedItem { category: string; description: string }

const API_BASE = (import.meta as any).env?.VITE_API_BASE || ''

export const categorizeClothingItems = async (images: { data: string; mimeType: string }[]): Promise<CategorizedItem[]> => {
  try {
    const res = await fetch(`${API_BASE}/api/categorize`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ images })
    })
    if (!res.ok) throw new Error(`Server error: ${res.status}`)
    const json = await res.json()
    return json.items as CategorizedItem[]
  } catch (err) {
    console.error('Error categorizing clothing (client):', err)
    throw err
  }
}

export const generateOutfits = async (wardrobe: ClothingItem[], criteria: OutfitCriteria): Promise<OutfitSuggestion> => {
  try {
    const res = await fetch(`${API_BASE}/api/stylist-session`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt: criteria.mood || '', wardrobeSummaries: wardrobe })
    })
    if (!res.ok) throw new Error(`Server error: ${res.status}`)
    const json = await res.json()
    return json.reply as OutfitSuggestion
  } catch (err) {
    console.error('Error generating outfits (client):', err)
    throw err
  }
}
