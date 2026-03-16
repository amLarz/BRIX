
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
  upvotes: number;
  downvotes: number;
  replies: ProjectComment[];
  isInformative?: boolean;
  isVerified?: boolean;
}

export interface Project {
  id: string;
  name: string;
  location: string;
  description: string;
  status: ProjectStatus;
  budget: string; // Formatting like "PhP 96.49 Million"
  deadline: string; // Mandatory deadline/expected completion
  startDate?: string;
  percentage?: number;
  updates?: { date: string; text: string }[];
  verificationDoc?: string; // URL or name of uploaded verification doc
  finishDate?: string;
  imageUrl: string;
  materials: MaterialItem[];
  bidders?: { name: string; amount: string; status: string; }[];
  comments: ProjectComment[];
  upvotes: number;
  downvotes: number;
  managingOrganization?: string;
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
  | { type: 'about' }
  | { type: 'news' }
  | { type: 'forum' }
  | { type: 'create-forum-post' }
  | { type: 'forum-post-detail', postId: string };

export interface ForumPost {
  id: string;
  author: string;
  role: string;
  title: string;
  content: string;
  date: string;
  upvotes: number;
  downvotes: number;
  comments: ProjectComment[]; // Reusing ProjectComment for simplicity
  attachments: { name: string; url: string; type: 'image' | 'file' }[];
}


export interface NewsArticle {
  id: string;
  title: string;
  url: string;
  location: string;
  imageUrl: string;
  date: string;
  network: string;
  summary: string;
}
