import { useState } from 'react';
import { User, Camera, Mail, Phone, MapPin, Link as LinkIcon, Edit2, Check, Github, Linkedin, Twitter, Plus, X, Globe } from 'lucide-react';

interface ProfileProps {
  requireAuth?: (cb: () => void) => void;
}

interface SocialLink {
  id: string;
  platform: string;
  url: string;
}

export function Profile({ requireAuth }: ProfileProps = {}) {
  const [isEditing, setIsEditing] = useState(false);
  const [profilePic, setProfilePic] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: 'Alex Johnson',
    role: 'Software Engineer',
    email: 'alex.johnson@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    bio: 'Passionate about building scalable AI applications and exploring the intersection of technology and design.',
  });

  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([
    { id: '1', platform: 'GitHub', url: 'github.com/alexj' },
    { id: '2', platform: 'LinkedIn', url: 'linkedin.com/in/alexj' },
    { id: '3', platform: 'Twitter', url: '@alexbuilds' }
  ]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (requireAuth) {
      requireAuth(() => processImageUpload(e));
    } else {
      processImageUpload(e);
    }
  };

  const processImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleEdit = () => {
    if (!isEditing && requireAuth) {
      requireAuth(() => setIsEditing(true));
    } else {
      setIsEditing(!isEditing);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addSocialLink = () => {
    setSocialLinks([...socialLinks, { id: Date.now().toString(), platform: 'Website', url: '' }]);
  };

  const removeSocialLink = (id: string) => {
    setSocialLinks(socialLinks.filter(link => link.id !== id));
  };

  const updateSocialLink = (id: string, field: keyof SocialLink, value: string) => {
    setSocialLinks(socialLinks.map(link => link.id === id ? { ...link, [field]: value } : link));
  };

  const getPlatformIcon = (platform: string) => {
    const p = platform.toLowerCase();
    if (p.includes('github')) return <Github size={20} />;
    if (p.includes('linkedin')) return <Linkedin size={20} />;
    if (p.includes('twitter') || p.includes('x')) return <Twitter size={20} />;
    return <Globe size={20} />;
  };

  const getPlatformColor = (platform: string) => {
    const p = platform.toLowerCase();
    if (p.includes('github')) return 'bg-foreground text-background';
    if (p.includes('linkedin')) return 'bg-[#0077b5] text-white';
    if (p.includes('twitter') || p.includes('x')) return 'bg-[#1DA1F2] text-white';
    return 'bg-primary text-primary-foreground';
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto animate-slide-up">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-foreground mb-2">Your Profile</h1>
            <p className="text-muted-foreground">Manage your personal information and social links.</p>
          </div>
          <button
            onClick={toggleEdit}
            className={`self-start sm:self-auto flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all shadow-sm ${
              isEditing 
                ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                : 'bg-muted/50 border border-border text-foreground hover:bg-muted'
            }`}
          >
            {isEditing ? (
              <><Check size={18} /> Save Profile</>
            ) : (
              <><Edit2 size={18} /> Edit Profile</>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column: Avatar & Basic Info */}
          <div className="md:col-span-1 space-y-6">
            <div className="glass-card rounded-3xl p-6 text-center">
              <div className="relative w-32 h-32 mx-auto mb-4 group rounded-full">
                <div className="w-full h-full rounded-full overflow-hidden border-4 border-muted/50 bg-muted flex items-center justify-center">
                  {profilePic ? (
                    <img src={profilePic} alt="Profile" className="w-full h-full object-cover rounded-full" />
                  ) : (
                    <User size={48} className="text-muted-foreground" />
                  )}
                </div>
                {isEditing && (
                  <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera size={24} className="text-white" />
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                  </label>
                )}
              </div>
              
              {isEditing ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-center rounded-lg glass text-foreground font-bold text-xl outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <input
                    type="text"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-center rounded-lg glass text-muted-foreground text-sm outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-foreground">{formData.name}</h2>
                  <p className="text-primary font-medium text-sm">{formData.role}</p>
                </>
              )}
            </div>

            {/* Contact Info Card */}
            <div className="glass-card rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Contact</h3>
              
              <div className="flex items-start gap-3">
                <Mail size={18} className="text-muted-foreground mt-0.5" />
                {isEditing ? (
                  <input type="email" name="email" value={formData.email} onChange={handleChange} className="flex-1 w-full bg-transparent border-b border-border text-sm text-foreground focus:border-primary outline-none pb-1" />
                ) : (
                  <span className="text-sm text-foreground">{formData.email}</span>
                )}
              </div>
              
              <div className="flex items-start gap-3">
                <Phone size={18} className="text-muted-foreground mt-0.5" />
                {isEditing ? (
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="flex-1 w-full bg-transparent border-b border-border text-sm text-foreground focus:border-primary outline-none pb-1" />
                ) : (
                  <span className="text-sm text-foreground">{formData.phone}</span>
                )}
              </div>

              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-muted-foreground mt-0.5" />
                {isEditing ? (
                  <input type="text" name="location" value={formData.location} onChange={handleChange} className="flex-1 w-full bg-transparent border-b border-border text-sm text-foreground focus:border-primary outline-none pb-1" />
                ) : (
                  <span className="text-sm text-foreground">{formData.location}</span>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Bio & Social Links */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Bio Card */}
            <div className="glass-card rounded-3xl p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">About Me</h3>
              {isEditing ? (
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={4}
                  className="w-full p-4 rounded-xl glass text-foreground text-sm leading-relaxed outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                />
              ) : (
                <p className="text-muted-foreground text-sm leading-relaxed">{formData.bio}</p>
              )}
            </div>

            {/* Social Links Card */}
            <div className="glass-card rounded-3xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <LinkIcon size={18} className="text-primary" />
                  Social Profiles
                </h3>
                {isEditing && (
                  <button
                    onClick={addSocialLink}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors"
                  >
                    <Plus size={14} /> Add Link
                  </button>
                )}
              </div>
              
              <div className="space-y-4">
                {socialLinks.map((link) => (
                  <div key={link.id} className="flex items-center gap-4 p-3 rounded-xl bg-muted/30 border border-border">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${getPlatformColor(link.platform)}`}>
                      {getPlatformIcon(link.platform)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      {isEditing ? (
                        <div className="flex flex-col sm:flex-row gap-2">
                          <input 
                            type="text" 
                            placeholder="Platform (e.g. GitHub)"
                            value={link.platform} 
                            onChange={(e) => updateSocialLink(link.id, 'platform', e.target.value)} 
                            className="bg-background border border-border rounded-md px-2 py-1 text-xs text-foreground focus:border-primary outline-none w-full sm:w-1/3" 
                          />
                          <input 
                            type="text" 
                            placeholder="URL"
                            value={link.url} 
                            onChange={(e) => updateSocialLink(link.id, 'url', e.target.value)} 
                            className="bg-background border border-border rounded-md px-2 py-1 text-xs text-foreground focus:border-primary outline-none w-full flex-1" 
                          />
                        </div>
                      ) : (
                        <>
                          <div className="text-xs text-muted-foreground font-medium mb-1">{link.platform || 'Website'}</div>
                          <div className="text-sm font-medium text-foreground truncate">{link.url || 'Not set'}</div>
                        </>
                      )}
                    </div>

                    {isEditing && (
                      <button 
                        onClick={() => removeSocialLink(link.id)}
                        className="p-2 text-muted-foreground hover:text-rose-400 hover:bg-rose-400/10 rounded-lg transition-colors flex-shrink-0"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                ))}

                {socialLinks.length === 0 && !isEditing && (
                  <div className="text-center py-6 text-sm text-muted-foreground border border-dashed border-border rounded-xl">
                    No social profiles added yet.
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
