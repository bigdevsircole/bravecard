import { useSearchParams, Link } from 'react-router-dom'
import {
  User, Briefcase, Sparkles,
  Instagram, Facebook, MessageCircle,
  Linkedin
} from 'lucide-react'
import { FaWhatsapp, FaSnapchatGhost } from 'react-icons/fa'
import { Button } from '@/components/ui/button'

const socialPlatforms = [
  { key: 'whatsapp', label: 'WhatsApp', icon: FaWhatsapp, color: '#25D366' },
  { key: 'instagram', label: 'Instagram', icon: Instagram, color: '#E4405F' },
  { key: 'facebook', label: 'Facebook', icon: Facebook, color: '#1877F2' },
  { key: 'wechat', label: 'WeChat', icon: MessageCircle, color: '#07C160' },
  { key: 'linkedin', label: 'LinkedIn', icon: Linkedin, color: '#0077b5' },
  { key: 'snapchat', label: 'Snapchat', icon: FaSnapchatGhost, color: '#fffc00' },
]

export default function Profile() {
  const [searchParams] = useSearchParams()

  const name = searchParams.get('name') || 'Your Name'
  const occupation = searchParams.get('occupation') || 'Your Occupation'
  const bio = searchParams.get('bio') || ''

  // Get active social links from URL params
  const activeSocials = socialPlatforms
    .map(platform => ({
      ...platform,
      value: searchParams.get(platform.key)
    }))
    .filter(social => social.value) // Only keep platforms with a value

  // Design Templates matching App.tsx
  const designTemplates = [
    {
      id: 'minimalist',
      colors: { bg: '#0a0a0a', accent: '#d4af37', text: '#ffffff' }
    },
    {
      id: 'modern',
      colors: { bg: '#0f172a', accent: '#d4af37', text: '#ffffff' }
    },
    {
      id: 'classic',
      colors: { bg: '#172554', accent: '#d4af37', text: '#f8fafc' }
    },
    {
      id: 'creative',
      colors: { bg: '#3b0764', accent: '#e8c547', text: '#ffffff' }
    },
    {
      id: 'social',
      colors: { bg: '#022c22', accent: '#d4af37', text: '#ffffff' }
    }
  ]
  const designId = searchParams.get('design') || 'minimalist'
  const selectedTemplate = designTemplates.find(t => t.id === designId) || designTemplates[0]
  const theme = selectedTemplate.colors

  return (
    <div className="min-h-screen bg-dark-bg text-white flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      
      {/* Home Button */}
      <div className="w-full max-w-md mb-8 flex justify-start">
        <Link to="/">
          <Button variant="ghost" className="text-gray-400 hover:text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-gold" />
            <span className="font-display font-bold">Brave<span className="text-gold">Card</span> Home</span>
          </Button>
        </Link>
      </div>

      <div 
        className="w-full max-w-md rounded-3xl overflow-hidden shadow-2xl relative transition-colors duration-500"
        style={{ backgroundColor: theme.bg }}
      >
        {/* Card Header Background Effect */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 50% 0%, ${theme.accent}40, transparent 70%)`
          }}
        />

        <div className="relative p-8 text-center mt-8">
          {/* Avatar Placeholder / Avatar logic can be expanded if image base64s are passed, but URLs are better. */}
          <div className="relative mx-auto w-28 h-28 rounded-full border-4 overflow-hidden mb-6 flex items-center justify-center bg-gray-900"
            style={{ borderColor: theme.accent }}
          >
            <User className="w-12 h-12 text-gray-500" />
          </div>
          
          {/* Name & Occupation */}
          <h1 className="font-display text-3xl font-bold mb-2" style={{ color: theme.text }}>
            {name}
          </h1>
          <p className="text-lg opacity-80 flex items-center justify-center gap-2" style={{ color: theme.text }}>
            <Briefcase className="w-4 h-4" />
            {occupation}
          </p>
        </div>

        {/* Bio */}
        {bio && (
          <div className="px-8 pb-8">
            <p className="text-base text-center opacity-90 leading-relaxed" style={{ color: theme.text }}>
              {bio}
            </p>
          </div>
        )}

        {/* Social Links Grid */}
        <div className="p-8 bg-black/20 border-t border-white/5">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider text-center mb-6">
            Connect with me
          </h2>
          
          <div className="grid grid-cols-1 gap-4">
            {activeSocials.length > 0 ? (
              activeSocials.map((social) => {
                let href = social.value || '#'
                // Ensure URLs form proper links
                if (social.key === 'whatsapp' && !href.startsWith('http')) {
                  // remove non-numeric chars for whatsapp api
                  href = `https://wa.me/${href.replace(/\D/g,'')}`
                } else if (!href.startsWith('http') && social.key !== 'whatsapp') {
                  href = `https://${href}`
                }

                return (
                  <a
                    key={social.key}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 rounded-xl transition-all hover:scale-[1.02] hover:bg-white/5 border border-transparent hover:border-white/10"
                    style={{ backgroundColor: `${social.color}15` }}
                  >
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${social.color}20` }}
                    >
                      <social.icon className="w-6 h-6" style={{ color: social.color }} />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-white">{social.label}</p>
                      <p className="text-sm text-gray-400 truncate max-w-[200px]">{social.value}</p>
                    </div>
                  </a>
                )
              })
            ) : (
              <p className="text-center text-gray-500 text-sm py-4">
                No social links added yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
