import { supabase } from '../config/supabase';

export interface CommunityPost {
  id: string;
  user_id: string;
  title: string;
  content: string;
  category: 'diagnostic' | 'tuning' | 'maintenance' | 'general';
  car_make?: string;
  car_model?: string;
  car_year?: number;
  upvotes: number;
  downvotes: number;
  replies_count: number;
  tags?: string[];
  solved: boolean;
  solved_votes: number;
  created_at: string;
  updated_at: string;
  display_name?: string;
  avatar_url?: string;
}

export interface PostReply {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  upvotes: number;
  downvotes: number;
  created_at: string;
  display_name?: string;
  avatar_url?: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface PostFormData {
  title: string;
  content: string;
  category: 'diagnostic' | 'tuning' | 'maintenance' | 'general';
  car_make?: string;
  car_model?: string;
  car_year?: number;
  tags?: string[];
}

export class CommunityService {
  /**
   * Validate post form data
   */
  static validatePostForm(formData: PostFormData): ValidationError[] {
    const errors: ValidationError[] = [];

    // Validate title
    if (!formData.title.trim()) {
      errors.push({ field: 'title', message: 'Title is required' });
    } else if (formData.title.length < 5) {
      errors.push({ field: 'title', message: 'Title must be at least 5 characters' });
    } else if (formData.title.length > 200) {
      errors.push({ field: 'title', message: 'Title must be 200 characters or less' });
    }

    // Validate content
    if (!formData.content.trim()) {
      errors.push({ field: 'content', message: 'Content is required' });
    } else if (formData.content.length < 10) {
      errors.push({ field: 'content', message: 'Content must be at least 10 characters' });
    } else if (formData.content.length > 10000) {
      errors.push({ field: 'content', message: 'Content must be 10000 characters or less' });
    }

    // Validate car year if provided
    if (formData.car_year !== undefined) {
      const currentYear = new Date().getFullYear();
      if (formData.car_year < 1900 || formData.car_year > currentYear + 2) {
        errors.push({ field: 'car_year', message: `Year must be between 1900 and ${currentYear + 2}` });
      }
    }

    // Validate tags if provided
    if (formData.tags && formData.tags.length > 10) {
      errors.push({ field: 'tags', message: 'Maximum 10 tags allowed' });
    }

    if (formData.tags) {
      for (const tag of formData.tags) {
        if (tag.length > 50) {
          errors.push({ field: 'tags', message: 'Each tag must be 50 characters or less' });
          break;
        }
      }
    }

    return errors;
  }

  /**
   * Get all community posts with pagination
   */
  static async getPosts(
    page: number = 1,
    limit: number = 10,
    category?: 'diagnostic' | 'tuning' | 'maintenance' | 'general'
  ): Promise<{ posts: CommunityPost[]; count: number }> {
    try {
      // Calculate offset
      const offset = (page - 1) * limit;
      
      // Build query
      let query = supabase
        .from('community_posts_with_profiles')
        .select('*', { count: 'exact' });
      
      // Apply category filter if provided
      if (category) {
        query = query.eq('category', category);
      }
      
      // Apply pagination
      query = query.order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);
      
      const { data, error, count } = await query;
      
      if (error) {
        console.error('Error fetching community posts:', error);
        throw new Error(`Failed to fetch posts: ${error.message}`);
      }
      
      return {
        posts: data as CommunityPost[],
        count: count || 0
      };
    } catch (error) {
      console.error('Error in getPosts:', error);
      throw error;
    }
  }

  /**
   * Search community posts
   */
  static async searchPosts(
    searchQuery: string,
    category?: 'diagnostic' | 'tuning' | 'maintenance' | 'general',
    carMake?: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<CommunityPost[]> {
    try {
      const { data, error } = await supabase.rpc('search_community_posts', {
        search_query: searchQuery,
        category_filter: category || null,
        car_make_filter: carMake || null,
        limit_count: limit,
        offset_count: offset
      });
      
      if (error) {
        console.error('Error searching community posts:', error);
        throw new Error(`Failed to search posts: ${error.message}`);
      }
      
      return data as CommunityPost[];
    } catch (error) {
      console.error('Error in searchPosts:', error);
      throw error;
    }
  }

  /**
   * Get trending community posts
   */
  static async getTrendingPosts(
    timePeriod: string = '7 days',
    limit: number = 10
  ): Promise<CommunityPost[]> {
    try {
      const { data, error } = await supabase.rpc('get_trending_community_posts', {
        time_period: timePeriod,
        limit_count: limit
      });
      
      if (error) {
        console.error('Error fetching trending posts:', error);
        throw new Error(`Failed to fetch trending posts: ${error.message}`);
      }
      
      return data as CommunityPost[];
    } catch (error) {
      console.error('Error in getTrendingPosts:', error);
      throw error;
    }
  }

  /**
   * Get a single post by ID
   */
  static async getPostById(postId: string): Promise<CommunityPost> {
    try {
      const { data, error } = await supabase
        .from('community_posts_with_profiles')
        .select('*')
        .eq('id', postId)
        .single();
      
      if (error) {
        console.error('Error fetching post:', error);
        throw new Error(`Failed to fetch post: ${error.message}`);
      }
      
      return data as CommunityPost;
    } catch (error) {
      console.error('Error in getPostById:', error);
      throw error;
    }
  }

  /**
   * Create a new community post
   */
  static async createPost(postData: PostFormData): Promise<CommunityPost> {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError || !userData.user) {
        throw new Error('User not authenticated');
      }
      
      const userId = userData.user.id;
      
      const { data, error } = await supabase
        .from('community_posts')
        .insert([{
          user_id: userId,
          title: postData.title,
          content: postData.content,
          category: postData.category,
          car_make: postData.car_make,
          car_model: postData.car_model,
          car_year: postData.car_year,
          tags: postData.tags ? postData.tags : null
        }])
        .select()
        .single();
      
      if (error) {
        console.error('Error creating post:', error);
        throw new Error(`Failed to create post: ${error.message}`);
      }
      
      return data as CommunityPost;
    } catch (error) {
      console.error('Error in createPost:', error);
      throw error;
    }
  }

  /**
   * Update an existing post
   */
  static async updatePost(
    postId: string,
    updates: Partial<PostFormData>
  ): Promise<CommunityPost> {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError || !userData.user) {
        throw new Error('User not authenticated');
      }
      
      const userId = userData.user.id;
      
      const { data, error } = await supabase
        .from('community_posts')
        .update(updates)
        .eq('id', postId)
        .eq('user_id', userId) // Ensure user can only update their own posts
        .select()
        .single();
      
      if (error) {
        console.error('Error updating post:', error);
        throw new Error(`Failed to update post: ${error.message}`);
      }
      
      return data as CommunityPost;
    } catch (error) {
      console.error('Error in updatePost:', error);
      throw error;
    }
  }

  /**
   * Delete a post
   */
  static async deletePost(postId: string): Promise<void> {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError || !userData.user) {
        throw new Error('User not authenticated');
      }
      
      const userId = userData.user.id;
      
      const { error } = await supabase
        .from('community_posts')
        .delete()
        .eq('id', postId)
        .eq('user_id', userId); // Ensure user can only delete their own posts
      
      if (error) {
        console.error('Error deleting post:', error);
        throw new Error(`Failed to delete post: ${error.message}`);
      }
    } catch (error) {
      console.error('Error in deletePost:', error);
      throw error;
    }
  }

  /**
   * Vote on a post (upvote or downvote)
   */
  static async voteOnPost(
    postId: string,
    voteType: 'up' | 'down'
  ): Promise<{ upvotes: number; downvotes: number }> {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError || !userData.user) {
        throw new Error('User not authenticated');
      }
      
      // First, get current vote counts
      const { data: postData, error: postError } = await supabase
        .from('community_posts')
        .select('upvotes, downvotes')
        .eq('id', postId)
        .single();
      
      if (postError) {
        console.error('Error fetching post for voting:', postError);
        throw new Error(`Failed to vote on post: ${postError.message}`);
      }
      
      // Calculate new vote counts
      let newUpvotes = postData.upvotes;
      let newDownvotes = postData.downvotes;
      
      if (voteType === 'up') {
        newUpvotes += 1;
      } else {
        newDownvotes += 1;
      }
      
      // Update the post
      const { data, error } = await supabase
        .from('community_posts')
        .update({
          upvotes: newUpvotes,
          downvotes: newDownvotes
        })
        .eq('id', postId)
        .select('upvotes, downvotes')
        .single();
      
      if (error) {
        console.error('Error updating post votes:', error);
        throw new Error(`Failed to vote on post: ${error.message}`);
      }
      
      return {
        upvotes: data.upvotes,
        downvotes: data.downvotes
      };
    } catch (error) {
      console.error('Error in voteOnPost:', error);
      throw error;
    }
  }

  /**
   * Mark a post as solved
   */
  static async markAsSolved(postId: string): Promise<{ solved: boolean; solved_votes: number }> {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError || !userData.user) {
        throw new Error('User not authenticated');
      }
      
      // First, get current post data
      const { data: postData, error: postError } = await supabase
        .from('community_posts')
        .select('solved, solved_votes')
        .eq('id', postId)
        .single();
      
      if (postError) {
        console.error('Error fetching post for marking as solved:', postError);
        throw new Error(`Failed to mark post as solved: ${postError.message}`);
      }
      
      // Increment solved votes
      const newSolvedVotes = postData.solved_votes + 1;
      
      // Determine if post should be marked as solved (5+ votes)
      const shouldBeSolved = newSolvedVotes >= 5;
      
      // Update the post
      const { data, error } = await supabase
        .from('community_posts')
        .update({
          solved_votes: newSolvedVotes,
          solved: shouldBeSolved || postData.solved // Once solved, stays solved
        })
        .eq('id', postId)
        .select('solved, solved_votes')
        .single();
      
      if (error) {
        console.error('Error marking post as solved:', error);
        throw new Error(`Failed to mark post as solved: ${error.message}`);
      }
      
      return {
        solved: data.solved,
        solved_votes: data.solved_votes
      };
    } catch (error) {
      console.error('Error in markAsSolved:', error);
      throw error;
    }
  }

  /**
   * Get replies for a post
   */
  static async getPostReplies(postId: string): Promise<PostReply[]> {
    try {
      // In a real app, you would have a post_replies table
      // For now, we'll return mock data
      return [
        {
          id: '1',
          post_id: postId,
          user_id: 'user1',
          content: 'I had the same issue with my car. Check if the MAF sensor got contaminated. Try cleaning it with MAF cleaner spray.',
          upvotes: 8,
          downvotes: 0,
          created_at: new Date(Date.now() - 3600000).toISOString(),
          display_name: 'CarExpert',
          avatar_url: null
        },
        {
          id: '2',
          post_id: postId,
          user_id: 'user2',
          content: 'Also make sure you didn\'t disconnect any vacuum lines. Even a small vacuum leak can cause these symptoms.',
          upvotes: 5,
          downvotes: 1,
          created_at: new Date(Date.now() - 7200000).toISOString(),
          display_name: 'MechanicPro',
          avatar_url: null
        },
        {
          id: '3',
          post_id: postId,
          user_id: 'user3',
          content: 'Did you reset the ECU after making changes? Sometimes the car needs to relearn the new parameters.',
          upvotes: 12,
          downvotes: 0,
          created_at: new Date(Date.now() - 10800000).toISOString(),
          display_name: 'TunerGuy',
          avatar_url: null
        }
      ];
    } catch (error) {
      console.error('Error in getPostReplies:', error);
      throw error;
    }
  }
}