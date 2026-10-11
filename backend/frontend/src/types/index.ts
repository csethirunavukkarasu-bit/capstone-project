export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  user: UserDto;
}

export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  displayName: string;
  bio?: string;
  profilePictureUrl?: string;
}

export interface UpdateProfileRequest {
  displayName?: string;
  bio?: string;
  profilePictureUrl?: string;
}

export interface VideoUploadRequest {
  title: string;
  description?: string;
  category?: string;
  tags?: string;
}

export interface CommentRequest {
  content: string;
  parentCommentId?: string;
}

export interface ViewTrackRequest {
  watchTime: number;
  completed: boolean;
}

export interface UserDto {
  id: string;
  username: string;
  email: string;
  displayName: string;
  bio: string;
  profilePictureUrl: string;
  followerCount: number;
  followingCount: number;
  createdAt: string;
}

export interface UserProfileDto extends UserDto {
  isFollowing: boolean;
  isSelf: boolean;
}

export interface VideoDto {
  id: string;
  user: UserDto;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration: number;
  fileSize: number;
  mimeType: string;
  category: string;
  tags: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
  status: string;
  createdAt: string;
}

export interface CommentDto {
  id: string;
  user: UserDto;
  videoId: string;
  parentCommentId?: string;
  content: string;
  likeCount: number;
  createdAt: string;
}

export interface EngagementPredictionDto {
  id: string;
  videoId: string;
  predictedViews: number;
  predictedLikeRatio: number;
  predictedCompletionRate: number;
  viralScore: number;
  modelVersion: string;
  predictedAt: string;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface HealthResponse {
  status: string;
  timestamp: string;
  activeProfile: string;
  database: {
    connected: boolean;
    databaseProduct: string;
    details: Record<string, unknown>;
    pingLatencyMs?: number;
  };
  systemInfo: Record<string, unknown>;
}

