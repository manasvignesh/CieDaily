# CIE Connect - Mobile App Interface Design

## Brand Identity
- **Primary Color**: Electric Blue (#1E90FF) — represents technology, innovation, energy
- **Accent Color**: Vivid Purple (#7C3AED) — represents creativity, community
- **Background**: Clean White (#FFFFFF) / Dark (#111827)
- **Surface**: Light Gray (#F8FAFC) / Dark Gray (#1E293B)
- **Success**: Emerald (#10B981), **Warning**: Amber (#F59E0B), **Error**: Red (#EF4444)
- **Typography**: System default (iOS SF Pro / Android Roboto) — clean, modern

## Screen List

### Authentication Flow
1. **Login Screen** — Email/password login + Google sign-in, CIE Connect branding
2. **Register Screen** — Name, college email, password with validation
3. **Forgot Password Screen** — Email input for reset link
4. **Email Verification Screen** — Show verification status

### Main Tabs (6 tabs)
5. **Home Feed** (`(tabs)/index.tsx`) — Chronological tech-focused feed
6. **Reels** (`(tabs)/reels.tsx`) — Full-screen vertical video feed
7. **Spaces** (`(tabs)/spaces.tsx`) — Technology communities list
8. **Events** (`(tabs)/events.tsx`) — Hackathons, workshops, tech talks
9. **Chat** (`(tabs)/chat.tsx`) — Real-time messaging
10. **Profile** (`(tabs)/profile.tsx`) — User's own profile

### Navigation Screens (non-tab)
11. **Search** — Global search across technologies, projects, events, spaces
12. **Notifications** — Notification center
13. **Post Creation** — Create post/reel with media upload
14. **User Profile (Other)** — View another user's profile
15. **Space Details** — Space info, members, events, gallery, discussions
16. **Event Details** — Event info, RSVP, reminders
17. **Chat Window** — Individual/group conversation
18. **Project List** — Browse collaboration projects
19. **Project Details** — Project info, team, discussions
20. **Settings** — Dark mode, notifications, privacy, account
21. **Admin Panel** — User management, content moderation, reports
22. **Friend Management** — Friends list, requests, suggestions
23. **Comments** — Comment thread on posts/reels
24. **Reports** — Report content/users interface

## Key User Flows

### Discovery Flow (Instagram → CIE Connect)
1. User opens app → sees Home Feed with tech content
2. User taps Reels tab → watches educational tech videos
3. User discovers interesting topic → taps technology category
4. User browses related posts, reels, spaces
5. User joins Space → accesses workshops, events, community

### Content Creation Flow
1. User taps "+" button → selects post or reel
2. User adds caption, selects tech category, attaches media
3. System validates content → publishes to feed
4. Post appears in followers' feeds and space feed

### Community Flow
1. User browses Spaces → finds matching tech interest
2. User joins Space → views announcements, events, gallery
3. User RSVPs to workshop → receives reminder
4. User participates in space discussions

### Collaboration Flow
1. User browses Projects → filters by tech stack
2. User views project details → requests to join
3. Project creator approves → user joins team
4. Team communicates via project discussion board

## Layout Patterns

### Home Feed
- Top: App logo + search icon + notification bell
- Below: Horizontal tech category chips (scrollable)
- Main: FlatList of post cards
- Each card: User avatar, name, timestamp, tech badge, image/video, caption, engagement bar (like, comment, share, save, more)
- Bottom: Tab bar (Home, Reels, Spaces, Events, Chat, Profile)

### Reels
- Full-screen vertical video
- Swipe up for next reel
- Right side: Action buttons (like, comment, share, save) stacked vertically
- Bottom: Creator info, caption, tech category
- Bottom center: Play/pause indicator

### Spaces
- Search bar at top
- Horizontal filter chips (AI/ML, Flutter, Robotics, etc.)
- Grid/list of space cards with logo, name, member count, brief description

### Events
- Date filter tabs (Upcoming, This Week, This Month)
- Event cards with poster image, title, date/time, venue, organizer
- Event type badges (Hackathon, Workshop, Tech Talk)

### Chat
- Search bar at top
- Conversation list with avatar, name, last message preview, timestamp, unread badge
- Floating "new chat" button

### Profile
- Cover image + profile picture (overlapping)
- Name, username, bio
- Stats: Posts, Followers, Following, Learning Streak
- Edit profile button
- Tabs: Posts, Projects, Spaces, Saved
- Skills/tech stack pills

## Color Choices
- Primary: `#1E90FF` (Electric Blue) — technology, innovation
- Accent: `#7C3AED` (Purple) — creativity, community
- Background: `#FFFFFF` light / `#111827` dark
- Surface: `#F8FAFC` light / `#1E293B` dark
- Foreground: `#111827` light / `#F9FAFB` dark
- Muted: `#64748B` light / `#94A3B8` dark
- Border: `#E2E8F0` light / `#334155` dark
- Success: `#10B981` (Emerald)
- Warning: `#F59E0B` (Amber)
- Error: `#EF4444` (Red)
