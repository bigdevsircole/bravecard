import { useState, useRef, useEffect } from 'react'
import './App.css'
import { QRCodeSVG } from 'qrcode.react'
import html2canvas from 'html2canvas'
import { 
  User, Briefcase, FileText, Link2, Camera, Palette, 
  QrCode, Share2, Monitor, BarChart3, Zap, Check, 
  ChevronRight, Download, Copy, RotateCcw, Sparkles,
  Instagram, Facebook, MessageCircle,
  Globe, Linkedin
} from 'lucide-react'
import { FaWhatsapp, FaSnapchatGhost } from 'react-icons/fa'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

// Types
interface SocialLinks {
  whatsapp: string
  instagram: string
  facebook: string
  wechat: string
  linkedin: string
  snapchat: string
}

interface ProfileData {
  name: string
  occupation: string
  bio: string
  image: string | null
  socials: SocialLinks
}

interface DesignTemplate {
  id: string
  name: string
  description: string
  preview: string
  colors: {
    bg: string
    accent: string
    text: string
  }
}

// Design Templates
const designTemplates: DesignTemplate[] = [
  {
    id: 'minimalist',
    name: 'Minimalist Elegance',
    description: 'Clean lines and subtle sophistication',
    preview: 'from-gray-900 to-black',
    colors: { bg: '#0a0a0a', accent: '#d4af37', text: '#ffffff' }
  },
  {
    id: 'modern',
    name: 'Modern Bold',
    description: 'Make a statement with confidence',
    preview: 'from-slate-900 via-gray-900 to-black',
    colors: { bg: '#0f172a', accent: '#d4af37', text: '#ffffff' }
  },
  {
    id: 'classic',
    name: 'Classic Professional',
    description: 'Timeless elegance never goes out of style',
    preview: 'from-blue-950 via-slate-900 to-black',
    colors: { bg: '#172554', accent: '#d4af37', text: '#f8fafc' }
  },
  {
    id: 'creative',
    name: 'Creative Portfolio',
    description: 'Showcase your work with artistic flair',
    preview: 'from-purple-950 via-gray-900 to-black',
    colors: { bg: '#3b0764', accent: '#e8c547', text: '#ffffff' }
  },
  {
    id: 'social',
    name: 'Social Connector',
    description: 'Put your social presence front and center',
    preview: 'from-emerald-950 via-gray-900 to-black',
    colors: { bg: '#022c22', accent: '#d4af37', text: '#ffffff' }
  }
]

// Features data
const features = [
  {
    icon: Zap,
    title: 'Easy to Use',
    description: 'Create your profile in minutes with our intuitive interface. No technical skills required.'
  },
  {
    icon: Palette,
    title: 'Customizable Designs',
    description: 'Choose from a variety of elegant templates. Customize colors, fonts, and layouts to match your style.'
  },
  {
    icon: QrCode,
    title: 'QR Code Integration',
    description: 'Generate unique QR codes for instant sharing. Scan and connect in seconds.'
  },
  {
    icon: Share2,
    title: 'Social Media Links',
    description: 'Connect all your social profiles in one place. Instagram, Facebook, LinkedIn, and more.'
  },
  {
    icon: Monitor,
    title: 'Responsive Design',
    description: 'Your profile looks perfect on any device. Mobile, tablet, or desktop—always stunning.'
  },
  {
    icon: BarChart3,
    title: 'Analytics',
    description: 'Track profile views and QR scans. Understand your audience and grow your network.'
  }
]

// Social platform config
const socialPlatforms = [
  { key: 'whatsapp', label: 'WhatsApp', icon: FaWhatsapp, placeholder: '+1234567890', color: '#25D366' },
  { key: 'instagram', label: 'Instagram', icon: Instagram, placeholder: 'instagram.com/username', color: '#E4405F' },
  { key: 'facebook', label: 'Facebook', icon: Facebook, placeholder: 'facebook.com/username', color: '#1877F2' },
  { key: 'wechat', label: 'WeChat', icon: MessageCircle, placeholder: 'WeChat ID', color: '#07C160' },
  { key: 'linkedin', label: 'LinkedIn', icon: Linkedin, placeholder: 'linkedin.com/in/username', color: '#0077b5' },
  { key: 'snapchat', label: 'Snapchat URL', icon: FaSnapchatGhost, placeholder: 'snapchat.com/add/username', color: '#fffc00' },
]

function App() {
  const [currentStep, setCurrentStep] = useState<'form' | 'design' | 'preview'>('form')
  const [selectedDesign, setSelectedDesign] = useState<string>('minimalist')
  const [isAnimating, setIsAnimating] = useState(false)
  
  const [profile, setProfile] = useState<ProfileData>({
    name: '',
    occupation: '',
    bio: '',
    image: null,
    socials: {
      whatsapp: '',
      instagram: '',
      facebook: '',
      wechat: '',
      linkedin: '',
      snapchat: ''
    }
  })

  const fileInputRef = useRef<HTMLInputElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const profileCardRef = useRef<HTMLDivElement>(null)

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfile(prev => ({ ...prev, image: reader.result as string }))
        toast.success('Image uploaded successfully!')
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle social link changes
  const handleSocialChange = (platform: keyof SocialLinks, value: string) => {
    setProfile(prev => ({
      ...prev,
      socials: { ...prev.socials, [platform]: value }
    }))
  }

  // Generate profile URL for QR code
  const generateProfileUrl = () => {
    const baseUrl = window.location.origin
    const params = new URLSearchParams({
      name: profile.name,
      occupation: profile.occupation,
      bio: profile.bio,
      ...Object.entries(profile.socials).reduce((acc, [key, val]) => {
        if (val) acc[key] = val
        return acc
      }, {} as Record<string, string>),
      design: selectedDesign
    })
    return `${baseUrl}/profile?${params.toString()}`
  }

  // Get active social links
  const getActiveSocials = () => {
    return Object.entries(profile.socials)
      .filter(([, value]) => value.trim() !== '')
      .map(([key, value]) => ({
        platform: key as keyof SocialLinks,
        value,
        ...socialPlatforms.find(p => p.key === key)!
      }))
  }

  // Copy QR code link
  const copyLink = () => {
    navigator.clipboard.writeText(generateProfileUrl())
    toast.success('Link copied to clipboard!')
  }

  // Download QR code
  const downloadQR = () => {
    const svg = document.querySelector('#profile-qr-code svg')
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg)
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()
      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height
        ctx?.drawImage(img, 0, 0)
        const pngFile = canvas.toDataURL('image/png')
        const downloadLink = document.createElement('a')
        downloadLink.download = `profile-qr-${profile.name || 'code'}.png`
        downloadLink.href = pngFile
        downloadLink.click()
        toast.success('QR code downloaded!')
      }
      img.src = 'data:image/svg+xml;base64,' + btoa(svgData)
    }
  }

  // Download entire profile card
  const downloadProfileCard = async () => {
    if (!profileCardRef.current) return
    try {
      toast.info('Generating profile card image...')
      const canvas = await html2canvas(profileCardRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: null
      })
      const image = canvas.toDataURL('image/png')
      const downloadLink = document.createElement('a')
      downloadLink.download = `profile-card-${profile.name || 'card'}.png`
      downloadLink.href = image
      downloadLink.click()
      toast.success('Profile card downloaded!')
    } catch (error) {
      console.error('Error generating image:', error)
      toast.error('Failed to download profile card')
    }
  }

  // Reset form
  const resetForm = () => {
    setProfile({
      name: '',
      occupation: '',
      bio: '',
      image: null,
      socials: {
        whatsapp: '',
        instagram: '',
        facebook: '',
        wechat: '',
        linkedin: '',
        snapchat: ''
      }
    })
    setCurrentStep('form')
    setSelectedDesign('minimalist')
    toast.info('Form reset successfully')
  }

  // Proceed to design selection
  const proceedToDesign = () => {
    if (!profile.name.trim()) {
      toast.error('Please enter your name')
      return
    }
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentStep('design')
      setIsAnimating(false)
    }, 300)
  }

  // Proceed to preview
  const proceedToPreview = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentStep('preview')
      setIsAnimating(false)
    }, 300)
  }

  // Get selected design template
  const getSelectedTemplate = () => {
    return designTemplates.find(t => t.id === selectedDesign) || designTemplates[0]
  }

  // Scroll to preview when step changes
  useEffect(() => {
    if (currentStep === 'preview' && previewRef.current) {
      setTimeout(() => {
        previewRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }
  }, [currentStep])

  return (
    <div className="min-h-screen bg-dark-bg text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-dark-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-gold" />
              <span className="font-display text-xl font-bold">
                Brave<span className="text-gold">Card</span>
              </span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-gray-400 hover:text-gold transition-colors">Features</a>
              <a href="#how-it-works" className="text-sm text-gray-400 hover:text-gold transition-colors">How It Works</a>
              <a href="#create" className="text-sm text-gray-400 hover:text-gold transition-colors">Create</a>
            </div>
            <Button 
              onClick={() => document.getElementById('create')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-gold text-black hover:bg-gold-light font-medium"
            >
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-dark-bg via-dark-card to-dark-bg" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gold/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(rgba(212, 175, 55, 0.3) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(212, 175, 55, 0.3) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in-up">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 text-gold text-sm mb-8">
              <Sparkles className="w-4 h-4" />
              Create Your Digital Identity
            </span>
          </div>
          
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Craft Your
            <span className="block text-gradient-gold">Digital Profile</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Create a stunning digital profile with personalized QR codes. 
            Connect your world—social media, contact info, and more—in one elegant scan.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <Button 
              size="lg"
              onClick={() => document.getElementById('create')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-gold text-black hover:bg-gold-light font-semibold px-8 py-6 text-lg group"
            >
              Start Creating
              <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className="border-gold/50 text-gold hover:bg-gold/10 px-8 py-6 text-lg"
            >
              Learn More
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto mt-16 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-display font-bold text-gold">10K+</div>
              <div className="text-sm text-gray-500 mt-1">Profiles Created</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-display font-bold text-gold">50K+</div>
              <div className="text-sm text-gray-500 mt-1">QR Scans</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-display font-bold text-gold">5</div>
              <div className="text-sm text-gray-500 mt-1">Designs</div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-subtle">
          <div className="w-6 h-10 rounded-full border-2 border-gold/30 flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-gold rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Why Choose <span className="text-gold">BraveCard</span>?
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Powerful features designed for the modern professional
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div 
                key={feature.title}
                className="group relative p-6 rounded-2xl bg-dark-card border border-dark-border hover:border-gold/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-gold-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-gold/20 transition-all duration-300">
                  <feature.icon className="w-6 h-6 text-gold" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 relative bg-dark-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
              How It <span className="text-gold">Works</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Create your digital profile in four simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Choose Your Design', desc: 'Browse our collection of elegant templates and select the perfect design.' },
              { step: '02', title: 'Add Your Information', desc: 'Fill in your details—name, occupation, bio, and social media links.' },
              { step: '03', title: 'Generate QR Code', desc: 'We\'ll instantly create a unique QR code linked to your profile.' },
              { step: '04', title: 'Share & Connect', desc: 'Start sharing your profile and watch your network grow.' },
            ].map((item, index) => (
              <div key={item.step} className="relative text-center group">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gold/10 border-2 border-gold/30 flex items-center justify-center group-hover:bg-gold/20 group-hover:border-gold transition-all duration-300">
                  <span className="text-2xl font-display font-bold text-gold">{item.step}</span>
                </div>
                <h3 className="font-display text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
                {index < 3 && (
                  <div className="hidden md:block absolute top-10 left-[60%] w-full h-0.5 bg-gradient-to-r from-gold/30 to-transparent" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Create Profile Section */}
      <section id="create" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Create Your <span className="text-gold">Profile</span>
            </h2>
            <p className="text-gray-400 text-lg">
              Fill in your details and choose a design that represents you
            </p>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-4 mb-12">
            {['form', 'design', 'preview'].map((step, index) => (
              <div key={step} className="flex items-center">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm
                  transition-all duration-300
                  ${currentStep === step ? 'bg-gold text-black' : 
                    (step === 'form' || (step === 'design' && currentStep === 'preview')) ? 'bg-gold/20 text-gold' : 'bg-dark-border text-gray-500'}
                `}>
                  {step === 'form' ? <User className="w-5 h-5" /> : 
                   step === 'design' ? <Palette className="w-5 h-5" /> : 
                   <QrCode className="w-5 h-5" />}
                </div>
                {index < 2 && (
                  <div className={`
                    w-16 h-0.5 mx-2 transition-all duration-300
                    ${(step === 'form' && currentStep !== 'form') || (step === 'design' && currentStep === 'preview') ? 'bg-gold' : 'bg-dark-border'}
                  `} />
                )}
              </div>
            ))}
          </div>

          {/* Step Content */}
          <div className={`transition-all duration-300 ${isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
            
            {/* Step 1: Form */}
            {currentStep === 'form' && (
              <div className="max-w-3xl mx-auto">
                <div className="bg-dark-card border border-dark-border rounded-2xl p-8">
                  {/* Profile Image Upload */}
                  <div className="flex flex-col items-center mb-8">
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="relative w-32 h-32 rounded-full border-2 border-dashed border-gold/30 flex items-center justify-center cursor-pointer hover:border-gold transition-colors overflow-hidden group"
                    >
                      {profile.image ? (
                        <img src={profile.image} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <Camera className="w-10 h-10 text-gold/50 group-hover:text-gold transition-colors" />
                      )}
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-xs text-white">Change</span>
                      </div>
                    </div>
                    <input 
                      ref={fileInputRef}
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <p className="text-sm text-gray-400 mt-3">Click to upload profile picture</p>
                  </div>

                  {/* Basic Info */}
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-gray-300 flex items-center gap-2">
                          <User className="w-4 h-4 text-gold" />
                          Full Name *
                        </Label>
                        <Input 
                          value={profile.name}
                          onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="John Doe"
                          className="bg-dark-bg border-dark-border focus:border-gold text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-300 flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-gold" />
                          Occupation
                        </Label>
                        <Input 
                          value={profile.occupation}
                          onChange={(e) => setProfile(prev => ({ ...prev, occupation: e.target.value }))}
                          placeholder="Software Engineer"
                          className="bg-dark-bg border-dark-border focus:border-gold text-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-300 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gold" />
                        Bio
                      </Label>
                      <Textarea 
                        value={profile.bio}
                        onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                        placeholder="Tell us about yourself..."
                        rows={4}
                        className="bg-dark-bg border-dark-border focus:border-gold text-white resize-none"
                      />
                    </div>

                    {/* Social Links */}
                    <div className="space-y-4">
                      <Label className="text-gray-300 flex items-center gap-2">
                        <Link2 className="w-4 h-4 text-gold" />
                        Social Links
                      </Label>
                      <div className="grid md:grid-cols-2 gap-4">
                        {socialPlatforms.map((platform) => (
                          <div key={platform.key} className="flex items-center gap-3">
                            <div 
                              className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                              style={{ backgroundColor: `${platform.color}20` }}
                            >
                              <platform.icon className="w-5 h-5" style={{ color: platform.color }} />
                            </div>
                            <Input 
                              value={profile.socials[platform.key as keyof SocialLinks]}
                              onChange={(e) => handleSocialChange(platform.key as keyof SocialLinks, e.target.value)}
                              placeholder={platform.placeholder}
                              className="bg-dark-bg border-dark-border focus:border-gold text-white text-sm"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between mt-8 pt-6 border-t border-dark-border">
                    <Button 
                      variant="ghost" 
                      onClick={resetForm}
                      className="text-gray-400 hover:text-white"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Reset
                    </Button>
                    <Button 
                      onClick={proceedToDesign}
                      className="bg-gold text-black hover:bg-gold-light"
                    >
                      Choose Design
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Design Selection */}
            {currentStep === 'design' && (
              <div className="max-w-5xl mx-auto">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {designTemplates.map((template) => (
                    <div 
                      key={template.id}
                      onClick={() => setSelectedDesign(template.id)}
                      className={`
                        relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300
                        ${selectedDesign === template.id ? 'ring-2 ring-gold scale-[1.02]' : 'hover:scale-[1.01]'}
                      `}
                    >
                      {/* Preview */}
                      <div className={`h-48 bg-gradient-to-br ${template.preview} flex items-center justify-center`}>
                        <div className="text-center p-4">
                          <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-white/10 flex items-center justify-center">
                            <User className="w-8 h-8 text-white/70" />
                          </div>
                          <div className="w-24 h-3 mx-auto bg-white/20 rounded mb-2" />
                          <div className="w-16 h-2 mx-auto bg-white/10 rounded" />
                        </div>
                      </div>
                      
                      {/* Info */}
                      <div className="p-4 bg-dark-card border border-t-0 border-dark-border">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-display font-semibold">{template.name}</h3>
                          {selectedDesign === template.id && (
                            <div className="w-6 h-6 rounded-full bg-gold flex items-center justify-center">
                              <Check className="w-4 h-4 text-black" />
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-gray-400">{template.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <Button 
                    variant="outline" 
                    onClick={() => setCurrentStep('form')}
                    className="border-dark-border text-gray-300 hover:text-white"
                  >
                    Back
                  </Button>
                  <Button 
                    onClick={proceedToPreview}
                    className="bg-gold text-black hover:bg-gold-light"
                  >
                    Generate Profile
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Preview */}
            {currentStep === 'preview' && (
              <div ref={previewRef} className="max-w-5xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Profile Card Preview */}
                  <div>
                    <h3 className="font-display text-xl font-semibold mb-4">Profile Preview</h3>
                    <div 
                      ref={profileCardRef}
                      className="rounded-2xl overflow-hidden shadow-2xl"
                      style={{ backgroundColor: getSelectedTemplate().colors.bg }}
                    >
                      {/* Card Header */}
                      <div className="relative p-8 text-center">
                        <div 
                          className="absolute inset-0 opacity-20"
                          style={{
                            background: `radial-gradient(circle at 50% 0%, ${getSelectedTemplate().colors.accent}40, transparent 70%)`
                          }}
                        />
                        
                        {/* Avatar */}
                        <div className="relative mx-auto w-24 h-24 rounded-full border-4 overflow-hidden mb-4"
                          style={{ borderColor: getSelectedTemplate().colors.accent }}
                        >
                          {profile.image ? (
                            <img src={profile.image} alt={profile.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                              <User className="w-10 h-10 text-gray-500" />
                            </div>
                          )}
                        </div>
                        
                        {/* Name & Occupation */}
                        <h2 className="relative font-display text-2xl font-bold mb-1" 
                          style={{ color: getSelectedTemplate().colors.text }}>
                          {profile.name || 'Your Name'}
                        </h2>
                        <p className="relative text-sm opacity-70" style={{ color: getSelectedTemplate().colors.text }}>
                          {profile.occupation || 'Your Occupation'}
                        </p>
                      </div>
                      
                      {/* Bio */}
                      {profile.bio && (
                        <div className="px-8 pb-4">
                          <p className="text-sm text-center opacity-80" style={{ color: getSelectedTemplate().colors.text }}>
                            {profile.bio}
                          </p>
                        </div>
                      )}
                      
                      {/* Social Links */}
                      <div className="p-6">
                        <div className="flex flex-wrap justify-center gap-3">
                          {getActiveSocials().map((social) => (
                            <a
                              key={social.platform}
                              href={social.value.startsWith('http') ? social.value : `#${social.platform}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                              style={{ backgroundColor: `${social.color}30` }}
                            >
                              <social.icon className="w-5 h-5" style={{ color: social.color }} />
                            </a>
                          ))}
                        </div>
                      </div>
                      
                      {/* QR Code Section */}
                      <div className="p-6 border-t border-white/10">
                        <div className="flex items-center justify-center gap-4">
                          <div id="profile-qr-code" className="bg-white p-3 rounded-xl">
                            <QRCodeSVG 
                              value={generateProfileUrl()}
                              size={120}
                              level="M"
                              includeMargin={false}
                            />
                          </div>
                          <div className="text-sm" style={{ color: getSelectedTemplate().colors.text }}>
                            <p className="font-semibold mb-1">Scan to Connect</p>
                            <p className="opacity-60">Point your camera at the QR code</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* QR Code Actions */}
                  <div>
                    <h3 className="font-display text-xl font-semibold mb-4">Your QR Code</h3>
                    <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
                      <div className="bg-white p-6 rounded-xl mb-6 flex items-center justify-center">
                        <QRCodeSVG 
                          value={generateProfileUrl()}
                          size={200}
                          level="M"
                          includeMargin={false}
                        />
                      </div>
                      
                      <div className="space-y-3">
                        <Button 
                          onClick={copyLink}
                          variant="outline"
                          className="w-full border-gold/50 text-gold hover:bg-gold/10"
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Copy Profile Link
                        </Button>
                        <Button 
                          onClick={downloadQR}
                          className="w-full bg-gold text-black hover:bg-gold-light"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download QR Code
                        </Button>
                        <Button 
                          onClick={downloadProfileCard}
                          variant="outline"
                          className="w-full border-gold/50 text-gold hover:bg-gold/10"
                        >
                          <Camera className="w-4 h-4 mr-2" />
                          Download Profile Card
                        </Button>
                      </div>

                      <div className="mt-6 p-4 bg-dark-bg rounded-xl">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <Globe className="w-4 h-4 text-gold" />
                          Profile URL
                        </h4>
                        <p className="text-sm text-gray-400 break-all">
                          {generateProfileUrl()}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 mt-6">
                      <Button 
                        variant="outline" 
                        onClick={() => setCurrentStep('design')}
                        className="flex-1 border-dark-border text-gray-300"
                      >
                        Back
                      </Button>
                      <Button 
                        onClick={resetForm}
                        variant="ghost"
                        className="text-gray-400 hover:text-white"
                      >
                        Create New
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gold/10 via-transparent to-gold/10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/5 rounded-full blur-3xl" />
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
            Ready to Elevate Your <span className="text-gold">Digital Presence</span>?
          </h2>
          <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who trust BraveCard for their digital identity.
          </p>
          <Button 
            size="lg"
            onClick={() => {
              resetForm()
              document.getElementById('create')?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="bg-gold text-black hover:bg-gold-light font-semibold px-8 py-6 text-lg"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Create Your Profile Now
          </Button>
          <p className="text-sm text-gray-500 mt-4">Free to start. No credit card required.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-dark-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-gold" />
              <span className="font-display text-lg font-bold">
                Brave<span className="text-gold">Card</span>
              </span>
            </div>
            <p className="text-sm text-gray-500">
              Crafting digital identities that inspire.
            </p>
            <div className="flex items-center gap-4">
              {['Twitter', 'Instagram', 'LinkedIn'].map((social) => (
                <a 
                  key={social}
                  href="#"
                  className="w-8 h-8 rounded-full bg-dark-card flex items-center justify-center text-gray-400 hover:text-gold hover:bg-gold/10 transition-colors"
                >
                  <Globe className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
          <div className="text-center mt-8 pt-8 border-t border-dark-border">
            <p className="text-sm text-gray-600">
              © 2025 BraveCard. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
