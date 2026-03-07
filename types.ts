
export type ProjectStatus = 'Developing Project' | 'Finished Project';

export interface MaterialItem {
  material: string;
  unit: string;
  price: string;
}

export interface ProjectComment {
  id: string;
  author: string;
  role: string;
  text: string;
  avatar: string;
  image?: string;
  date: string;
}

export interface Project {
  id: string;
  name: string;
  location: string;
  description: string;
  status: ProjectStatus;
  budget: string; // Formatting like "PhP 96.49 Million"
  deadline: string; // Mandatory deadline/expected completion
  verificationDoc?: string; // URL or name of uploaded verification doc
  finishDate?: string;
  imageUrl: string;
  materials: MaterialItem[];
  comments: ProjectComment[];
  upvotes: number;
  downvotes: number;
  createdAt: string; // ISO date string for sorting
}

export interface MaterialPriceReference {
  name: string;
  unit: string;
  price: string;
  sourceUrl?: string; // Information origin URL
  sourceName?: string; // Website name citation
}

export interface MaterialCategory {
  id: string;
  name: string;
  icon: string;
  items: MaterialPriceReference[];
}

export type ViewState = 
  | { type: 'home' }
  | { type: 'project-detail'; projectId: string }
  | { type: 'material-prices'; categoryId: string }
  | { type: 'add-project' }
  | { type: 'about' };
