export interface User {
  id: string;
  name: string;
  email: string;
  location: string;
  avatarUrl: string;
  skillsOffered: string[];
  skillsWanted: string[];
  availability: string;
  rating: number;
  reviews: number;
}

export interface Swap {
  id: string;
  fromUserId: string;
  toUserId: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  authorId: string;
  targetUserId: string;
  rating: number;
  comment: string;
  createdAt: string;
}
