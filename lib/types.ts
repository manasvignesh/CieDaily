// CIE Connect - Core Type Definitions

export type UserRole = "student" | "space_admin" | "system_admin";

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  collegeDomain: string;
  avatar?: string;
  coverImage?: string;
  bio: string;
  department: string;
  year: number;
  phone?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  resumeUrl?: string;
  skills: string[];
  techStack: string[];
  interests: string[];
  learningStreak: number;
  achievements: Achievement[];
  certificates: Certificate[];
  hackathonsParticipated: string[];
  role: UserRole;
  isEmailVerified: boolean;
  isAccountSuspended: boolean;
  isOnline: boolean;
  lastSeen: string;
  createdAt: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  imageUrl?: string;
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date: string;
  imageUrl?: string;
}

export interface Post {
  id: string;
  authorId: string;
  author: User;
  caption: string;
  media: MediaItem[];
  category: TechCategory;
  spaceId?: string;
  spaceName?: string;
  likes: string[];
  comments: Comment[];
  shares: number;
  saves: string[];
  isLiked: boolean;
  isSaved: boolean;
  reportCount: number;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Reel {
  id: string;
  creatorId: string;
  creator: User;
  videoUrl: string;
  thumbnailUrl: string;
  caption: string;
  category: TechCategory;
  duration: number;
  likes: string[];
  comments: Comment[];
  shares: number;
  saves: string[];
  isLiked: boolean;
  isSaved: boolean;
  createdAt: string;
}

export interface MediaItem {
  id: string;
  type: "image" | "video" | "pdf" | "link";
  url: string;
  thumbnailUrl?: string;
  fileSize: number;
}

export interface Comment {
  id: string;
  authorId: string;
  author: User;
  content: string;
  postId: string;
  parentId?: string;
  replies: Comment[];
  likes: string[];
  isLiked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Space {
  id: string;
  name: string;
  logo: string;
  description: string;
  category: TechCategory;
  memberCount: number;
  facultyCoordinator: string;
  studentHeads: string[];
  isMember: boolean;
  isPending: boolean;
  contactInfo?: string;
  socialLinks?: string[];
  learningResources: string[];
  announcements: Announcement[];
  events: Event[];
  createdAt: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  posterUrl?: string;
  date: string;
  time: string;
  venue: string;
  organizer: string;
  organizerId: string;
  spaceId?: string;
  type: EventType;
  technologies: string[];
  availableSeats: number;
  registeredCount: number;
  isRegistered: boolean;
  isBookmarked: boolean;
  reminderSet: boolean;
  registrationOpen: boolean;
  createdAt: string;
}

export type EventType = "hackathon" | "workshop" | "tech_talk" | "coding_competition" | "research_seminar" | "career_fair" | "internship_drive" | "startup_meetup";

export interface ChatConversation {
  id: string;
  participants: User[];
  lastMessage?: ChatMessage;
  unreadCount: number;
  isGroup: boolean;
  groupName?: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  sender: User;
  content: string;
  attachments: MediaItem[];
  reactions: Reaction[];
  isRead: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Reaction {
  userId: string;
  emoji: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  isRead: boolean;
  priority: "normal" | "important" | "urgent";
  createdAt: string;
}

export type NotificationType =
  | "new_post"
  | "hackathon_reminder"
  | "workshop_reminder"
  | "comment_reply"
  | "mention"
  | "project_request"
  | "new_resource"
  | "event_starting"
  | "post_like"
  | "friend_request"
  | "new_message"
  | "system_announcement";

export interface FriendRequest {
  id: string;
  fromUser: User;
  toUser: User;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  requiredSkills: string[];
  members: ProjectMember[];
  status: "open" | "in_progress" | "completed";
  githubUrl?: string;
  deadline?: string;
  updates: ProjectUpdate[];
  discussions: Comment[];
  creatorId: string;
  createdAt: string;
}

export interface ProjectMember {
  userId: string;
  user: User;
  role: "creator" | "member";
  joinedAt: string;
}

export interface ProjectUpdate {
  id: string;
  projectId: string;
  authorId: string;
  author: User;
  content: string;
  createdAt: string;
}

export type TechCategory =
  | "AI/ML"
  | "Robotics"
  | "IoT"
  | "Embedded Systems"
  | "Cyber Security"
  | "Web Dev"
  | "App Dev"
  | "Flutter"
  | "React"
  | "Cloud"
  | "DevOps"
  | "Open Source"
  | "Research"
  | "Engineering"
  | "Electronics"
  | "Space Tech"
  | "Semiconductor"
  | "EV Technology"
  | "Quantum Computing"
  | "Hackathons"
  | "Internships"
  | "Placement Tips";

export interface Report {
  id: string;
  reporterId: string;
  reporter: User;
  type: "post" | "reel" | "comment" | "user" | "space" | "event";
  targetId: string;
  reason: "spam" | "harassment" | "fake" | "nsfw" | "violence" | "other";
  description?: string;
  status: "pending" | "reviewed" | "dismissed" | "action_taken";
  adminNotes?: string;
  createdAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: "college" | "department" | "space" | "admin";
  priority: "normal" | "important" | "urgent" | "pinned";
  authorId: string;
  author: User;
  createdAt: string;
  expiresAt?: string;
}

export const TECH_CATEGORIES: TechCategory[] = [
  "AI/ML", "Robotics", "IoT", "Embedded Systems", "Cyber Security",
  "Web Dev", "App Dev", "Flutter", "React", "Cloud",
  "DevOps", "Open Source", "Research", "Engineering", "Electronics",
  "Space Tech", "Semiconductor", "EV Technology", "Quantum Computing",
  "Hackathons", "Internships", "Placement Tips",
];

export const EVENT_TYPES: EventType[] = [
  "hackathon", "workshop", "tech_talk", "coding_competition",
  "research_seminar", "career_fair", "internship_drive", "startup_meetup",
];

export const REPORT_REASONS: string[] = [
  "Spam", "Harassment", "Fake", "NSFW", "Violence", "Other",
];
