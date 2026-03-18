import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { db } from './lib/firebase'
import { ref, get, child } from 'firebase/database'
import {
  Briefcase, Sparkles,
  Instagram, Facebook, MessageCircle,
  Linkedin, AlertCircle
} from 'lucide-react'
import { FaWhatsapp, FaSnapchatGhost, FaTelegramPlane, FaTwitter } from 'react-icons/fa'
import { Button } from '@/components/ui/button'

// 1. Structure the Profile Data
export interface SocialLinks {
  whatsapp?: string
  instagram?: string
  facebook?: string
  twitter?: string
  telegram?: string
  wechat?: string
  linkedin?: string
  snapchat?: string
}

export interface ProfileData {
  username?: string
  name: string
  occupation: string
  bio: string
  image: string | null
  socials: SocialLinks
  design?: string
}

// 2. Define Social Platforms Configuration
const socialPlatforms = [
  { key: 'whatsapp', label: 'WhatsApp', icon: FaWhatsapp, color: '#25D366' },
  { key: 'instagram', label: 'Instagram', icon: Instagram, color: '#E4405F' },
  { key: 'facebook', label: 'Facebook', icon: Facebook, color: '#1877F2' },
  { key: 'twitter', label: 'Twitter', icon: FaTwitter, color: '#1DA1F2' },
  { key: 'telegram', label: 'Telegram', icon: FaTelegramPlane, color: '#2AABEE' },
  { key: 'linkedin', label: 'LinkedIn', icon: Linkedin, color: '#0077b5' },
  { key: 'wechat', label: 'WeChat', icon: MessageCircle, color: '#07C160' },
  { key: 'snapchat', label: 'Snapchat', icon: FaSnapchatGhost, color: '#fffc00' },
]

// 3. Sample Profile Data (Mock Database)
const MOCK_PROFILES: Record<string, ProfileData> = {
  johndoe: {
    username: 'johndoe',
    name: 'John Doe',
    occupation: 'Senior React Engineer',
    bio: 'Building modern web experiences with React, TypeScript, and a lot of coffee.',
    image: 'https://i.pravatar.cc/300?u=johndoe',
    design: 'modern',
    socials: {
      whatsapp: '1234567890',
      instagram: 'johndoe_ig',
      linkedin: 'in/johndoe',
      snapchat: 'johndoesnap',
    }
  },
  janedoe: {
    username: 'janedoe',
    name: 'Jane Doe',
    occupation: 'UX/UI Designer',
    bio: 'Creating beautiful and accessible user interfaces. Design is not just what it looks like, it is how it works.',
    image: 'https://i.pravatar.cc/300?u=janedoe',
    design: 'creative',
    socials: {
      instagram: 'janedesigns',
      linkedin: 'in/janedesigns',
      facebook: 'jane.designer',
    }
  }
}

// Helper to format social link URLs properly
const formatSocialUrl = (platform: string, value: string) => {
  if (!value) return '#'
  
  let href = value
  if (platform === 'whatsapp' && !href.startsWith('http')) {
    href = `https://wa.me/${href.replace(/\D/g,'')}`
  } else if (platform === 'instagram' && !href.startsWith('http')) {
    href = `https://instagram.com/${href.replace('@', '')}`
  } else if (platform === 'twitter' && !href.startsWith('http')) {
    href = `https://twitter.com/${href.replace('@', '')}`
  } else if (platform === 'telegram' && !href.startsWith('http')) {
    href = `https://t.me/${href.replace('@', '')}`
  } else if (!href.startsWith('http')) {
    href = `https://${href}`
  }
  return href
}

export default function PublicProfile() {
  const { username } = useParams<{ username: string }>()
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProfile() {
      if (!username) return
      
      try {
        const dbRef = ref(db)
        const snapshot = await get(child(dbRef, `profiles/${username}`))
        
        if (snapshot.exists()) {
          setProfileData(snapshot.val() as ProfileData)
        } else {
          // Check local data (fallback)
          const savedProfilesStr = localStorage.getItem('bravecard_profiles')
          if (savedProfilesStr) {
            try {
              const savedProfiles = JSON.parse(savedProfilesStr)
              if (savedProfiles[username]) {
                setProfileData(savedProfiles[username])
                return
              }
            } catch(e) {}
          }
          if (MOCK_PROFILES[username]) {
            setProfileData(MOCK_PROFILES[username])
          }
        }
      } catch (error) {
        console.error('Error fetching profile from Firebase:', error)
        if (MOCK_PROFILES[username]) {
          setProfileData(MOCK_PROFILES[username])
        }
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [username])

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg text-white flex flex-col items-center justify-center p-4">
        <Sparkles className="w-10 h-10 text-gold animate-spin mb-4" />
        <span className="font-display text-xl tracking-widest text-gold opacity-80 uppercase text-sm">Loading Card...</span>
      </div>
    )
  }

  // Handle case where profile is not found
  if (!profileData) {
    return (
      <div className="min-h-screen bg-dark-bg text-white flex flex-col items-center justify-center p-4">
        <AlertCircle className="w-16 h-16 text-yellow-500 mb-4" />
        <h1 className="text-3xl font-display font-bold mb-2">Profile Not Found</h1>
        <p className="text-gray-400 mb-8 text-center max-w-md">
          The user profile <strong>@{username}</strong> doesn't exist or hasn't been created yet.
        </p>
        <Link to="/">
          <Button className="bg-gold text-black hover:bg-gold-light">
            Create Your Profile
          </Button>
        </Link>
      </div>
    )
  }

  // Get active social links based on the profile data and defined platforms
  const activeSocials = socialPlatforms
    .map(platform => ({
      ...platform,
      value: profileData!.socials[platform.key as keyof SocialLinks]
    }))
    .filter(social => social.value && social.value.trim() !== '')

  // Render Design Theme
  const designTemplates = [
    { id: 'minimalist', colors: { bg: '#0a0a0a', accent: '#d4af37', text: '#ffffff' } },
    { id: 'modern', colors: { bg: '#0f172a', accent: '#d4af37', text: '#ffffff' } },
    { id: 'classic', colors: { bg: '#172554', accent: '#d4af37', text: '#f8fafc' } },
    { id: 'creative', colors: { bg: '#3b0764', accent: '#e8c547', text: '#ffffff' } },
    { id: 'social', colors: { bg: '#022c22', accent: '#d4af37', text: '#ffffff' } }
  ]
  const selectedTemplate = designTemplates.find(t => t.id === profileData?.design) || designTemplates[0]
  const theme = selectedTemplate.colors

  // Default Avatar Placeholder Data URL (could also be user initials)
  const defaultAvatar = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%234b5563' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'/%3E%3Ccircle cx='12' cy='7' r='4'/%3E%3C/svg%3E"

  return (
    <div className="min-h-screen bg-dark-bg text-white flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      {/* App Branding Header */}
      <div className="w-full max-w-md mb-8 flex justify-center">
        <Link to="/" className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity">
          <Sparkles className="w-5 h-5 text-gold" />
          <span className="font-display font-bold text-lg">Brave<span className="text-gold">Card</span></span>
        </Link>
      </div>

      <div 
        className="w-full max-w-md rounded-3xl overflow-hidden shadow-2xl shadow-black/50 relative"
        style={{ backgroundColor: theme.bg }}
      >
        {/* Background glow effect based on accent color */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{ background: `radial-gradient(circle at 50% 0%, ${theme.accent}60, transparent 70%)` }}
        />

        {/* Profile Details section */}
        <div className="relative p-8 text-center mt-6">
          <div 
            className="relative mx-auto w-32 h-32 rounded-full border-4 overflow-hidden mb-6 shadow-xl"
            style={{ borderColor: theme.accent, backgroundColor: '#111' }}
          >
            <img 
              src={profileData.image || defaultAvatar} 
              alt={`${profileData.name}'s Profile`}
              className="w-full h-full object-cover"
            />
          </div>
          
          <h1 className="font-display text-3xl font-bold mb-2 tracking-tight" style={{ color: theme.text }}>
            {profileData.name}
          </h1>
          <p className="text-lg opacity-80 flex items-center justify-center gap-2 mb-1" style={{ color: theme.text }}>
            <Briefcase className="w-4 h-4" />
            {profileData.occupation}
          </p>
        </div>

        {/* Biography */}
        {profileData.bio && (
          <div className="px-8 pb-8">
            <p className="text-base text-center opacity-90 leading-relaxed" style={{ color: theme.text }}>
              {profileData.bio}
            </p>
          </div>
        )}

        {/* Social Links Section */}
        <div className="p-8 bg-black/30 border-t border-white/5 backdrop-blur-sm">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest text-center mb-6">
            Connect with me
          </h2>
          
          <div className="grid grid-cols-1 gap-4">
            {activeSocials.length > 0 ? (
              activeSocials.map((social) => {
                const href = formatSocialUrl(social.key, social.value!)
                return (
                  <a
                    key={social.key}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-4 p-4 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:bg-white/10 border border-white/5 hover:border-white/20 shadow-sm"
                    style={{ backgroundColor: `${social.color}15` }}
                  >
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center shadow-inner"
                      style={{ backgroundColor: `${social.color}25` }}
                    >
                      <social.icon className="w-6 h-6 transition-transform group-hover:scale-110" style={{ color: social.color }} />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-white group-hover:text-gold transition-colors">{social.label}</p>
                      <p className="text-xs text-gray-400 truncate max-w-[200px] mt-0.5">{social.value}</p>
                    </div>
                  </a>
                )
              })
            ) : (
              <p className="text-center text-gray-400 text-sm py-6 bg-black/20 rounded-xl">
                No social links added yet.
              </p>
            )}
          </div>
        </div>
      </div>
      
      {/* Footer / Create own card link */}
      <div className="mt-12 text-center">
        <p className="text-gray-500 text-sm mb-2">Want your own digital business card?</p>
        <Link to="/" className="text-gold hover:text-gold-light text-sm font-medium transition-colors">
          Create a free BraveCard
        </Link>
      </div>
    </div>
  )
}
