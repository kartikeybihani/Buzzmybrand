type Video = {
    id: 1 | 2 | 3 | 4
    link: string
    postedOn?: string   // ISO date or ''
    views?: number      // today’s views if known
    status: 'script' | 'approve' | 'posted'
}
  
type Influencer = {
    id: string          // uuid
    username: string
    profileLink: string
    platform: 'Instagram' | 'TikTok' | 'Both'
    viewsMedian: number
    viewsTotal: number  // auto = viewsMedian * 5
    viewsNow: number
    videos: Video[] // 4 videos per campaign
    postedOn: string // ISO date or ''
    paid: boolean       // nice-to-have toggle
}
  

// Campaign totals = derived selectors that sum viewsTotal, viewsNow, etc.