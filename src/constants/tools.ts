export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  color: string;
  website?: string;
}

export const toolsData: Tool[] = [];

// Derived from toolsData, so it fills in automatically as tools are added back.
export const toolCategories = Array.from(new Set(toolsData.map((tool) => tool.category)));
