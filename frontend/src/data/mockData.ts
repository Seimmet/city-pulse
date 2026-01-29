// Mock data for the platform

export const cities = [
  { id: "1", name: "New York", country: "USA", subscribers: 45200, publishers: 3, editions: 156, image: "/placeholder.svg" },
  { id: "2", name: "London", country: "UK", subscribers: 38500, publishers: 2, editions: 132, image: "/placeholder.svg" },
  { id: "3", name: "Paris", country: "France", subscribers: 29800, publishers: 2, editions: 98, image: "/placeholder.svg" },
  { id: "4", name: "Tokyo", country: "Japan", subscribers: 52100, publishers: 4, editions: 201, image: "/placeholder.svg" },
  { id: "5", name: "Dubai", country: "UAE", subscribers: 18900, publishers: 1, editions: 67, image: "/placeholder.svg" },
  { id: "6", name: "Sydney", country: "Australia", subscribers: 21400, publishers: 2, editions: 89, image: "/placeholder.svg" },
  { id: "7", name: "Berlin", country: "Germany", subscribers: 24700, publishers: 2, editions: 112, image: "/placeholder.svg" },
  { id: "8", name: "Singapore", country: "Singapore", subscribers: 31200, publishers: 2, editions: 145, image: "/placeholder.svg" },
];

export const editions = [
  { id: "1", title: "Summer in the City", city: "New York", date: "2024-06", cover: "/placeholder.svg", pages: 48, status: "published" },
  { id: "2", title: "Art & Culture Guide", city: "London", date: "2024-06", cover: "/placeholder.svg", pages: 64, status: "published" },
  { id: "3", title: "Gastronomic Delights", city: "Paris", date: "2024-06", cover: "/placeholder.svg", pages: 52, status: "published" },
  { id: "4", title: "Tech & Innovation", city: "Tokyo", date: "2024-06", cover: "/placeholder.svg", pages: 72, status: "draft" },
  { id: "5", title: "Desert Festivals", city: "Dubai", date: "2024-05", cover: "/placeholder.svg", pages: 44, status: "published" },
];

export const articles = [
  { id: "1", title: "The Rise of Rooftop Venues", author: "Sarah Mitchell", city: "New York", category: "Venues", status: "published", date: "2024-06-15" },
  { id: "2", title: "Hidden Speakeasies Guide", author: "James Walker", city: "London", category: "Nightlife", status: "published", date: "2024-06-12" },
  { id: "3", title: "Street Food Revolution", author: "Marie Dupont", city: "Paris", category: "Food", status: "draft", date: "2024-06-10" },
  { id: "4", title: "Underground Music Scene", author: "Kenji Yamamoto", city: "Tokyo", category: "Music", status: "review", date: "2024-06-08" },
];

export const publishers = [
  { id: "1", name: "Manhattan Media Co", city: "New York", email: "contact@manhattanmedia.com", license: "active", subscriptions: 12500, revenue: 156000 },
  { id: "2", name: "London Life Publishing", city: "London", email: "hello@londonlife.co.uk", license: "active", subscriptions: 9800, revenue: 122500 },
  { id: "3", name: "Paris Edition House", city: "Paris", email: "info@parisedition.fr", license: "active", subscriptions: 7200, revenue: 90000 },
  { id: "4", name: "Tokyo Nights Inc", city: "Tokyo", email: "press@tokyonights.jp", license: "pending", subscriptions: 15400, revenue: 192500 },
];

export const contributors = [
  { id: "1", name: "Sarah Mitchell", role: "Senior Writer", articles: 45, city: "New York", avatar: "/placeholder.svg" },
  { id: "2", name: "James Walker", role: "Editor", articles: 32, city: "London", avatar: "/placeholder.svg" },
  { id: "3", name: "Marie Dupont", role: "Food Critic", articles: 28, city: "Paris", avatar: "/placeholder.svg" },
  { id: "4", name: "Kenji Yamamoto", role: "Photographer", articles: 56, city: "Tokyo", avatar: "/placeholder.svg" },
];

export const advertisements = [
  { id: "1", advertiser: "Luxury Hotels Group", campaign: "Summer Getaways", placement: "Full Page", impressions: 125000, clicks: 3400, status: "active" },
  { id: "2", advertiser: "City Tours Co", campaign: "Walking Tours", placement: "Half Page", impressions: 89000, clicks: 2100, status: "active" },
  { id: "3", advertiser: "Fine Dining Alliance", campaign: "Restaurant Week", placement: "Banner", impressions: 210000, clicks: 5600, status: "scheduled" },
];

export const testimonials = [
  { id: "1", name: "Alexandra Chen", role: "NYC Subscriber", quote: "CityPulse has completely changed how I discover events in my city. The quality is unmatched.", avatar: "/placeholder.svg" },
  { id: "2", name: "Marcus Thompson", role: "London Publisher", quote: "As a publisher, this platform gives us the tools to create beautiful digital magazines effortlessly.", avatar: "/placeholder.svg" },
  { id: "3", name: "Sophie Laurent", role: "Paris Reader", quote: "The flipbook experience is gorgeous. It's like holding a premium magazine, but better.", avatar: "/placeholder.svg" },
];

export const stats = {
  totalCities: 45,
  totalSubscribers: 285000,
  totalPublishers: 89,
  totalEditions: 1245,
  monthlyRevenue: 2340000,
  activeUsers: 156000,
};

export const recentActivity = [
  { id: "1", action: "New edition published", details: "Summer in the City - New York", time: "2 hours ago", type: "edition" },
  { id: "2", action: "New publisher registered", details: "Berlin Nights Publishing", time: "5 hours ago", type: "publisher" },
  { id: "3", action: "Subscription milestone", details: "Tokyo reached 50,000 subscribers", time: "1 day ago", type: "milestone" },
  { id: "4", action: "New city launched", details: "Melbourne now available", time: "2 days ago", type: "city" },
];

export const subscriptionPlans = [
  { id: "1", name: "Explorer", price: 0, features: ["Browse city listings", "Read free articles", "Limited flipbook preview"], popular: false },
  { id: "2", name: "City Pass", price: 9.99, features: ["Full access to one city", "Unlimited flipbook reading", "Offline downloads", "Early access to editions"], popular: true },
  { id: "3", name: "Global Pass", price: 19.99, features: ["Access to all cities", "Everything in City Pass", "Exclusive events access", "Ad-free experience"], popular: false },
];

export const publisherPlans = [
  { id: "1", name: "Starter", price: 299, features: ["1 city license", "Up to 12 editions/year", "Basic analytics", "Email support"], popular: false },
  { id: "2", name: "Professional", price: 599, features: ["1 city license", "Unlimited editions", "Advanced analytics", "Priority support", "Custom branding"], popular: true },
  { id: "3", name: "Enterprise", price: 1299, features: ["Multi-city license", "Unlimited editions", "Full analytics suite", "Dedicated account manager", "API access"], popular: false },
];
