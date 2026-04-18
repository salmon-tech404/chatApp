export interface User {
  _id: string;
  username: string;
  displayName: string;
  email: string;
  avatarUrl?: string;
  coverPhotoUrl?: string;
  coverOffsetY?: number;
  bio?: string;
  gender?: "male" | "female" | "other" | null;
  birthday?: string | null;
  phone?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FriendRequest {
  _id: string;
  requesterId: User | string;
  recipientId: User | string;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
  updatedAt: string;
}

export interface Friend extends User {
  friendshipId?: string;
}
