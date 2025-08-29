# Tinder Profile Frontend Application

A React-based frontend application focused on Tinder profile management, built with Next.js and TypeScript.

## 🎯 Main Feature: Profile Section

The application is specifically designed for the **Tinder Profile Section** with all working buttons and functionality.

### 👤 Profile Section Features
- **Personal Information Form**: Complete form with all fields from the design
  - Name input field
  - Email input field  
  - Date of birth with calendar picker
  - Gender preferences dropdown (Female/Male/Both)
  - Bio text area
  - Profession input
  - School/Work input

- **Interest Selection**: 
  - 10 predefined interest categories
  - Click to select/deselect (maximum 10 selections)
  - Visual feedback for selected interests
  - Categories: Art, Music, Investment, Technology, Design, Education, Health, Fashion, Travel, Food

- **Form Validation & Submission**:
  - Real-time form validation
  - "Update profile" button with success notifications
  - Form data handling ready for backend integration

### 🖼️ Images Section (Secondary)
- **Image Upload**: File upload functionality
- **Image Display**: Grid layout for profile images
- **Image Deletion**: Remove images with X buttons
- **Image Management**: Save image changes

## 🚀 Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npx nx serve 2FH-tinder-frontend
   ```

3. **Access the Application**:
   - **Profile Page**: `http://localhost:4200/profile` (main focus)
   - **Images Page**: `http://localhost:4200/images` (secondary)
   - **Root**: Automatically redirects to profile page

## 📁 Page Structure

```
src/app/
├── page.tsx              # Redirects to /profile
├── profile/
│   └── page.tsx          # Main profile section (FOCUS)
└── images/
    └── page.tsx          # Images management section
```

## 🔧 Technical Implementation

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **Form Handling**: Controlled components with validation
- **Notifications**: Success toast notifications

## 🎨 Design Features

- **Browser Header Simulation**: Chrome-like interface
- **Tinder Branding**: Red color scheme and flame logo
- **Responsive Layout**: Works on all screen sizes
- **Interactive Elements**: Hover effects and transitions
- **Professional UI**: Clean, modern design matching Tinder's aesthetic

## 🔌 Backend Integration Ready

The profile section is structured for easy backend integration:

```typescript
// Key integration points in ProfileSection.tsx:
- handleSubmit() // Profile data submission
- handleInputChange() // Real-time form updates
- handleInterestToggle() // Interest selection
```

## 📱 Component Structure

```
src/components/
├── ProfileSection.tsx     # Main profile form (FOCUS)
├── TinderHeader.tsx       # Header with logo
├── Notification.tsx       # Success notifications
├── ImagesSection.tsx      # Image management
└── index.ts              # Component exports
```

## 🎯 Focus Areas

1. **Profile Form**: Complete personal information management
2. **Interest Selection**: Interactive interest tagging system
3. **Form Validation**: Real-time validation and error handling
4. **Success Feedback**: Toast notifications for user actions
5. **Responsive Design**: Mobile-friendly interface

The application is specifically optimized for the profile section functionality, with all buttons working and ready for backend integration. 