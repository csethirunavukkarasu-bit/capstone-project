import axios from 'axios';
import type { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import type { ApiResponse, AuthResponse, LoginRequest, RegisterRequest, UpdateProfileRequest, CommentRequest, ViewTrackRequest, UserDto, UserProfileDto, VideoDto, CommentDto, EngagementPredictionDto, HealthResponse, Page } from '../types';


const API_BASE = '/api';

export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('access_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  (error: AxiosError<{ message?: string }>) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error);
  }
);


export const authApi = {
  register: (data: RegisterRequest): Promise<ApiResponse<AuthResponse>> =>
    api.post('/auth/register', data),
  login: (data: LoginRequest): Promise<ApiResponse<AuthResponse>> =>
    api.post('/auth/login', data),
  me: (): Promise<ApiResponse<UserDto>> =>
    api.get('/auth/me'),
};

export const usersApi = {
  getProfile: (username: string): Promise<ApiResponse<UserProfileDto>> =>
    api.get(`/users/${encodeURIComponent(username)}`),
  updateProfile: (data: UpdateProfileRequest): Promise<ApiResponse<UserDto>> =>
    api.put('/users/profile', data),
  follow: (userId: string): Promise<ApiResponse<string>> =>
    api.post(`/users/${userId}/follow`),
  unfollow: (userId: string): Promise<ApiResponse<string>> =>
    api.delete(`/users/${userId}/follow`),
  getFollowers: (userId: string, page = 0, size = 20): Promise<ApiResponse<Page<UserDto>>> =>
    api.get(`/users/${userId}/followers`, { params: { page, size } }),
  getFollowing: (userId: string, page = 0, size = 20): Promise<ApiResponse<Page<UserDto>>> =>
    api.get(`/users/${userId}/following`, { params: { page, size } }),
  search: (q: string, page = 0, size = 20): Promise<ApiResponse<Page<UserDto>>> =>
    api.get('/users/search', { params: { q, page, size } }),
};

export const videosApi = {
  upload: (formData: FormData): Promise<ApiResponse<VideoDto>> =>
    api.post('/videos/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getById: (id: string): Promise<ApiResponse<VideoDto>> =>
    api.get(`/videos/${id}`),
  getAiPrediction: (id: string): Promise<ApiResponse<EngagementPredictionDto>> =>
    api.get(`/videos/${id}/ai-prediction`),
};

export const socialApi = {
  like: (videoId: string): Promise<ApiResponse<string>> =>
    api.post(`/videos/${videoId}/like`),
  unlike: (videoId: string): Promise<ApiResponse<string>> =>
    api.delete(`/videos/${videoId}/like`),
  addComment: (videoId: string, data: CommentRequest): Promise<ApiResponse<CommentDto>> =>
    api.post(`/videos/${videoId}/comments`, data),
  getComments: (videoId: string, page = 0, size = 20): Promise<ApiResponse<Page<CommentDto>>> =>
    api.get(`/videos/${videoId}/comments`, { params: { page, size } }),
  getReplies: (commentId: string): Promise<ApiResponse<CommentDto[]>> =>
    api.get(`/comments/${commentId}/replies`),
  trackView: (videoId: string, data: ViewTrackRequest): Promise<ApiResponse<string>> =>
    api.post(`/videos/${videoId}/view`, data),
};

export const feedApi = {
  latest: (page = 0, size = 10): Promise<ApiResponse<Page<VideoDto>>> =>
    api.get('/feed/latest', { params: { page, size } }),
  trending: (page = 0, size = 10): Promise<ApiResponse<Page<VideoDto>>> =>
    api.get('/feed/trending', { params: { page, size } }),
  following: (page = 0, size = 10): Promise<ApiResponse<Page<VideoDto>>> =>
    api.get('/feed/following', { params: { page, size } }),
  category: (category: string, page = 0, size = 10): Promise<ApiResponse<Page<VideoDto>>> =>
    api.get(`/feed/category/${encodeURIComponent(category)}`, { params: { page, size } }),
  recommendations: (page = 0, size = 10): Promise<ApiResponse<Page<VideoDto>>> =>
    api.get('/recommendations/feed', { params: { page, size } }),
  health: (): Promise<ApiResponse<HealthResponse>> =>
    api.get('/health'),
};
