// Forum data management using localStorage

export interface ForumPost {
  id: string
  title: string
  content: string
  authorName: string
  authorAvatar?: string
  courseTitle: string
  courseId: string
  createdAt: string
  replies: number
  likes: number
  views: number
  isPinned: boolean
  isResolved: boolean
  tags: string[]
  likedBy: string[] // User IDs who liked this post
}

export interface ForumReply {
  id: string
  topicId: string
  content: string
  authorName: string
  authorAvatar?: string
  createdAt: string
  likes: number
  isSolution: boolean
  likedBy: string[] // User IDs who liked this reply
}

const FORUM_POSTS_KEY = "forum_posts"
const FORUM_REPLIES_KEY = "forum_replies"
const CURRENT_USER_KEY = "current_user"

// Initialize with mock data if empty
const initializeMockData = () => {
  const existingPosts = localStorage.getItem(FORUM_POSTS_KEY)
  if (!existingPosts) {
    const mockPosts: ForumPost[] = [
      {
        id: "1",
        title: "¿Cuál es la mejor técnica para preparación de conductos?",
        content:
          "Estoy estudiando diferentes técnicas de preparación de conductos radiculares y me gustaría conocer sus experiencias con las técnicas rotatorias vs manuales. ¿Cuál recomiendan para principiantes?",
        authorName: "María González",
        courseTitle: "Técnicas de Endodoncia",
        courseId: "2",
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        replies: 3,
        likes: 24,
        views: 156,
        isPinned: true,
        isResolved: false,
        tags: ["endodoncia", "técnicas", "conductos"],
        likedBy: [],
      },
      {
        id: "2",
        title: "Duda sobre anatomía del primer molar superior",
        content:
          "Tengo una pregunta sobre la anatomía radicular del primer molar superior. ¿Alguien puede ayudarme con la cantidad de conductos que normalmente tiene?",
        authorName: "Carlos Ruiz",
        courseTitle: "Anatomía Dental Avanzada",
        courseId: "1",
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        replies: 2,
        likes: 15,
        views: 89,
        isPinned: false,
        isResolved: true,
        tags: ["anatomía", "molares"],
        likedBy: [],
      },
      {
        id: "3",
        title: "Recomendaciones de materiales para prostodoncia digital",
        content:
          "¿Qué materiales recomiendan para trabajar con prostodoncia digital? Estoy empezando en este campo y necesito orientación sobre qué resinas y cerámicas son mejores.",
        authorName: "Ana López",
        courseTitle: "Prostodoncia Digital",
        courseId: "3",
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        replies: 5,
        likes: 35,
        views: 234,
        isPinned: false,
        isResolved: false,
        tags: ["prostodoncia", "materiales", "digital"],
        likedBy: [],
      },
    ]
    localStorage.setItem(FORUM_POSTS_KEY, JSON.stringify(mockPosts))

    const mockReplies: ForumReply[] = [
      {
        id: "r1",
        topicId: "1",
        content:
          "Para principiantes, recomiendo empezar con técnicas manuales para desarrollar la sensibilidad táctil. Una vez domines eso, puedes pasar a rotatorias.",
        authorName: "Dr. Pedro Martínez",
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        likes: 12,
        isSolution: false,
        likedBy: [],
      },
      {
        id: "r2",
        topicId: "1",
        content:
          "Yo uso el sistema ProTaper y me ha dado excelentes resultados. Es importante seguir la secuencia correcta y no forzar los instrumentos.",
        authorName: "Dra. Laura Sánchez",
        createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        likes: 8,
        isSolution: false,
        likedBy: [],
      },
      {
        id: "r3",
        topicId: "1",
        content:
          "Complementando lo que dijeron, es fundamental la irrigación constante con hipoclorito de sodio. No olvides ese paso.",
        authorName: "Juan Pérez",
        createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        likes: 5,
        isSolution: false,
        likedBy: [],
      },
      {
        id: "r4",
        topicId: "2",
        content:
          "El primer molar superior generalmente tiene 3 raíces: mesiovestibular, distovestibular y palatina. La raíz MV puede tener 2 conductos (MB1 y MB2).",
        authorName: "Dra. Carmen Rodríguez",
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        likes: 18,
        isSolution: true,
        likedBy: [],
      },
      {
        id: "r5",
        topicId: "2",
        content:
          "Exacto, y el MB2 está presente en aproximadamente 60-70% de los casos. Usa magnificación para localizarlo.",
        authorName: "Dr. Miguel Torres",
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        likes: 10,
        isSolution: false,
        likedBy: [],
      },
      {
        id: "r6",
        topicId: "3",
        content:
          "Para prostodoncia digital, te recomiendo las resinas de PMMA para provisionales y las cerámicas de disilicato de litio para definitivas.",
        authorName: "Dra. Isabel Morales",
        createdAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
        likes: 15,
        isSolution: false,
        likedBy: [],
      },
      {
        id: "r7",
        topicId: "3",
        content:
          "IPS e.max es excelente para casos estéticos. También considera las resinas compuestas fresadas para casos más económicos.",
        authorName: "Dr. Roberto Díaz",
        createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
        likes: 12,
        isSolution: false,
        likedBy: [],
      },
    ]
    localStorage.setItem(FORUM_REPLIES_KEY, JSON.stringify(mockReplies))
  }
}

// Get current user (mock)
export const getCurrentUser = (): string => {
  let user = localStorage.getItem(CURRENT_USER_KEY)
  if (!user) {
    user = "Juan Pérez" // Default user
    localStorage.setItem(CURRENT_USER_KEY, user)
  }
  return user
}

// Forum Posts
export const getAllPosts = (): ForumPost[] => {
  initializeMockData()
  const posts = localStorage.getItem(FORUM_POSTS_KEY)
  return posts ? JSON.parse(posts) : []
}

export const getPostById = (id: string): ForumPost | null => {
  const posts = getAllPosts()
  const post = posts.find((p) => p.id === id)
  if (post) {
    // Increment views
    post.views++
    savePosts(posts)
  }
  return post || null
}

export const createPost = (
  post: Omit<ForumPost, "id" | "createdAt" | "replies" | "likes" | "views" | "likedBy">,
): ForumPost => {
  const posts = getAllPosts()
  const newPost: ForumPost = {
    ...post,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    replies: 0,
    likes: 0,
    views: 0,
    likedBy: [],
  }
  posts.unshift(newPost) // Add to beginning
  savePosts(posts)
  return newPost
}

export const toggleLikePost = (postId: string, userId: string): void => {
  const posts = getAllPosts()
  const post = posts.find((p) => p.id === postId)
  if (post) {
    const likedIndex = post.likedBy.indexOf(userId)
    if (likedIndex > -1) {
      post.likedBy.splice(likedIndex, 1)
      post.likes--
    } else {
      post.likedBy.push(userId)
      post.likes++
    }
    savePosts(posts)
  }
}

export const toggleResolvePost = (postId: string): void => {
  const posts = getAllPosts()
  const post = posts.find((p) => p.id === postId)
  if (post) {
    post.isResolved = !post.isResolved
    savePosts(posts)
  }
}

const savePosts = (posts: ForumPost[]): void => {
  localStorage.setItem(FORUM_POSTS_KEY, JSON.stringify(posts))
}

// Forum Replies
export const getRepliesByTopicId = (topicId: string): ForumReply[] => {
  initializeMockData()
  const replies = localStorage.getItem(FORUM_REPLIES_KEY)
  const allReplies: ForumReply[] = replies ? JSON.parse(replies) : []
  return allReplies.filter((r) => r.topicId === topicId)
}

export const createReply = (reply: Omit<ForumReply, "id" | "createdAt" | "likes" | "likedBy">): ForumReply => {
  const replies = localStorage.getItem(FORUM_REPLIES_KEY)
  const allReplies: ForumReply[] = replies ? JSON.parse(replies) : []

  const newReply: ForumReply = {
    ...reply,
    id: `r${Date.now()}`,
    createdAt: new Date().toISOString(),
    likes: 0,
    likedBy: [],
  }

  allReplies.push(newReply)
  localStorage.setItem(FORUM_REPLIES_KEY, JSON.stringify(allReplies))

  // Update reply count in post
  const posts = getAllPosts()
  const post = posts.find((p) => p.id === reply.topicId)
  if (post) {
    post.replies++
    savePosts(posts)
  }

  return newReply
}

export const toggleLikeReply = (replyId: string, userId: string): void => {
  const replies = localStorage.getItem(FORUM_REPLIES_KEY)
  const allReplies: ForumReply[] = replies ? JSON.parse(replies) : []

  const reply = allReplies.find((r) => r.id === replyId)
  if (reply) {
    const likedIndex = reply.likedBy.indexOf(userId)
    if (likedIndex > -1) {
      reply.likedBy.splice(likedIndex, 1)
      reply.likes--
    } else {
      reply.likedBy.push(userId)
      reply.likes++
    }
    localStorage.setItem(FORUM_REPLIES_KEY, JSON.stringify(allReplies))
  }
}

export const markReplyAsSolution = (replyId: string, topicId: string): void => {
  const replies = localStorage.getItem(FORUM_REPLIES_KEY)
  const allReplies: ForumReply[] = replies ? JSON.parse(replies) : []

  // Remove solution mark from all replies in this topic
  allReplies.forEach((r) => {
    if (r.topicId === topicId) {
      r.isSolution = r.id === replyId
    }
  })

  localStorage.setItem(FORUM_REPLIES_KEY, JSON.stringify(allReplies))

  // Mark post as resolved
  const posts = getAllPosts()
  const post = posts.find((p) => p.id === topicId)
  if (post) {
    post.isResolved = true
    savePosts(posts)
  }
}
