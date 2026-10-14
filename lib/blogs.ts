export interface BlogPost {
  id: string | number;
  title: string;
  slug: string;
  content?: string;
  description?: string;
  meta_description?: string;
  meta_title?: string;
  featured_image_url?: string;
  category?: string;
  author_name?: string;
  created_at: string;
  show_on_academy?: boolean;
  read_time_min?: number;
}

const SUPABASE_URL =
  process.env.DIGO_SOLUTION_SUPABASE_URL ||
  'https://ecpxozsqmgniutuzopqy.supabase.co';
const SUPABASE_ANON_KEY =
  process.env.DIGO_SOLUTION_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjcHhvenNxbWduaXV0dXpvcHF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0ODE1OTEsImV4cCI6MjA5NDA1NzU5MX0.hZMZOV8f8xezY6XqismbiL29SS6ZUB2N8o9CKQNsZ3w';

export function calculateReadingTime(content?: string): number {
  if (!content) return 3;
  const words = content.replace(/<[^>]*>/g, '').trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 225));
}

/**
 * Fetch all blogs marked for Digo Academy from Digo Solution Supabase.
 * Uses native fetch with Next.js ISR cache tags (revalidates every hour).
 */
export async function getAcademyBlogs(limit = 20): Promise<BlogPost[]> {
  try {
    const endpoint = `${SUPABASE_URL}/rest/v1/blogs?select=id,title,slug,description,meta_description,featured_image_url,category,author_name,created_at,content&status=eq.published&show_on_academy=eq.true&order=created_at.desc&limit=${limit}`;

    const res = await fetch(endpoint, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      next: {
        revalidate: 3600, // Cache for 1 hour; instant bust with revalidateTag('academy-blogs')
        tags: ['academy-blogs'],
      },
    });

    if (!res.ok) {
      const errText = await res.text();
      if (errText.includes('show_on_academy does not exist')) {
        console.warn(
          'Digo Solution Supabase: "show_on_academy" column not found. Run SQL migration to enable filtering.'
        );
        return [];
      }
      console.error('Failed to fetch blogs from Digo Solution Supabase:', res.status, errText);
      return [];
    }

    const data: BlogPost[] = await res.json();
    return (data || []).map((blog) => ({
      ...blog,
      read_time_min: calculateReadingTime(blog.content),
    }));
  } catch (err) {
    console.error('Exception fetching academy blogs:', err);
    return [];
  }
}

/**
 * Fetch a single blog by slug or ID from Digo Solution Supabase.
 */
export async function getAcademyBlogBySlug(slugOrId: string): Promise<BlogPost | null> {
  try {
    const isNumeric = /^[0-9]+$/.test(slugOrId);
    const filter = isNumeric
      ? `or=(slug.eq.${slugOrId},id.eq.${slugOrId})`
      : `slug=eq.${encodeURIComponent(slugOrId)}`;

    const endpoint = `${SUPABASE_URL}/rest/v1/blogs?select=*&status=eq.published&${filter}&limit=1`;

    const res = await fetch(endpoint, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      next: {
        revalidate: 3600,
        tags: [`blog-${slugOrId}`, 'academy-blogs'],
      },
    });

    if (!res.ok) {
      console.error('Failed to fetch blog by slug:', res.status);
      return null;
    }

    const posts: BlogPost[] = await res.json();
    if (!posts || posts.length === 0) {
      return null;
    }

    const post = posts[0];
    return {
      ...post,
      read_time_min: calculateReadingTime(post.content),
    };
  } catch (err) {
    console.error('Exception fetching blog post:', err);
    return null;
  }
}
