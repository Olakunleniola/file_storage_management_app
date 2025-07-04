# Store-It 🗂️

A modern, full-stack file storage and management application built with Next.js, TypeScript, and Appwrite. Think of it as your personal Google Drive with a beautiful, intuitive interface.

![Store-It Dashboard](public/readme/hero.png)

## ✨ Features

### 🔐 Authentication & Security

- **Email-based OTP Authentication**: Secure login with one-time password verification
- **Session Management**: Persistent user sessions with secure cookie handling
- **User Profiles**: Customizable user profiles with avatar support

### 📁 File Management

- **Drag & Drop Upload**: Intuitive file upload with drag-and-drop support
- **File Type Detection**: Automatic categorization of files (documents, images, media, others)
- **File Preview**: Thumbnail generation for images and file type icons
- **File Actions**: Download, rename, share, and delete files
- **File Sharing**: Share files with other users via email addresses
- **Storage Analytics**: Real-time storage usage tracking and visualization

### 🔍 Search & Organization

- **Advanced Search**: Search files by name across all categories
- **Smart Sorting**: Sort files by name, date, size, or type
- **Category Filtering**: Browse files by type (documents, images, media, others)
- **Recent Files**: Quick access to recently uploaded files

### 📊 Dashboard & Analytics

- **Storage Overview**: Visual chart showing storage usage percentage
- **File Statistics**: Breakdown of files by type with total sizes
- **Usage Analytics**: Track storage consumption over time
- **Activity Feed**: Monitor recent file activities

### 🎨 Modern UI/UX

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Dark/Light Mode**: Beautiful theme support
- **Modern Components**: Built with shadcn/ui for consistent design
- **Smooth Animations**: Engaging user interactions and transitions
- **Accessibility**: WCAG compliant with keyboard navigation support

## 🛠️ Tech Stack

### Frontend

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Modern component library
- **Recharts**: Beautiful data visualization
- **React Hook Form**: Form handling and validation

### Backend & Database

- **Appwrite**: Backend-as-a-Service platform
- **Appwrite Database**: NoSQL database for file metadata
- **Appwrite Storage**: File storage with automatic CDN
- **Appwrite Auth**: User authentication and session management

### Development Tools

- **ESLint**: Code linting and formatting
- **PostCSS**: CSS processing
- **Vite**: Fast build tooling

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Appwrite account and project

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd store-it
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up Appwrite**

   - Create a new Appwrite project
   - Set up the following collections:
     - `users` (for user profiles)
     - `files` (for file metadata)
   - Create a storage bucket for files
   - Configure authentication settings

4. **Environment Variables**
   Create a `.env.local` file in the root directory:

   ```env
   NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
   NEXT_PUBLIC_APPWRITE_DATABASE_ID=your_database_id
   NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID=your_users_collection_id
   NEXT_PUBLIC_APPWRITE_FILES_COLLECTION_ID=your_files_collection_id
   NEXT_PUBLIC_APPWRITE_BUCKET_ID=your_bucket_id
   APPWRITE_API_KEY=your_api_key
   ```

5. **Run the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
store-it/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages
│   │   ├── sign-in/       # Sign in page
│   │   └── sign-up/       # Sign up page
│   └── (root)/            # Protected routes
│       ├── [type]/        # Dynamic file type pages
│       └── page.tsx       # Dashboard
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── Chart.tsx         # Storage analytics chart
│   ├── Card.tsx          # File display card
│   ├── Search.tsx        # Search functionality
│   └── ...               # Other components
├── lib/                  # Utility functions
│   ├── actions/          # Server actions
│   ├── appwrite/         # Appwrite configuration
│   └── utils.ts          # Helper functions
├── types/                # TypeScript type definitions
└── public/               # Static assets
```

## 🎯 Key Features Explained

### File Upload System

- Supports drag-and-drop file uploads
- Automatic file type detection and categorization
- Progress tracking and error handling
- File size validation and limits

### File Sharing

- Share files with other users via email
- Granular permission control
- Real-time collaboration features

### Storage Analytics

- Visual representation of storage usage
- File type breakdown with statistics
- Storage quota management
- Usage trends and insights

### Search & Filter

- Full-text search across file names
- Advanced filtering by file type, date, and size
- Real-time search results
- Search history and suggestions

## 🔧 Configuration

### Appwrite Setup

1. **Database Collections**

   - `users`: Store user profiles and preferences
   - `files`: Store file metadata and sharing information

2. **Storage Bucket**

   - Configure file upload permissions
   - Set up CDN for fast file delivery
   - Configure file size limits

3. **Authentication**
   - Enable email-based authentication
   - Configure session management
   - Set up user roles and permissions

### Customization

- Modify color schemes in `tailwind.config.ts`
- Update component styles in `components/ui/`
- Customize file type detection in `lib/utils.ts`
- Adjust storage limits and file size restrictions

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy with automatic CI/CD

### Other Platforms

- **Netlify**: Similar deployment process
- **Railway**: Container-based deployment
- **AWS/GCP**: Custom server deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Appwrite** for the powerful backend platform
- **shadcn/ui** for the beautiful component library
- **Next.js** team for the amazing React framework
- **Tailwind CSS** for the utility-first CSS framework

> A special thanks to [**JavaScript Mastery**](https://www.youtube.com/@javascriptmastery) – I followed their YouTube video as a guide to build this project. Their tutorials are incredibly helpful for mastering modern web development!

## 📞 Support

If you have any questions or need help:

- Open an issue on GitHub
- Check the documentation
- Join our community discussions

---

**Built with ❤️ using Next.js, TypeScript, and Appwrite**
