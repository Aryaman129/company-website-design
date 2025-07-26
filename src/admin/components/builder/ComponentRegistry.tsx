"use client"

import React from 'react'
import { ComponentData } from '../../contexts/WebsiteBuilderContext'

// Component type definitions
export interface ComponentDefinition {
  id: string
  name: string
  category: 'layout' | 'content' | 'media' | 'form' | 'navigation'
  icon: React.ComponentType<{ size?: number }>
  description: string
  defaultProps: Record<string, any>
  editableProps: Array<{
    key: string
    label: string
    type: 'text' | 'textarea' | 'number' | 'color' | 'select' | 'boolean' | 'image' | 'url'
    options?: string[]
    placeholder?: string
  }>
  previewComponent: React.ComponentType<any>
  renderComponent: React.ComponentType<any>
  allowChildren?: boolean
  maxChildren?: number
  allowedParents?: string[]
}

// Import icons
import {
  Type,
  Image,
  Video,
  Layout,
  Grid,
  Button as ButtonIcon,
  Star,
  Quote,
  Mail,
  Phone,
  MapPin,
  Users,
  Award,
  Calendar,
  ArrowRight,
  Play,
  Download,
  ExternalLink,
  Package
} from 'lucide-react'

// Basic components
const TextComponent: React.FC<any> = ({ content = 'Sample Text', tag = 'p', className = '', style = {} }) => {
  const Tag = tag as keyof JSX.IntrinsicElements
  return <Tag className={className} style={style}>{content}</Tag>
}

const HeadingComponent: React.FC<any> = ({ content = 'Heading', level = 'h2', className = '', style = {} }) => {
  const Tag = level as keyof JSX.IntrinsicElements
  return <Tag className={className} style={style}>{content}</Tag>
}

const ImageComponent: React.FC<any> = ({ src = '/placeholder.svg', alt = 'Image', className = '', style = {} }) => {
  return <img src={src} alt={alt} className={className} style={style} />
}

const ButtonComponent: React.FC<any> = ({ 
  text = 'Button', 
  variant = 'primary', 
  size = 'md', 
  href = '#',
  className = '',
  style = {} 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-300'
  const variantClasses = {
    primary: 'bg-gold text-white hover:bg-gold-dark',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    outline: 'border-2 border-gold text-gold hover:bg-gold hover:text-white'
  }
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  }
  
  return (
    <a 
      href={href}
      className={`${baseClasses} ${variantClasses[variant as keyof typeof variantClasses]} ${sizeClasses[size as keyof typeof sizeClasses]} ${className}`}
      style={style}
    >
      {text}
    </a>
  )
}

const VideoComponent: React.FC<any> = ({ 
  src = '', 
  poster = '/placeholder.svg', 
  autoplay = false,
  controls = true,
  className = '',
  style = {} 
}) => {
  return (
    <video 
      src={src} 
      poster={poster} 
      autoPlay={autoplay} 
      controls={controls}
      className={className}
      style={style}
    />
  )
}

const ContainerComponent: React.FC<any> = ({ children, className = 'container mx-auto px-4', style = {} }) => {
  return <div className={className} style={style}>{children}</div>
}

const GridComponent: React.FC<any> = ({ 
  children, 
  columns = 3, 
  gap = 'md',
  className = '',
  style = {} 
}) => {
  const gapClasses = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8'
  }
  
  return (
    <div 
      className={`grid grid-cols-${columns} ${gapClasses[gap as keyof typeof gapClasses]} ${className}`}
      style={style}
    >
      {children}
    </div>
  )
}

const TestimonialComponent: React.FC<any> = ({
  quote = 'This is a sample testimonial quote.',
  author = 'John Doe',
  company = 'Company Name',
  avatar = '/placeholder-user.jpg',
  rating = 5,
  className = '',
  style = {}
}) => {
  return (
    <div className={`bg-white p-6 rounded-lg shadow-lg ${className}`} style={style}>
      <div className="flex items-center mb-4">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            size={16} 
            className={i < rating ? 'text-gold fill-current' : 'text-gray-300'} 
          />
        ))}
      </div>
      <blockquote className="text-gray-600 mb-4">"{quote}"</blockquote>
      <div className="flex items-center">
        <img src={avatar} alt={author} className="w-12 h-12 rounded-full mr-4" />
        <div>
          <div className="font-semibold">{author}</div>
          <div className="text-sm text-gray-500">{company}</div>
        </div>
      </div>
    </div>
  )
}

const ContactInfoComponent: React.FC<any> = ({
  type = 'phone',
  value = '+1 234 567 8900',
  label = 'Phone',
  className = '',
  style = {}
}) => {
  const icons = {
    phone: Phone,
    email: Mail,
    address: MapPin
  }
  
  const Icon = icons[type as keyof typeof icons] || Phone
  
  return (
    <div className={`flex items-center space-x-3 ${className}`} style={style}>
      <Icon size={20} className="text-gold" />
      <div>
        <div className="text-sm text-gray-500">{label}</div>
        <div className="font-medium">{value}</div>
      </div>
    </div>
  )
}

// Component registry
export const componentRegistry: Record<string, ComponentDefinition> = {
  text: {
    id: 'text',
    name: 'Text',
    category: 'content',
    icon: Type,
    description: 'Basic text element',
    defaultProps: {
      content: 'Sample text content',
      tag: 'p',
      className: 'text-gray-700'
    },
    editableProps: [
      { key: 'content', label: 'Content', type: 'textarea', placeholder: 'Enter text content' },
      { key: 'tag', label: 'HTML Tag', type: 'select', options: ['p', 'span', 'div'] },
      { key: 'className', label: 'CSS Classes', type: 'text', placeholder: 'text-gray-700' }
    ],
    previewComponent: TextComponent,
    renderComponent: TextComponent
  },
  
  heading: {
    id: 'heading',
    name: 'Heading',
    category: 'content',
    icon: Type,
    description: 'Heading element (H1-H6)',
    defaultProps: {
      content: 'Sample Heading',
      level: 'h2',
      className: 'text-2xl font-bold text-gray-900'
    },
    editableProps: [
      { key: 'content', label: 'Heading Text', type: 'text', placeholder: 'Enter heading' },
      { key: 'level', label: 'Heading Level', type: 'select', options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] },
      { key: 'className', label: 'CSS Classes', type: 'text', placeholder: 'text-2xl font-bold' }
    ],
    previewComponent: HeadingComponent,
    renderComponent: HeadingComponent
  },
  
  image: {
    id: 'image',
    name: 'Image',
    category: 'media',
    icon: Image,
    description: 'Image element',
    defaultProps: {
      src: '/placeholder.svg',
      alt: 'Image description',
      className: 'w-full h-auto'
    },
    editableProps: [
      { key: 'src', label: 'Image URL', type: 'image', placeholder: 'Select or upload image' },
      { key: 'alt', label: 'Alt Text', type: 'text', placeholder: 'Describe the image' },
      { key: 'className', label: 'CSS Classes', type: 'text', placeholder: 'w-full h-auto' }
    ],
    previewComponent: ImageComponent,
    renderComponent: ImageComponent
  },
  
  button: {
    id: 'button',
    name: 'Button',
    category: 'content',
    icon: ButtonIcon,
    description: 'Interactive button element',
    defaultProps: {
      text: 'Click Me',
      variant: 'primary',
      size: 'md',
      href: '#'
    },
    editableProps: [
      { key: 'text', label: 'Button Text', type: 'text', placeholder: 'Enter button text' },
      { key: 'variant', label: 'Style', type: 'select', options: ['primary', 'secondary', 'outline'] },
      { key: 'size', label: 'Size', type: 'select', options: ['sm', 'md', 'lg'] },
      { key: 'href', label: 'Link URL', type: 'url', placeholder: 'https://example.com' }
    ],
    previewComponent: ButtonComponent,
    renderComponent: ButtonComponent
  },
  
  video: {
    id: 'video',
    name: 'Video',
    category: 'media',
    icon: Video,
    description: 'Video player element',
    defaultProps: {
      src: '',
      poster: '/placeholder.svg',
      autoplay: false,
      controls: true,
      className: 'w-full'
    },
    editableProps: [
      { key: 'src', label: 'Video URL', type: 'url', placeholder: 'Enter video URL' },
      { key: 'poster', label: 'Poster Image', type: 'image', placeholder: 'Select poster image' },
      { key: 'autoplay', label: 'Autoplay', type: 'boolean' },
      { key: 'controls', label: 'Show Controls', type: 'boolean' }
    ],
    previewComponent: VideoComponent,
    renderComponent: VideoComponent
  },
  
  container: {
    id: 'container',
    name: 'Container',
    category: 'layout',
    icon: Layout,
    description: 'Container for other elements',
    defaultProps: {
      className: 'container mx-auto px-4'
    },
    editableProps: [
      { key: 'className', label: 'CSS Classes', type: 'text', placeholder: 'container mx-auto px-4' }
    ],
    previewComponent: ContainerComponent,
    renderComponent: ContainerComponent,
    allowChildren: true
  },
  
  grid: {
    id: 'grid',
    name: 'Grid',
    category: 'layout',
    icon: Grid,
    description: 'Grid layout container',
    defaultProps: {
      columns: 3,
      gap: 'md'
    },
    editableProps: [
      { key: 'columns', label: 'Columns', type: 'number', placeholder: '3' },
      { key: 'gap', label: 'Gap Size', type: 'select', options: ['sm', 'md', 'lg', 'xl'] }
    ],
    previewComponent: GridComponent,
    renderComponent: GridComponent,
    allowChildren: true,
    maxChildren: 12
  },
  
  testimonial: {
    id: 'testimonial',
    name: 'Testimonial',
    category: 'content',
    icon: Quote,
    description: 'Customer testimonial card',
    defaultProps: {
      quote: 'This is a sample testimonial quote.',
      author: 'John Doe',
      company: 'Company Name',
      avatar: '/placeholder-user.jpg',
      rating: 5
    },
    editableProps: [
      { key: 'quote', label: 'Quote', type: 'textarea', placeholder: 'Enter testimonial quote' },
      { key: 'author', label: 'Author Name', type: 'text', placeholder: 'Enter author name' },
      { key: 'company', label: 'Company', type: 'text', placeholder: 'Enter company name' },
      { key: 'avatar', label: 'Avatar Image', type: 'image', placeholder: 'Select avatar image' },
      { key: 'rating', label: 'Rating', type: 'number', placeholder: '5' }
    ],
    previewComponent: TestimonialComponent,
    renderComponent: TestimonialComponent
  },
  
  contactInfo: {
    id: 'contactInfo',
    name: 'Contact Info',
    category: 'content',
    icon: Phone,
    description: 'Contact information display',
    defaultProps: {
      type: 'phone',
      value: '+1 234 567 8900',
      label: 'Phone'
    },
    editableProps: [
      { key: 'type', label: 'Type', type: 'select', options: ['phone', 'email', 'address'] },
      { key: 'value', label: 'Value', type: 'text', placeholder: 'Enter contact value' },
      { key: 'label', label: 'Label', type: 'text', placeholder: 'Enter label' }
    ],
    previewComponent: ContactInfoComponent,
    renderComponent: ContactInfoComponent
  },

  // Hero Section Component
  heroSection: {
    id: 'heroSection',
    name: 'Hero Section',
    category: 'layout',
    icon: Layout,
    description: 'Full-width hero section with background',
    defaultProps: {
      backgroundImage: 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=1920&h=1080&fit=crop&crop=center',
      backgroundColor: '#2D2D2D',
      height: '600px',
      className: 'relative flex items-center justify-center text-white'
    },
    editableProps: [
      { key: 'backgroundImage', label: 'Background Image', type: 'image', placeholder: 'Select background image' },
      { key: 'backgroundColor', label: 'Background Color', type: 'color' },
      { key: 'height', label: 'Height', type: 'text', placeholder: '600px' }
    ],
    previewComponent: ({ backgroundImage, backgroundColor, height, children, className, style }) => (
      <div
        className={className}
        style={{
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
          backgroundColor,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height,
          ...style
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          {children}
        </div>
      </div>
    ),
    renderComponent: ({ backgroundImage, backgroundColor, height, children, className, style }) => (
      <div
        className={className}
        style={{
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
          backgroundColor,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height,
          ...style
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          {children}
        </div>
      </div>
    ),
    allowChildren: true
  },

  // Product Card Component
  productCard: {
    id: 'productCard',
    name: 'Product Card',
    category: 'content',
    icon: Package,
    description: 'Product showcase card with image and details',
    defaultProps: {
      image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop&crop=center',
      title: 'MS Steel Pipes',
      description: 'High-quality mild steel pipes for industrial applications',
      price: '₹65/kg',
      features: ['IS 1239 Standard', 'Galvanized Coating', 'Multiple Sizes'],
      className: 'bg-white rounded-lg shadow-lg overflow-hidden'
    },
    editableProps: [
      { key: 'image', label: 'Product Image', type: 'image', placeholder: 'Select product image' },
      { key: 'title', label: 'Product Title', type: 'text', placeholder: 'Enter product title' },
      { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Enter product description' },
      { key: 'price', label: 'Price', type: 'text', placeholder: 'Enter price' }
    ],
    previewComponent: ({ image, title, description, price, features, className, style }) => (
      <div className={className} style={style}>
        <img src={image} alt={title} className="w-full h-48 object-cover" />
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-2">{title}</h3>
          <p className="text-gray-600 mb-4">{description}</p>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-gold">{price}</span>
            <button className="bg-gold text-white px-4 py-2 rounded-md hover:bg-gold-dark transition-colors">
              View Details
            </button>
          </div>
        </div>
      </div>
    ),
    renderComponent: ({ image, title, description, price, features, className, style }) => (
      <div className={className} style={style}>
        <img src={image} alt={title} className="w-full h-48 object-cover" />
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-2">{title}</h3>
          <p className="text-gray-600 mb-4">{description}</p>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-gold">{price}</span>
            <button className="bg-gold text-white px-4 py-2 rounded-md hover:bg-gold-dark transition-colors">
              View Details
            </button>
          </div>
        </div>
      </div>
    )
  },

  // Statistics Component
  statsCard: {
    id: 'statsCard',
    name: 'Statistics Card',
    category: 'content',
    icon: Award,
    description: 'Display key statistics and achievements',
    defaultProps: {
      number: '35+',
      label: 'Years Experience',
      icon: 'calendar',
      className: 'text-center p-6 bg-white rounded-lg shadow-lg'
    },
    editableProps: [
      { key: 'number', label: 'Number', type: 'text', placeholder: 'Enter number' },
      { key: 'label', label: 'Label', type: 'text', placeholder: 'Enter label' },
      { key: 'icon', label: 'Icon', type: 'select', options: ['calendar', 'award', 'users', 'star'] }
    ],
    previewComponent: ({ number, label, icon, className, style }) => {
      const icons = {
        calendar: Calendar,
        award: Award,
        users: Users,
        star: Star
      }
      const Icon = icons[icon as keyof typeof icons] || Calendar

      return (
        <div className={className} style={style}>
          <Icon size={48} className="text-gold mx-auto mb-4" />
          <div className="text-3xl font-bold text-gray-900 mb-2">{number}</div>
          <div className="text-gray-600">{label}</div>
        </div>
      )
    },
    renderComponent: ({ number, label, icon, className, style }) => {
      const icons = {
        calendar: Calendar,
        award: Award,
        users: Users,
        star: Star
      }
      const Icon = icons[icon as keyof typeof icons] || Calendar

      return (
        <div className={className} style={style}>
          <Icon size={48} className="text-gold mx-auto mb-4" />
          <div className="text-3xl font-bold text-gray-900 mb-2">{number}</div>
          <div className="text-gray-600">{label}</div>
        </div>
      )
    }
  }
}

// Helper functions
export const getComponentsByCategory = (category: ComponentDefinition['category']) => {
  return Object.values(componentRegistry).filter(comp => comp.category === category)
}

export const getComponentDefinition = (id: string): ComponentDefinition | undefined => {
  return componentRegistry[id]
}

export const createComponentData = (definitionId: string, overrides: Partial<ComponentData> = {}): ComponentData => {
  const definition = getComponentDefinition(definitionId)
  if (!definition) {
    throw new Error(`Component definition not found: ${definitionId}`)
  }
  
  return {
    id: `${definitionId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type: definitionId,
    props: { ...definition.defaultProps },
    children: [],
    styles: {},
    ...overrides
  }
}
