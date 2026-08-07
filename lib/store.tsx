import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useCallback, useState, useEffect, type ReactNode } from "react";
import React from "react";
import type { User, Post, Reel, Space, Event, ChatConversation, Notification, FriendRequest, Project, Announcement } from "./types";

// ==================== Mock Data ====================

const MOCK_USERS: User[] = [
  {
    id: "1", name: "Rahul Sharma", username: "rahul_sharma", email: "rahul@college.edu",
    collegeDomain: "college.edu", bio: "Full-stack developer | AI enthusiast | Open source contributor",
    department: "Computer Science", year: 3, skills: ["React", "Node.js", "Python"],
    techStack: ["MERN", "TypeScript", "Docker"], interests: ["AI/ML", "Web Dev", "Open Source"],
    learningStreak: 45, achievements: [{ id: "a1", title: "Hackathon Winner", description: "Won first place at SmartIndia Hackathon 2024", date: "2024-03-15" }],
    certificates: [{ id: "c1", title: "AWS Cloud Practitioner", issuer: "Amazon", date: "2024-06-01" }],
    hackathonsParticipated: ["SmartIndia Hackathon 2024", "Google Code Jam 2024"],
    role: "student", isEmailVerified: true, isAccountSuspended: false, isOnline: true, lastSeen: "2026-08-06T07:00:00Z", createdAt: "2024-01-15T00:00:00Z",
    githubUrl: "https://github.com/rahul", linkedinUrl: "https://linkedin.com/in/rahul",
  },
  {
    id: "2", name: "Priya Patel", username: "priya_patel", email: "priya@college.edu",
    collegeDomain: "college.edu", bio: "ML Engineer | Research enthusiast | Python lover",
    department: "Computer Science", year: 4, skills: ["Python", "TensorFlow", "PyTorch"],
    techStack: ["ML", "Data Science", "Deep Learning"], interests: ["AI/ML", "Research", "Data Science"],
    learningStreak: 62, achievements: [{ id: "a2", title: "Research Paper Published", description: "Published paper on NLP in IEEE conference", date: "2024-05-20" }],
    certificates: [{ id: "c2", title: "Google ML Certificate", issuer: "Google", date: "2024-04-10" }],
    hackathonsParticipated: ["ML Hackathon 2024"], role: "student", isEmailVerified: true,
    isAccountSuspended: false, isOnline: true, lastSeen: "2026-08-06T06:30:00Z", createdAt: "2023-08-01T00:00:00Z",
    githubUrl: "https://github.com/priya", linkedinUrl: "https://linkedin.com/in/priya",
  },
  {
    id: "3", name: "Arjun Kumar", username: "arjun_k", email: "arjun@college.edu",
    collegeDomain: "college.edu", bio: "Embedded systems | IoT projects | Electronics",
    department: "Electronics", year: 3, skills: ["Arduino", "Raspberry Pi", "C/C++"],
    techStack: ["IoT", "Embedded", "PCB Design"], interests: ["IoT", "Robotics", "Electronics"],
    learningStreak: 30, achievements: [], certificates: [], hackathonsParticipated: [],
    role: "student", isEmailVerified: true, isAccountSuspended: false, isOnline: false,
    lastSeen: "2026-08-05T18:00:00Z", createdAt: "2024-02-10T00:00:00Z",
  },
  {
    id: "4", name: "Sneha Reddy", username: "sneha_r", email: "sneha@college.edu",
    collegeDomain: "college.edu", bio: "Flutter developer | Mobile app enthusiast | UI/UX lover",
    department: "Information Technology", year: 2, skills: ["Flutter", "Dart", "Firebase"],
    techStack: ["Flutter", "Mobile Dev", "Firebase"], interests: ["Flutter", "App Dev", "UI/UX"],
    learningStreak: 28, achievements: [], certificates: [], hackathonsParticipated: ["Flutter Hackathon 2024"],
    role: "space_admin", isEmailVerified: true, isAccountSuspended: false, isOnline: true,
    lastSeen: "2026-08-06T07:10:00Z", createdAt: "2024-06-01T00:00:00Z",
  },
  {
    id: "5", name: "Vikram Singh", username: "vikram_s", email: "vikram@college.edu",
    collegeDomain: "college.edu", bio: "Cybersecurity researcher | CTF player | Linux enthusiast",
    department: "Computer Science", year: 4, skills: ["Kali Linux", "Python", "Network Security"],
    techStack: ["Security", "Linux", "Networking"], interests: ["Cyber Security", "Linux", "Open Source"],
    learningStreak: 55, achievements: [], certificates: [], hackathonsParticipated: [],
    role: "student", isEmailVerified: true, isAccountSuspended: false, isOnline: false,
    lastSeen: "2026-08-05T22:00:00Z", createdAt: "2023-07-15T00:00:00Z",
  },
];

const MOCK_POSTS: Post[] = [
  {
    id: "p1", authorId: "1", author: MOCK_USERS[0], category: "Web Dev",
    caption: "Just completed a full-stack project using Next.js 14 with Server Actions! 🚀 Built a real-time chat application with WebSocket integration. Check out the repo for the code walkthrough.",
    media: [{ id: "m1", type: "image", url: "https://picsum.photos/seed/project1/800/600", fileSize: 500000 }],
    spaceId: "s1", spaceName: "Web Dev", likes: ["2", "3", "4"], comments: [], shares: 12, saves: ["2"],
    isLiked: false, isSaved: false, reportCount: 0, isDeleted: false,
    createdAt: "2026-08-05T10:00:00Z", updatedAt: "2026-08-05T10:00:00Z",
  },
  {
    id: "p2", authorId: "2", author: MOCK_USERS[1], category: "AI/ML",
    caption: "Interesting paper on Transformer architecture improvements! The new attention mechanism reduces computational complexity by 40% while maintaining accuracy. Great for edge deployment.",
    media: [{ id: "m2", type: "image", url: "https://picsum.photos/seed/research1/800/600", fileSize: 400000 }],
    likes: ["1", "4", "5"], comments: [], shares: 8, saves: ["1", "4"],
    isLiked: false, isSaved: false, reportCount: 0, isDeleted: false,
    createdAt: "2026-08-05T08:30:00Z", updatedAt: "2026-08-05T08:30:00Z",
  },
  {
    id: "p3", authorId: "3", author: MOCK_USERS[2], category: "IoT",
    caption: "Smart home automation project using ESP32 and MQTT protocol! Controls lights, fans, and AC remotely via custom mobile app. Code available on GitHub.",
    media: [{ id: "m3", type: "image", url: "https://picsum.photos/seed/iot1/800/600", fileSize: 600000 }, { id: "m4", type: "image", url: "https://picsum.photos/seed/iot2/800/600", fileSize: 450000 }],
    spaceId: "s2", spaceName: "IoT", likes: ["1", "2"], comments: [], shares: 5, saves: [],
    isLiked: false, isSaved: false, reportCount: 0, isDeleted: false,
    createdAt: "2026-08-04T15:00:00Z", updatedAt: "2026-08-04T15:00:00Z",
  },
  {
    id: "p4", authorId: "4", author: MOCK_USERS[3], category: "Flutter",
    caption: "New Flutter tutorial: Building a beautiful animated onboarding screen with Lottie animations. Full source code in the repository! Perfect for beginners.",
    media: [{ id: "m5", type: "image", url: "https://picsum.photos/seed/flutter1/800/600", fileSize: 350000 }],
    spaceId: "s3", spaceName: "Flutter", likes: ["1", "2", "3", "5"], comments: [], shares: 15, saves: ["1", "2", "3"],
    isLiked: false, isSaved: false, reportCount: 0, isDeleted: false,
    createdAt: "2026-08-04T12:00:00Z", updatedAt: "2026-08-04T12:00:00Z",
  },
  {
    id: "p5", authorId: "5", author: MOCK_USERS[4], category: "Cyber Security",
    caption: "CTF writeup: Pwn challenge from SecCon 2024. Learned about ROP chains and ASLR bypass techniques. Great practice for understanding memory exploitation.",
    media: [],
    spaceId: "s4", spaceName: "Cyber Security", likes: ["1", "2"], comments: [], shares: 3, saves: ["1"],
    isLiked: false, isSaved: false, reportCount: 0, isDeleted: false,
    createdAt: "2026-08-03T20:00:00Z", updatedAt: "2026-08-03T20:00:00Z",
  },
  {
    id: "p6", authorId: "1", author: MOCK_USERS[0], category: "Hackathons",
    caption: "Registration open for DevHack 2026! 🏆 48-hour hackathon with ₹50K prize pool. Themes: AI, Healthcare, EdTech. Team size: 2-4 members. Register now!",
    media: [{ id: "m6", type: "image", url: "https://picsum.photos/seed/hackathon1/800/600", fileSize: 700000 }],
    likes: ["2", "3", "4", "5"], comments: [], shares: 25, saves: ["2", "3", "4", "5"],
    isLiked: false, isSaved: false, reportCount: 0, isDeleted: false,
    createdAt: "2026-08-03T09:00:00Z", updatedAt: "2026-08-03T09:00:00Z",
  },
];

const MOCK_REELS: Reel[] = [
  {
    id: "r1", creatorId: "1", creator: MOCK_USERS[0], category: "Web Dev",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    thumbnailUrl: "https://picsum.photos/seed/reel1/400/700",
    caption: "React useEffect cleanup function explained in 60 seconds! Never forget to clean up your subscriptions.",
    duration: 45, likes: ["2", "3"], comments: [], shares: 8, saves: ["2"],
    isLiked: false, isSaved: false, createdAt: "2026-08-05T14:00:00Z",
  },
  {
    id: "r2", creatorId: "2", creator: MOCK_USERS[1], category: "AI/ML",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    thumbnailUrl: "https://picsum.photos/seed/reel2/400/700",
    caption: "Python list comprehension vs for loop - performance comparison that will blow your mind!",
    duration: 55, likes: ["1", "3", "4"], comments: [], shares: 12, saves: ["1", "3"],
    isLiked: false, isSaved: false, createdAt: "2026-08-04T11:00:00Z",
  },
  {
    id: "r3", creatorId: "4", creator: MOCK_USERS[3], category: "Flutter",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    thumbnailUrl: "https://picsum.photos/seed/reel3/400/700",
    caption: "Build a glassmorphism UI in Flutter with just 10 lines of code! Here's how.",
    duration: 30, likes: ["1", "2", "3", "5"], comments: [], shares: 20, saves: ["1", "2", "3"],
    isLiked: false, isSaved: false, createdAt: "2026-08-03T16:00:00Z",
  },
  {
    id: "r4", creatorId: "3", creator: MOCK_USERS[2], category: "IoT",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    thumbnailUrl: "https://picsum.photos/seed/reel4/400/700",
    caption: "Arduino project: Build a line-following robot in 10 minutes! Components needed: Arduino, IR sensors, motors.",
    duration: 60, likes: ["1", "4"], comments: [], shares: 6, saves: ["1"],
    isLiked: false, isSaved: false, createdAt: "2026-08-02T13:00:00Z",
  },
];

const MOCK_SPACES: Space[] = [
  {
    id: "s1", name: "Web Dev", logo: "🌐", description: "Community for web development enthusiasts. Share projects, learn frameworks, and collaborate on web applications.",
    category: "Web Dev", memberCount: 342, facultyCoordinator: "Dr. Rajesh Kumar",
    studentHeads: ["Rahul Sharma", "Amit Verma"], isMember: true, isPending: false,
    contactInfo: "webdev@college.edu", socialLinks: ["https://github.com/webdev-space"],
    learningResources: ["MDN Web Docs", "JavaScript.info", "The Odin Project"],
    announcements: [{ id: "an1", title: "React 19 Workshop", content: "Join us for a hands-on React 19 workshop this Saturday!", type: "space", priority: "important", authorId: "4", author: MOCK_USERS[3], createdAt: "2026-08-05T08:00:00Z" }],
    events: [], createdAt: "2023-09-01T00:00:00Z",
  },
  {
    id: "s2", name: "IoT", logo: "📡", description: "Internet of Things community. Explore hardware projects, sensor networks, and smart systems.",
    category: "IoT", memberCount: 189, facultyCoordinator: "Prof. Suresh Nair",
    studentHeads: ["Arjun Kumar"], isMember: false, isPending: false,
    contactInfo: "iot@college.edu", learningResources: ["Arduino Documentation", "ESP32 Guide"],
    announcements: [], events: [], createdAt: "2023-09-01T00:00:00Z",
  },
  {
    id: "s3", name: "Flutter", logo: "🦋", description: "Flutter and Dart developers community. Build beautiful cross-platform apps together.",
    category: "Flutter", memberCount: 267, facultyCoordinator: "Dr. Meena Iyer",
    studentHeads: ["Sneha Reddy", "Kiran Patel"], isMember: false, isPending: false,
    contactInfo: "flutter@college.edu", learningResources: ["Flutter Docs", "Dart Language Tour"],
    announcements: [], events: [], createdAt: "2023-09-01T00:00:00Z",
  },
  {
    id: "s4", name: "Cyber Security", logo: "🔐", description: "Ethical hacking and cybersecurity community. CTF challenges, security research, and penetration testing.",
    category: "Cyber Security", memberCount: 156, facultyCoordinator: "Dr. Anand Mishra",
    studentHeads: ["Vikram Singh"], isMember: false, isPending: false,
    contactInfo: "cybersec@college.edu", learningResources: ["OWASP Guide", "HackTheBox"],
    announcements: [], events: [], createdAt: "2023-09-01T00:00:00Z",
  },
  {
    id: "s5", name: "AI/ML", logo: "🤖", description: "Artificial Intelligence and Machine Learning community. Research discussions, paper reviews, and project collaborations.",
    category: "AI/ML", memberCount: 412, facultyCoordinator: "Dr. Kavitha Rao",
    studentHeads: ["Priya Patel", "Deepak Joshi"], isMember: false, isPending: false,
    contactInfo: "aiml@college.edu", learningResources: ["Andrew Ng ML Course", "Fast.ai"],
    announcements: [], events: [], createdAt: "2023-09-01T00:00:00Z",
  },
  {
    id: "s6", name: "Robotics", logo: "🤖", description: "Robotics and automation community. Build robots, participate in competitions, and share projects.",
    category: "Robotics", memberCount: 134, facultyCoordinator: "Prof. Ramesh Gupta",
    studentHeads: ["Karthik Raj"], isMember: false, isPending: false,
    contactInfo: "robotics@college.edu", learningResources: ["ROS Documentation", "Arduino Robotics"],
    announcements: [], events: [], createdAt: "2023-09-01T00:00:00Z",
  },
];

const MOCK_EVENTS: Event[] = [
  {
    id: "e1", title: "DevHack 2026 - 48hr Hackathon", description: "Build innovative solutions in 48 hours. Themes: AI, Healthcare, EdTech. ₹50K prize pool!",
    posterUrl: "https://picsum.photos/seed/event1/600/400", date: "2026-08-15", time: "09:00",
    venue: "Main Auditorium", organizer: "Tech Club", organizerId: "1",
    type: "hackathon", technologies: ["Web Dev", "AI/ML", "Mobile Dev"],
    availableSeats: 200, registeredCount: 145, isRegistered: false, isBookmarked: false,
    reminderSet: false, registrationOpen: true, createdAt: "2026-08-01T00:00:00Z",
  },
  {
    id: "e2", title: "React 19 Workshop", description: "Hands-on workshop covering React 19 new features including Server Components and Actions.",
    posterUrl: "https://picsum.photos/seed/event2/600/400", date: "2026-08-10", time: "14:00",
    venue: "Seminar Hall B", organizer: "Web Dev Space", organizerId: "1", spaceId: "s1",
    type: "workshop", technologies: ["React", "Web Dev"],
    availableSeats: 50, registeredCount: 38, isRegistered: false, isBookmarked: false,
    reminderSet: false, registrationOpen: true, createdAt: "2026-08-02T00:00:00Z",
  },
  {
    id: "e3", title: "AI Research Seminar", description: "Presentation on latest developments in Large Language Models and their applications.",
    posterUrl: "https://picsum.photos/seed/event3/600/400", date: "2026-08-12", time: "10:00",
    venue: "CS Department Lab", organizer: "AI/ML Space", organizerId: "2", spaceId: "s5",
    type: "research_seminar", technologies: ["AI/ML", "Research"],
    availableSeats: 30, registeredCount: 25, isRegistered: false, isBookmarked: false,
    reminderSet: false, registrationOpen: true, createdAt: "2026-08-03T00:00:00Z",
  },
  {
    id: "e4", title: "CyberSec CTF Competition", description: "Capture The Flag competition for cybersecurity enthusiasts. Test your hacking skills!",
    date: "2026-08-20", time: "18:00", venue: "Network Lab", organizer: "Cyber Security Space",
    organizerId: "5", spaceId: "s4", type: "coding_competition", technologies: ["Cyber Security"],
    availableSeats: 60, registeredCount: 42, isRegistered: false, isBookmarked: false,
    reminderSet: false, registrationOpen: true, createdAt: "2026-08-04T00:00:00Z",
  },
  {
    id: "e5", title: "Flutter App Development Bootcamp", description: "5-day intensive bootcamp on Flutter app development. From zero to publishing your first app.",
    posterUrl: "https://picsum.photos/seed/event5/600/400", date: "2026-08-25", time: "10:00",
    venue: "IT Lab", organizer: "Flutter Space", organizerId: "4", spaceId: "s3",
    type: "workshop", technologies: ["Flutter", "App Dev"],
    availableSeats: 40, registeredCount: 35, isRegistered: false, isBookmarked: false,
    reminderSet: false, registrationOpen: true, createdAt: "2026-08-05T00:00:00Z",
  },
];

const MOCK_CONVERSATIONS: ChatConversation[] = [
  {
    id: "c1", participants: [MOCK_USERS[0], MOCK_USERS[1]],
    lastMessage: { id: "msg1", conversationId: "c1", senderId: "2", sender: MOCK_USERS[1], content: "Great project! Can I contribute?", attachments: [], reactions: [], isRead: false, isDeleted: false, createdAt: "2026-08-05T14:30:00Z", updatedAt: "2026-08-05T14:30:00Z" },
    unreadCount: 2, isGroup: false, updatedAt: "2026-08-05T14:30:00Z",
  },
  {
    id: "c2", participants: [MOCK_USERS[0], MOCK_USERS[3]],
    lastMessage: { id: "msg2", conversationId: "c2", senderId: "1", sender: MOCK_USERS[0], content: "Let's collaborate on the React workshop!", attachments: [], reactions: [], isRead: true, isDeleted: false, createdAt: "2026-08-05T10:00:00Z", updatedAt: "2026-08-05T10:00:00Z" },
    unreadCount: 0, isGroup: false, updatedAt: "2026-08-05T10:00:00Z",
  },
  {
    id: "c3", participants: [MOCK_USERS[0], MOCK_USERS[1], MOCK_USERS[3], MOCK_USERS[4]],
    lastMessage: { id: "msg3", conversationId: "c3", senderId: "4", sender: MOCK_USERS[3], content: "Who's joining the hackathon team?", attachments: [], reactions: [], isRead: false, isDeleted: false, createdAt: "2026-08-04T18:00:00Z", updatedAt: "2026-08-04T18:00:00Z" },
    unreadCount: 1, isGroup: true, groupName: "DevHack Team", updatedAt: "2026-08-04T18:00:00Z",
  },
];

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: "n1", userId: "1", type: "post_like", title: "New Like", message: "Priya Patel liked your post", isRead: false, priority: "normal", createdAt: "2026-08-05T15:00:00Z" },
  { id: "n2", userId: "1", type: "new_post", title: "New Post", message: "Sneha Reddy posted in Web Dev space", isRead: false, priority: "normal", createdAt: "2026-08-05T12:00:00Z" },
  { id: "n3", userId: "1", type: "hackathon_reminder", title: "Hackathon Reminder", message: "DevHack 2026 starts in 10 days! Don't forget to register.", isRead: false, priority: "important", createdAt: "2026-08-05T09:00:00Z" },
  { id: "n4", userId: "1", type: "comment_reply", title: "Comment Reply", message: "Arjun Kumar replied to your comment", isRead: true, priority: "normal", createdAt: "2026-08-04T16:00:00Z" },
  { id: "n5", userId: "1", type: "friend_request", title: "Friend Request", message: "Vikram Singh sent you a friend request", isRead: true, priority: "normal", createdAt: "2026-08-03T11:00:00Z" },
];

const MOCK_PROJECTS: Project[] = [
  {
    id: "proj1", title: "AI-Powered Study Assistant", description: "Building an intelligent study assistant that uses NLP to summarize notes, generate flashcards, and track learning progress.",
    techStack: ["Python", "React", "TensorFlow", "FastAPI"], requiredSkills: ["NLP", "React", "API Design"],
    members: [{ userId: "1", user: MOCK_USERS[0], role: "creator", joinedAt: "2026-07-01T00:00:00Z" }],
    status: "open", githubUrl: "https://github.com/rahul/study-assistant", deadline: "2026-09-30",
    updates: [{ id: "u1", projectId: "proj1", authorId: "1", author: MOCK_USERS[0], content: "Completed the NLP model training. Moving to frontend integration.", createdAt: "2026-08-04T10:00:00Z" }],
    discussions: [], creatorId: "1", createdAt: "2026-07-01T00:00:00Z",
  },
  {
    id: "proj2", title: "Smart Campus Navigation", description: "Indoor navigation system for the college campus using BLE beacons and a mobile app.",
    techStack: ["Flutter", "BLE", "Firebase", "Dart"], requiredSkills: ["Flutter", "BLE", "Firebase"],
    members: [
      { userId: "3", user: MOCK_USERS[2], role: "creator", joinedAt: "2026-07-15T00:00:00Z" },
      { userId: "4", user: MOCK_USERS[3], role: "member", joinedAt: "2026-07-20T00:00:00Z" },
    ],
    status: "in_progress", deadline: "2026-10-15",
    updates: [], discussions: [], creatorId: "3", createdAt: "2026-07-15T00:00:00Z",
  },
  {
    id: "proj3", title: "Open Source CLI Tool", description: "A command-line tool for managing development workflows, code reviews, and deployment pipelines.",
    techStack: ["Rust", "CLI", "CI/CD"], requiredSkills: ["Rust", "System Programming"],
    members: [{ userId: "5", user: MOCK_USERS[4], role: "creator", joinedAt: "2026-08-01T00:00:00Z" }],
    status: "open", githubUrl: "https://github.com/vikram/dev-cli",
    updates: [], discussions: [], creatorId: "5", createdAt: "2026-08-01T00:00:00Z",
  },
];

const MOCK_FRIEND_REQUESTS: FriendRequest[] = [
  { id: "fr1", fromUser: MOCK_USERS[4], toUser: MOCK_USERS[0], status: "pending", createdAt: "2026-08-03T11:00:00Z" },
];

// ==================== Store Context ====================

interface StoreState {
  currentUser: User | null;
  users: User[];
  posts: Post[];
  reels: Reel[];
  spaces: Space[];
  events: Event[];
  conversations: ChatConversation[];
  notifications: Notification[];
  projects: Project[];
  friendRequests: FriendRequest[];
}

interface StoreContextType extends StoreState {
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  // Posts
  createPost: (post: Omit<Post, "id" | "createdAt" | "updatedAt" | "likes" | "comments" | "shares" | "saves" | "isLiked" | "isSaved" | "reportCount" | "isDeleted">) => void;
  likePost: (postId: string) => void;
  savePost: (postId: string) => void;
  deletePost: (postId: string) => void;
  // Reels
  likeReel: (reelId: string) => void;
  saveReel: (reelId: string) => void;
  // Spaces
  joinSpace: (spaceId: string) => void;
  leaveSpace: (spaceId: string) => void;
  // Events
  rsvpEvent: (eventId: string) => void;
  cancelRsvp: (eventId: string) => void;
  // Friends
  sendFriendRequest: (userId: string) => void;
  acceptFriendRequest: (requestId: string) => void;
  rejectFriendRequest: (requestId: string) => void;
  // Profile
  updateProfile: (updates: Partial<User>) => void;
  // Notifications
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

function formatUserForPost(user: User): User {
  return { ...user, avatar: undefined };
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StoreState>(() => {
    return {
      currentUser: null,
      users: MOCK_USERS,
      posts: MOCK_POSTS,
      reels: MOCK_REELS,
      spaces: MOCK_SPACES,
      events: MOCK_EVENTS,
      conversations: MOCK_CONVERSATIONS,
      notifications: MOCK_NOTIFICATIONS,
      projects: MOCK_PROJECTS,
      friendRequests: MOCK_FRIEND_REQUESTS,
    };
  });

  // Load persisted state on mount
  useEffect(() => {
    AsyncStorage.getItem("cie-connect-state").then((data) => {
      if (data) {
        try {
          const parsed = JSON.parse(data);
          setState((prev) => ({ ...prev, ...parsed }));
        } catch {}
      }
    });
  }, []);

  // Persist state changes
  useEffect(() => {
    AsyncStorage.setItem("cie-connect-state", JSON.stringify(state));
  }, [state]);

  const login = useCallback(async (email: string, _password: string): Promise<boolean> => {
    let user = MOCK_USERS.find((u) => u.email === email);
    if (!user) {
      const domain = email.split("@")[1];
      const isAdmin = domain === "mlrit.ac.in";
      user = {
        id: generateId(),
        name: email.split("@")[0].replace(/[._]/g, " "),
        username: email.split("@")[0],
        email,
        collegeDomain: domain || "college.edu",
        bio: isAdmin ? "Administrator & Faculty Coordinator" : "Student & Tech Enthusiast",
        department: "Computer Science",
        year: 3,
        skills: ["React", "TypeScript", "Node.js"],
        techStack: ["MERN", "Expo"],
        interests: ["AI/ML", "Web Dev"],
        learningStreak: 30,
        achievements: [],
        certificates: [],
        hackathonsParticipated: [],
        role: isAdmin ? "system_admin" : "student",
        isEmailVerified: true,
        isAccountSuspended: false,
        isOnline: true,
        lastSeen: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };
    } else {
      const domain = email.split("@")[1];
      if (domain === "mlrit.ac.in") {
        user = { ...user, role: "system_admin" };
      } else {
        user = { ...user, role: "student" };
      }
    }
    setState((prev) => ({
      ...prev,
      currentUser: user,
      users: prev.users.some((u) => u.email === email) ? prev.users : [...prev.users, user!],
    }));
    return true;
  }, []);

  const register = useCallback(async (name: string, email: string, _password: string): Promise<boolean> => {
    const domain = email.split("@")[1];
    const isAdmin = domain === "mlrit.ac.in";
    const newUser: User = {
      id: generateId(), name, username: name.toLowerCase().replace(/\s+/g, "_"),
      email, collegeDomain: domain || "college.edu", bio: isAdmin ? "Administrator & Faculty" : "Student Member",
      department: "Computer Science", year: 3,
      skills: ["React", "TypeScript"], techStack: ["MERN"], interests: ["Web Dev", "AI/ML"],
      learningStreak: 10, achievements: [], certificates: [], hackathonsParticipated: [],
      role: isAdmin ? "system_admin" : "student", isEmailVerified: true, isAccountSuspended: false,
      isOnline: true, lastSeen: new Date().toISOString(), createdAt: new Date().toISOString(),
    };
    setState((prev) => ({
      ...prev,
      currentUser: newUser,
      users: [...prev.users, newUser],
    }));
    return true;
  }, []);

  const logout = useCallback(() => {
    setState((prev) => ({ ...prev, currentUser: null }));
    AsyncStorage.removeItem("cie-connect-state");
  }, []);

  const createPost = useCallback((post: Omit<Post, "id" | "createdAt" | "updatedAt" | "likes" | "comments" | "shares" | "saves" | "isLiked" | "isSaved" | "reportCount" | "isDeleted">) => {
    const newPost: Post = {
      ...post,
      id: generateId(),
      likes: [],
      comments: [],
      shares: 0,
      saves: [],
      isLiked: false,
      isSaved: false,
      reportCount: 0,
      isDeleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setState((prev) => ({ ...prev, posts: [newPost, ...prev.posts] }));
  }, []);

  const likePost = useCallback((postId: string) => {
    setState((prev) => ({
      ...prev,
      posts: prev.posts.map((p) =>
        p.id === postId
          ? {
              ...p,
              isLiked: !p.isLiked,
              likes: p.isLiked ? p.likes.filter((id) => id !== prev.currentUser?.id) : [...p.likes, prev.currentUser?.id || ""],
            }
          : p
      ),
    }));
  }, []);

  const savePost = useCallback((postId: string) => {
    setState((prev) => ({
      ...prev,
      posts: prev.posts.map((p) =>
        p.id === postId
          ? {
              ...p,
              isSaved: !p.isSaved,
              saves: p.isSaved ? p.saves.filter((id) => id !== prev.currentUser?.id) : [...p.saves, prev.currentUser?.id || ""],
            }
          : p
      ),
    }));
  }, []);

  const deletePost = useCallback((postId: string) => {
    setState((prev) => ({
      ...prev,
      posts: prev.posts.filter((p) => p.id !== postId),
    }));
  }, []);

  const likeReel = useCallback((reelId: string) => {
    setState((prev) => ({
      ...prev,
      reels: prev.reels.map((r) =>
        r.id === reelId
          ? {
              ...r,
              isLiked: !r.isLiked,
              likes: r.isLiked ? r.likes.filter((id) => id !== prev.currentUser?.id) : [...r.likes, prev.currentUser?.id || ""],
            }
          : r
      ),
    }));
  }, []);

  const saveReel = useCallback((reelId: string) => {
    setState((prev) => ({
      ...prev,
      reels: prev.reels.map((r) =>
        r.id === reelId
          ? {
              ...r,
              isSaved: !r.isSaved,
              saves: r.isSaved ? r.saves.filter((id) => id !== prev.currentUser?.id) : [...r.saves, prev.currentUser?.id || ""],
            }
          : r
      ),
    }));
  }, []);

  const joinSpace = useCallback((spaceId: string) => {
    setState((prev) => ({
      ...prev,
      spaces: prev.spaces.map((s) =>
        s.id === spaceId ? { ...s, isMember: true, memberCount: s.memberCount + 1 } : s
      ),
    }));
  }, []);

  const leaveSpace = useCallback((spaceId: string) => {
    setState((prev) => ({
      ...prev,
      spaces: prev.spaces.map((s) =>
        s.id === spaceId ? { ...s, isMember: false, memberCount: Math.max(0, s.memberCount - 1) } : s
      ),
    }));
  }, []);

  const rsvpEvent = useCallback((eventId: string) => {
    setState((prev) => ({
      ...prev,
      events: prev.events.map((e) =>
        e.id === eventId
          ? { ...e, isRegistered: true, registeredCount: e.registeredCount + 1, availableSeats: e.availableSeats - 1 }
          : e
      ),
    }));
  }, []);

  const cancelRsvp = useCallback((eventId: string) => {
    setState((prev) => ({
      ...prev,
      events: prev.events.map((e) =>
        e.id === eventId
          ? { ...e, isRegistered: false, registeredCount: Math.max(0, e.registeredCount - 1), availableSeats: e.availableSeats + 1 }
          : e
      ),
    }));
  }, []);

  const sendFriendRequest = useCallback((userId: string) => {
    const targetUser = state.users.find((u) => u.id === userId);
    if (targetUser && state.currentUser) {
      const fr: FriendRequest = {
        id: generateId(), fromUser: state.currentUser, toUser: targetUser,
        status: "pending", createdAt: new Date().toISOString(),
      };
      setState((prev) => ({ ...prev, friendRequests: [...prev.friendRequests, fr] }));
    }
  }, [state.users, state.currentUser]);

  const acceptFriendRequest = useCallback((requestId: string) => {
    setState((prev) => ({
      ...prev,
      friendRequests: prev.friendRequests.map((fr) =>
        fr.id === requestId ? { ...fr, status: "accepted" as const } : fr
      ),
    }));
  }, []);

  const rejectFriendRequest = useCallback((requestId: string) => {
    setState((prev) => ({
      ...prev,
      friendRequests: prev.friendRequests.map((fr) =>
        fr.id === requestId ? { ...fr, status: "rejected" as const } : fr
      ),
    }));
  }, []);

  const updateProfile = useCallback((updates: Partial<User>) => {
    setState((prev) => ({
      ...prev,
      currentUser: prev.currentUser ? { ...prev.currentUser, ...updates } : null,
    }));
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      ),
    }));
  }, []);

  const clearNotifications = useCallback(() => {
    setState((prev) => ({ ...prev, notifications: [] }));
  }, []);

  return (
    <StoreContext.Provider value={{
      ...state, login, register, logout, createPost, likePost, savePost, deletePost,
      likeReel, saveReel, joinSpace, leaveSpace, rsvpEvent, cancelRsvp,
      sendFriendRequest, acceptFriendRequest, rejectFriendRequest,
      updateProfile, markNotificationRead, clearNotifications,
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within StoreProvider");
  return context;
}
