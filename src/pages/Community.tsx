import React, { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import { useAuth } from '../contexts/AuthContext';
import { MessageSquare, ThumbsUp, ThumbsDown, Clock, User, Search, Filter, Plus, Tag, X, AlertCircle, ArrowLeft, CheckCircle2, Users, LogIn } from 'lucide-react';

interface CommunityPost {
  id: string;
  title: string;
  content: string;
  author: string;
  authorId: string;
  createdAt: Date;
  upvotes: number;
  downvotes: number;
  replies: number;
  tags: string[];
  category: 'diagnostic' | 'tuning' | 'maintenance' | 'general';
  carMake?: string;
  carModel?: string;
  carYear?: number;
  solved: boolean;
  solvedVotes: number;
  source: 'community' | 'reddit' | 'forum';
  userVote?: 'up' | 'down' | null;
  userSolvedVote?: boolean;
}

interface Reply {
  id: string;
  postId: string;
  content: string;
  author: string;
  authorId: string;
  createdAt: Date;
  upvotes: number;
  downvotes: number;
  userVote?: 'up' | 'down' | null;
}

interface NewPostForm {
  title: string;
  content: string;
  category: 'diagnostic' | 'tuning' | 'maintenance' | 'general';
  carMake: string;
  carModel: string;
  carYear: string;
}

const Community: React.FC = () => {
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<CommunityPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<CommunityPost | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [newReply, setNewReply] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);
  const [error, setError] = useState('');

  // New post form state
  const [newPost, setNewPost] = useState<NewPostForm>({
    title: '',
    content: '',
    category: 'general',
    carMake: '',
    carModel: '',
    carYear: ''
  });
  const [formErrors, setFormErrors] = useState<Partial<NewPostForm>>({});

  const categories = ['all', 'diagnostic', 'tuning', 'maintenance', 'general'];
  const postCategories = ['diagnostic', 'tuning', 'maintenance', 'general'];

  // Character limits
  const TITLE_MAX_LENGTH = 150;
  const CONTENT_MAX_LENGTH = 1000;
  const CAR_FIELD_MAX_LENGTH = 50;
  const REPLY_MAX_LENGTH = 500;

  useEffect(() => {
    fetchCommunityPosts();
  }, []);

  const fetchCommunityPosts = async () => {
    try {
      setLoading(true);
      
     // Get user's votes if logged in
     let userVotes = {};
     let userSolvedVotes = {};
     
     if (currentUser) {
       const { data: votesData } = await supabase
         .from('post_votes')
         .select('post_id, vote_type')
         .eq('user_id', currentUser.id);
         
       if (votesData) {
         userVotes = votesData.reduce((acc, vote) => {
           acc[vote.post_id] = vote.vote_type;
           return acc;
         }, {});
       }
       
       const { data: solvedVotesData } = await supabase
         .from('post_solved_votes')
         .select('post_id')
         .eq('user_id', currentUser.id);
         
       if (solvedVotesData) {
         userSolvedVotes = solvedVotesData.reduce((acc, vote) => {
           acc[vote.post_id] = true;
           return acc;
         }, {});
       }
     }
     
     // Fetch posts with profile information
     const { data: postsData, error } = await supabase
       .from('community_posts_with_profiles')
       .select('*')
       .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching community posts:', error);
        return;
      }

      const formattedPosts: CommunityPost[] = postsData.map(post => ({
        id: post.id,
        title: post.title,
        content: post.content,
       author: post.display_name || 'Anonymous',
        authorId: post.user_id,
        createdAt: new Date(post.created_at),
        upvotes: post.upvotes,
        downvotes: post.downvotes,
        replies: post.replies_count,
        tags: post.tags || [],
        category: post.category,
        carMake: post.car_make,
        carModel: post.car_model,
        carYear: post.car_year,
        solved: post.solved,
        solvedVotes: post.solved_votes,
       source: 'community',
       userVote: userVotes[post.id] || null,
       userSolvedVote: userSolvedVotes[post.id] || false
      }));

      setPosts(formattedPosts);
      setFilteredPosts(formattedPosts);
    } catch (error) {
      console.error('Error fetching community posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = posts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });

    // Sort by upvotes and recency
    filtered.sort((a, b) => {
      const scoreA = a.upvotes - a.downvotes;
      const scoreB = b.upvotes - b.downvotes;
      if (scoreA !== scoreB) return scoreB - scoreA;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    setFilteredPosts(filtered);
  }, [posts, searchTerm, selectedCategory]);

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  const getSourceBadge = (source: string) => {
    switch (source) {
      case 'reddit':
        return <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">Reddit</span>;
      case 'forum':
        return <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Forum</span>;
      default:
        return <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Community</span>;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'diagnostic': return 'text-red-600 bg-red-100';
      case 'tuning': return 'text-purple-600 bg-purple-100';
      case 'maintenance': return 'text-blue-600 bg-blue-100';
      case 'general': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatCategoryName = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  const validateForm = (): boolean => {
    const errors: Partial<NewPostForm> = {};

    // Title validation
    if (!newPost.title.trim()) {
      errors.title = 'Title is required';
    } else if (newPost.title.length > TITLE_MAX_LENGTH) {
      errors.title = `Title must be ${TITLE_MAX_LENGTH} characters or less`;
    }

    // Content validation
    if (!newPost.content.trim()) {
      errors.content = 'Content is required';
    } else if (newPost.content.length > CONTENT_MAX_LENGTH) {
      errors.content = `Content must be ${CONTENT_MAX_LENGTH} characters or less`;
    }

    // Car make validation
    if (!newPost.carMake.trim()) {
      errors.carMake = 'Car make is required';
    } else if (newPost.carMake.length > CAR_FIELD_MAX_LENGTH) {
      errors.carMake = `Car make must be ${CAR_FIELD_MAX_LENGTH} characters or less`;
    }

    // Car model validation
    if (!newPost.carModel.trim()) {
      errors.carModel = 'Car model is required';
    } else if (newPost.carModel.length > CAR_FIELD_MAX_LENGTH) {
      errors.carModel = `Car model must be ${CAR_FIELD_MAX_LENGTH} characters or less`;
    }

    // Car year validation
    if (!newPost.carYear.trim()) {
      errors.carYear = 'Car year is required';
    } else {
      const year = parseInt(newPost.carYear);
      const currentYear = new Date().getFullYear();
      if (isNaN(year) || year < 1990 || year > currentYear + 1) {
        errors.carYear = `Year must be between 1990 and ${currentYear + 1}`;
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const capitalizeCarBrand = (brand: string): string => {
    // List of car brand acronyms that should be capitalized
    const acronyms = ['BMW', 'VW', 'GM', 'AMG', 'GTI', 'STI', 'WRX', 'STI', 'RS', 'M3', 'M5', 'S4', 'S6', 'RS3', 'RS4', 'RS6', 'GTR', 'SRT', 'SVT', 'SS', 'ZL1', 'Z28', 'GT', 'SHO', 'SVR', 'HSV'];
    
    const upperBrand = brand.toUpperCase();
    if (acronyms.includes(upperBrand)) {
      return upperBrand;
    }
    
    return brand.toLowerCase();
  };

  const generateTags = (title: string, content: string, carMake: string, carModel: string, category: string): string[] => {
    const tags: string[] = [];
    
    // Add car make and model (with proper capitalization for acronyms)
    tags.push(capitalizeCarBrand(carMake));
    tags.push(capitalizeCarBrand(carModel));
    
    // Extract problem-specific keywords from title and content
    const problemKeywords = [
      'oil', 'brake', 'engine', 'transmission', 'suspension', 'exhaust', 'intake', 'turbo',
      'misfire', 'leak', 'noise', 'vibration', 'overheating', 'stalling', 'rough idle',
      'check engine', 'abs', 'airbag', 'electrical', 'battery', 'alternator', 'starter',
      'clutch', 'timing', 'fuel', 'coolant', 'radiator', 'thermostat', 'spark plug',
      'coil', 'injector', 'filter', 'belt', 'hose', 'gasket', 'seal', 'bearing',
      'upgrade', 'performance', 'tune', 'chip', 'exhaust', 'headers', 'downpipe',
      'intercooler', 'wastegate', 'boost', 'dyno', 'horsepower', 'torque'
    ];
    
    const combinedText = (title + ' ' + content).toLowerCase();
    
    // Find matching problem keywords
    problemKeywords.forEach(keyword => {
      if (combinedText.includes(keyword)) {
        tags.push(keyword);
      }
    });
    
    // Extract meaningful words from title (but exclude category words)
    const categoryWords = ['diagnostic', 'tuning', 'maintenance', 'general'];
    const titleWords = title.toLowerCase()
      .split(' ')
      .filter(word => 
        word.length > 3 && 
        !['with', 'from', 'that', 'this', 'have', 'been', 'need', 'help', 'advice'].includes(word) &&
        !categoryWords.includes(word)
      )
      .slice(0, 2);
    
    tags.push(...titleWords);
    
    // Remove duplicates and limit to 6 tags
    return [...new Set(tags)].slice(0, 6);
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) return;
    if (!validateForm()) return;

    setSubmitting(true);

    try {
      setError('');

      // Generate tags (excluding category since it's already shown in the header)
      const tags = generateTags(
        newPost.title,
        newPost.content,
        newPost.carMake,
        newPost.carModel,
        newPost.category
      );

      // Insert post into Supabase
      const { data, error } = await supabase
        .from('community_posts')
        .insert([
          {
            user_id: currentUser.id,
            title: newPost.title.trim(),
            content: newPost.content.trim(),
            category: newPost.category,
            car_make: newPost.carMake.trim(),
            car_model: newPost.carModel.trim(),
            car_year: parseInt(newPost.carYear),
            tags: tags,
            upvotes: 0,
            downvotes: 0,
            replies_count: 0,
            solved: false,
            solved_votes: 0
          }
        ])
        .select()
        .maybeSingle();

      if (error) {
        throw error;
      }

      // Refresh posts list
      await fetchCommunityPosts();

      // Reset form
      setNewPost({
        title: '',
        content: '',
        category: 'general',
        carMake: '',
        carModel: '',
        carYear: ''
      });
      setFormErrors({});
      setShowCreatePost(false);
    } catch (error) {
      console.error('Error creating post:', error);
      setError('Failed to create post. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof NewPostForm, value: string) => {
    setNewPost(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const getRemainingChars = (field: keyof NewPostForm, maxLength: number) => {
    return maxLength - newPost[field].length;
  };

  const handlePostClick = async (post: CommunityPost) => {
    setSelectedPost(post);
    setLoadingReplies(true);
    
   try {
     // Fetch actual replies from the database
     const { data: repliesData, error } = await supabase
       .from('post_replies_with_profiles')
       .select('*')
       .eq('post_id', post.id)
       .order('created_at', { ascending: true });
     
     if (error) {
       console.error('Error fetching replies:', error);
       // Fallback to mock data if there's an error
       const mockReplies: Reply[] = [
         {
           id: '1',
           postId: post.id,
           content: 'I had the same issue with my Civic. Check if the MAF sensor got contaminated during installation. Try cleaning it with MAF cleaner spray.',
           author: 'HondaTech',
           authorId: 'user6',
           createdAt: new Date('2024-01-15T10:30:00'),
           upvotes: 8,
           downvotes: 0,
           userVote: null
         },
         {
           id: '2',
           postId: post.id,
           content: 'Also make sure you didn\'t disconnect any vacuum lines. Even a small vacuum leak can cause misfires at idle.',
           author: 'MechanicMike',
           authorId: 'user7',
           createdAt: new Date('2024-01-15T11:15:00'),
           upvotes: 5,
           downvotes: 1,
           userVote: null
         },
         {
           id: '3',
           postId: post.id,
           content: 'Did you reset the ECU after installation? Sometimes the car needs to relearn the new airflow characteristics.',
           author: 'TunerGuy',
           authorId: 'user8',
           createdAt: new Date('2024-01-15T14:20:00'),
           upvotes: 12,
           downvotes: 0,
           userVote: null
         }
       ];
       setReplies(mockReplies);
     } else {
       // Get user's votes on replies if logged in
       let userReplyVotes = {};
       
       if (currentUser && repliesData && repliesData.length > 0) {
         const replyIds = repliesData.map(reply => reply.id);
         
         const { data: votesData } = await supabase
           .from('reply_votes')
           .select('reply_id, vote_type')
           .eq('user_id', currentUser.id)
           .in('reply_id', replyIds);
           
         if (votesData) {
           userReplyVotes = votesData.reduce((acc, vote) => {
             acc[vote.reply_id] = vote.vote_type;
             return acc;
           }, {});
         }
       }
       
       // Format replies with user vote information
       const formattedReplies: Reply[] = repliesData.map(reply => ({
         id: reply.id,
         postId: reply.post_id,
         content: reply.content,
         author: reply.display_name || 'Anonymous',
         authorId: reply.user_id,
         createdAt: new Date(reply.created_at),
         upvotes: reply.upvotes,
         downvotes: reply.downvotes,
         userVote: userReplyVotes[reply.id] || null
       }));
       
       setReplies(formattedReplies);
     }
   } catch (error) {
     console.error('Error in handlePostClick:', error);
   } finally {
     setLoadingReplies(false);
   }
  };

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !selectedPost || !newReply.trim()) return;

    setSubmittingReply(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const reply: Reply = {
        id: Date.now().toString(),
        postId: selectedPost.id,
        content: newReply.trim(),
        author: currentUser.email?.split('@')[0] || 'Anonymous',
        authorId: currentUser.id,
        createdAt: new Date(),
        upvotes: 0,
        downvotes: 0,
        userVote: null
      };

      setReplies(prev => [...prev, reply]);
      
      // Update reply count in posts
      setPosts(prev => prev.map(post => 
        post.id === selectedPost.id 
          ? { ...post, replies: post.replies + 1 }
          : post
      ));

      setNewReply('');
    } catch (error) {
      console.error('Error submitting reply:', error);
    } finally {
      setSubmittingReply(false);
    }
  };

  const handleVoteSolved = async (postId: string) => {
    if (!currentUser) {
      setShowLoginModal(true);
      return;
    }

    try {
     // First, check if user has already voted this post as solved
     const { data: existingVote, error: voteCheckError } = await supabase
       .from('post_solved_votes')
       .select('*')
       .eq('user_id', currentUser.id)
       .eq('post_id', postId)
       .maybeSingle();
     
     if (voteCheckError && voteCheckError.code !== 'PGRST116') { // PGRST116 means not found, which is expected
       console.error('Error checking existing solved vote:', voteCheckError);
       return;
     }
     
     // If user already voted, don't allow duplicate votes
     if (existingVote) {
       console.log('User already voted this post as solved');
       return;
     }
     
     // Add the vote
     const { error: insertError } = await supabase
       .from('post_solved_votes')
       .insert([{
         user_id: currentUser.id,
         post_id: postId
       }]);
     
     if (insertError) {
       console.error('Error adding solved vote:', insertError);
       return;
     }
     
     // Get current post data to update counts
     const { data: postData, error: postError } = await supabase
       .from('community_posts')
       .select('solved_votes')
       .eq('id', postId)
       .single();
     
     if (postError) {
       console.error('Error fetching post data:', postError);
       return;
     }
     
     // Calculate new values
     const newSolvedVotes = (postData.solved_votes || 0) + 1;
     const newSolved = newSolvedVotes >= 5;
     
     // Update the post
     const { error: updateError } = await supabase
       .from('community_posts')
       .update({
         solved_votes: newSolvedVotes,
         solved: newSolved
       })
       .eq('id', postId);

     if (updateError) {
       console.error('Error updating solved votes:', updateError);
        return;
      }

      // Update local state
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              solvedVotes: newSolvedVotes,
              solved: newSolved
            }
          : post
      ));

      if (selectedPost && selectedPost.id === postId) {
        setSelectedPost(prev => prev ? {
          ...prev,
          solvedVotes: newSolvedVotes,
          solved: newSolved
        } : null);
      }
    } catch (error) {
      console.error('Error voting solved:', error);
    }
  };

  const handlePostVote = (postId: string, voteType: 'up' | 'down') => {
    if (!currentUser) {
      setShowLoginModal(true);
      return;
    }

   // Implement post voting logic with Supabase
   (async () => {
     try {
       // Check if user has already voted on this post
       const { data: existingVote, error: voteCheckError } = await supabase
         .from('post_votes')
         .select('*')
         .eq('user_id', currentUser.id)
         .eq('post_id', postId)
        .maybeSingle();
       
       if (voteCheckError && voteCheckError.code !== 'PGRST116') { // PGRST116 means not found
         console.error('Error checking existing vote:', voteCheckError);
         return;
       }
       
       // Get current post data
       const { data: postData, error: postError } = await supabase
         .from('community_posts')
         .select('upvotes, downvotes')
         .eq('id', postId)
         .single();
       
       if (postError) {
         console.error('Error fetching post data:', postError);
         return;
       }
       
       let newUpvotes = postData.upvotes || 0;
       let newDownvotes = postData.downvotes || 0;
       
       // Handle different voting scenarios
       if (!existingVote) {
         // New vote
         const { error: insertError } = await supabase
           .from('post_votes')
           .insert([{
             user_id: currentUser.id,
             post_id: postId,
             vote_type: voteType
           }]);
         
         if (insertError) {
           console.error('Error adding vote:', insertError);
           return;
         }
         
         // Update counts
         if (voteType === 'up') {
           newUpvotes += 1;
         } else {
           newDownvotes += 1;
         }
       } else if (existingVote.vote_type === voteType) {
         // Remove vote if clicking the same button
         const { error: deleteError } = await supabase
           .from('post_votes')
           .delete()
           .eq('id', existingVote.id);
         
         if (deleteError) {
           console.error('Error removing vote:', deleteError);
           return;
         }
         
         // Update counts
         if (voteType === 'up') {
           newUpvotes = Math.max(0, newUpvotes - 1);
         } else {
           newDownvotes = Math.max(0, newDownvotes - 1);
         }
       } else {
         // Change vote type
         const { error: updateError } = await supabase
           .from('post_votes')
           .update({ vote_type: voteType })
           .eq('id', existingVote.id);
         
         if (updateError) {
           console.error('Error updating vote:', updateError);
           return;
         }
         
         // Update counts
         if (voteType === 'up') {
           newUpvotes += 1;
           newDownvotes = Math.max(0, newDownvotes - 1);
         } else {
           newDownvotes += 1;
           newUpvotes = Math.max(0, newUpvotes - 1);
         }
       }
       
       // Update post with new vote counts
       const { error: updateError } = await supabase
         .from('community_posts')
         .update({
           upvotes: newUpvotes,
           downvotes: newDownvotes
         })
         .eq('id', postId);
       
       if (updateError) {
         console.error('Error updating post votes:', updateError);
         return;
       }
       
       // Update local state
       setPosts(prev => prev.map(post => 
         post.id === postId 
           ? { ...post, upvotes: newUpvotes, downvotes: newDownvotes }
           : post
       ));
       
       if (selectedPost && selectedPost.id === postId) {
         setSelectedPost(prev => prev ? {
           ...prev,
           upvotes: newUpvotes,
           downvotes: newDownvotes
         } : null);
       }
     } catch (error) {
       console.error('Error handling post vote:', error);
     }
   })();
  };

  const handleReplyVote = async (replyId: string, voteType: 'up' | 'down') => {
    if (!currentUser) {
      setShowLoginModal(true);
      return;
    }

    setReplies(prev => prev.map(reply => {
      if (reply.id === replyId) {
        const currentVote = reply.userVote;
        let newUpvotes = reply.upvotes;
        let newDownvotes = reply.downvotes;
        let newUserVote: 'up' | 'down' | null = voteType;

        // Remove previous vote if exists
        if (currentVote === 'up') newUpvotes--;
        if (currentVote === 'down') newDownvotes--;

        // Add new vote if different from current
        if (currentVote === voteType) {
          newUserVote = null; // Remove vote if clicking same button
        } else {
          if (voteType === 'up') newUpvotes++;
          if (voteType === 'down') newDownvotes++;
        }

        return {
          ...reply,
          upvotes: newUpvotes,
          downvotes: newDownvotes,
          userVote: newUserVote
        };
      }
      return reply;
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Post Detail View
  if (selectedPost) {
    return (
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => setSelectedPost(null)}
          className="flex items-center text-primary-600 hover:text-primary-700 mb-6 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Community
        </button>

        {/* Post Detail */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(selectedPost.category)}`}>
                  {formatCategoryName(selectedPost.category)}
                </span>
                {getSourceBadge(selectedPost.source)}
                {selectedPost.solved && (
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded flex items-center">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Solved
                  </span>
                )}
              </div>
              
              <h1 className="text-2xl font-bold text-gray-900 mb-4">{selectedPost.title}</h1>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedPost.tags.map((tag, index) => (
                  <span key={index} className="inline-flex items-center text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          <p className="text-gray-700 mb-6 whitespace-pre-wrap leading-relaxed">{selectedPost.content}</p>
          
          <div className="flex items-center justify-between text-sm text-gray-500 border-t pt-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-1" />
                {selectedPost.author}
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {formatDate(selectedPost.createdAt)}
              </div>
              {selectedPost.carMake && (
                <div className="text-primary-600">
                  {selectedPost.carMake} {selectedPost.carModel} {selectedPost.carYear}
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => handlePostVote(selectedPost.id, 'up')}
                  className="flex items-center text-green-600 hover:text-green-700"
                >
                  <ThumbsUp className="h-4 w-4 mr-1" />
                  {selectedPost.upvotes}
                </button>
                <button 
                  onClick={() => handlePostVote(selectedPost.id, 'down')}
                  className="flex items-center text-red-600 hover:text-red-700"
                >
                  <ThumbsDown className="h-4 w-4 mr-1" />
                  {selectedPost.downvotes}
                </button>
              </div>
              
              {/* Solved Voting */}
              {!selectedPost.solved && (
                <button
                 onClick={() => handleVoteSolved(selectedPost.id)}
                 className={`flex items-center transition-colors ${
                   selectedPost.userSolvedVote 
                     ? 'text-blue-700 bg-blue-100 px-2 py-1 rounded' 
                     : 'text-blue-600 hover:text-blue-700'
                 }`}
                 disabled={selectedPost.userSolvedVote}
                >
                  <Users className="h-4 w-4 mr-1" />
                 {selectedPost.userSolvedVote ? 'You voted as solved' : `Mark Solved (${selectedPost.solvedVotes}/5)`}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Replies Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Replies ({replies.length})
          </h3>

          {loadingReplies ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <>
              {/* Reply Form */}
              {currentUser ? (
                <form onSubmit={handleReplySubmit} className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <textarea
                    value={newReply}
                    onChange={(e) => setNewReply(e.target.value)}
                    placeholder="Share your thoughts or solution..."
                    rows={3}
                    maxLength={REPLY_MAX_LENGTH}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                  />
                  <div className="flex justify-between items-center mt-2">
                    <span className={`text-xs ${REPLY_MAX_LENGTH - newReply.length < 50 ? 'text-red-500' : 'text-gray-500'}`}>
                      {REPLY_MAX_LENGTH - newReply.length} characters remaining
                    </span>
                    <button
                      type="submit"
                      disabled={!newReply.trim() || submittingReply}
                      className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center"
                    >
                      {submittingReply ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Posting...
                        </>
                      ) : (
                        'Post Reply'
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg text-center">
                  <p className="text-gray-600">Please log in to reply to this post.</p>
                </div>
              )}

              {/* Replies List */}
              <div className="space-y-4">
                {replies.map((reply) => (
                  <div key={reply.id} className="border-l-4 border-primary-200 pl-4 py-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <User className="h-4 w-4" />
                        <span className="font-medium">{reply.author}</span>
                        <span>•</span>
                        <span>{formatDate(reply.createdAt)}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleReplyVote(reply.id, 'up')}
                          className={`flex items-center text-sm transition-colors ${
                            reply.userVote === 'up' 
                              ? 'text-green-700 bg-green-100' 
                              : 'text-green-600 hover:text-green-700'
                          } px-2 py-1 rounded`}
                        >
                          <ThumbsUp className="h-3 w-3 mr-1" />
                          {reply.upvotes}
                        </button>
                        <button
                          onClick={() => handleReplyVote(reply.id, 'down')}
                          className={`flex items-center text-sm transition-colors ${
                            reply.userVote === 'down' 
                              ? 'text-red-700 bg-red-100' 
                              : 'text-red-600 hover:text-red-700'
                          } px-2 py-1 rounded`}
                        >
                          <ThumbsDown className="h-3 w-3 mr-1" />
                          {reply.downvotes}
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-700 whitespace-pre-wrap">{reply.content}</p>
                  </div>
                ))}
                
                {replies.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No replies yet. Be the first to help!</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Login Required Modal */}
        {showLoginModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <LogIn className="h-5 w-5 mr-2 text-primary-600" />
                  Sign In Required
                </h3>
                <button
                  onClick={() => setShowLoginModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-600 mb-4">
                  You must be signed in to like or dislike posts and replies.
                </p>
                <div className="bg-primary-50 border border-primary-200 rounded-lg p-3">
                  <p className="text-primary-800 text-sm">
                    <strong>Join our community</strong> to participate in discussions, vote on helpful content, and share your automotive expertise!
                  </p>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowLoginModal(false)}
                  className="flex-1 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <a
                  href="/login"
                  className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors text-center"
                >
                  Sign In
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Main Community View
  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Community Hub</h1>
        <p className="text-lg text-gray-600">
          Connect with fellow car enthusiasts, share experiences, and get expert advice
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search posts, tags, or car models..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
          
          <div className="flex gap-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : formatCategoryName(category)}
                </option>
              ))}
            </select>
            
            {currentUser ? (
              <button
                onClick={() => setShowCreatePost(true)}
                className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Post
              </button>
            ) : (
              <div className="flex items-center text-gray-500 text-sm">
                <Plus className="h-4 w-4 mr-2" />
                Login to create posts
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Posts List */}
      <div className="space-y-6">
        {filteredPosts.map((post) => (
          <div 
            key={post.id} 
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => handlePostClick(post)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(post.category)}`}>
                    {formatCategoryName(post.category)}
                  </span>
                  {getSourceBadge(post.source)}
                  {post.solved && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded flex items-center">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Solved
                    </span>
                  )}
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-primary-600 transition-colors">
                  {post.title}
                </h3>
                
                <p className="text-gray-600 mb-4 line-clamp-3">{post.content}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag, index) => (
                    <span key={index} className="inline-flex items-center text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  {post.author}
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {formatDate(post.createdAt)}
                </div>
                {post.carMake && (
                  <div className="text-primary-600">
                    {post.carMake} {post.carModel} {post.carYear}
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePostVote(post.id, 'up');
                    }}
                    className="flex items-center text-green-600 hover:text-green-700"
                  >
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    {post.upvotes}
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePostVote(post.id, 'down');
                    }}
                    className="flex items-center text-red-600 hover:text-red-700"
                  >
                    <ThumbsDown className="h-4 w-4 mr-1" />
                    {post.downvotes}
                  </button>
                </div>
                <div className="flex items-center text-gray-600">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  {post.replies} replies
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-16">
          <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No posts found</h3>
          <p className="text-gray-600">Try adjusting your search criteria or create a new post.</p>
        </div>
      )}

      {/* Create Post Modal */}
      {showCreatePost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Create New Post</h3>
                <button
                  onClick={() => setShowCreatePost(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleCreatePost} className="space-y-6">
                {/* Title */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Post Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={newPost.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      formErrors.title ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-primary-500'
                    }`}
                    placeholder="Describe your car issue or question..."
                    maxLength={TITLE_MAX_LENGTH}
                  />
                  <div className="flex justify-between mt-1">
                    {formErrors.title && (
                      <span className="text-red-500 text-xs flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {formErrors.title}
                      </span>
                    )}
                    <span className={`text-xs ml-auto ${getRemainingChars('title', TITLE_MAX_LENGTH) < 20 ? 'text-red-500' : 'text-gray-500'}`}>
                      {getRemainingChars('title', TITLE_MAX_LENGTH)} characters remaining
                    </span>
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    id="category"
                    value={newPost.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    {postCategories.map(category => (
                      <option key={category} value={category}>
                        {formatCategoryName(category)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Car Information */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="carMake" className="block text-sm font-medium text-gray-700 mb-2">
                      Car Make *
                    </label>
                    <input
                      type="text"
                      id="carMake"
                      value={newPost.carMake}
                      onChange={(e) => handleInputChange('carMake', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        formErrors.carMake ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-primary-500'
                      }`}
                      placeholder="e.g., Honda"
                      maxLength={CAR_FIELD_MAX_LENGTH}
                    />
                    {formErrors.carMake && (
                      <span className="text-red-500 text-xs flex items-center mt-1">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {formErrors.carMake}
                      </span>
                    )}
                  </div>

                  <div>
                    <label htmlFor="carModel" className="block text-sm font-medium text-gray-700 mb-2">
                      Car Model *
                    </label>
                    <input
                      type="text"
                      id="carModel"
                      value={newPost.carModel}
                      onChange={(e) => handleInputChange('carModel', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        formErrors.carModel ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-primary-500'
                      }`}
                      placeholder="e.g., Civic"
                      maxLength={CAR_FIELD_MAX_LENGTH}
                    />
                    {formErrors.carModel && (
                      <span className="text-red-500 text-xs flex items-center mt-1">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {formErrors.carModel}
                      </span>
                    )}
                  </div>

                  <div>
                    <label htmlFor="carYear" className="block text-sm font-medium text-gray-700 mb-2">
                      Car Year *
                    </label>
                    <input
                      type="number"
                      id="carYear"
                      value={newPost.carYear}
                      onChange={(e) => handleInputChange('carYear', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        formErrors.carYear ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-primary-500'
                      }`}
                      placeholder="e.g., 2020"
                      min="1990"
                      max={new Date().getFullYear() + 1}
                    />
                    {formErrors.carYear && (
                      <span className="text-red-500 text-xs flex items-center mt-1">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {formErrors.carYear}
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div>
                  <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                    Post Content *
                  </label>
                  <textarea
                    id="content"
                    value={newPost.content}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    rows={6}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none ${
                      formErrors.content ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-primary-500'
                    }`}
                    placeholder="Describe your issue in detail. Include symptoms, when it happens, what you've tried, etc..."
                    maxLength={CONTENT_MAX_LENGTH}
                  />
                  <div className="flex justify-between mt-1">
                    {formErrors.content && (
                      <span className="text-red-500 text-xs flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {formErrors.content}
                      </span>
                    )}
                    <span className={`text-xs ml-auto ${getRemainingChars('content', CONTENT_MAX_LENGTH) < 50 ? 'text-red-500' : 'text-gray-500'}`}>
                      {getRemainingChars('content', CONTENT_MAX_LENGTH)} characters remaining
                    </span>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowCreatePost(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center"
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Creating...
                      </>
                    ) : (
                      'Create Post'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Login Required Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <LogIn className="h-5 w-5 mr-2 text-primary-600" />
                Sign In Required
              </h3>
              <button
                onClick={() => setShowLoginModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-600 mb-4">
                You must be signed in to like or dislike posts and replies.
              </p>
              <div className="bg-primary-50 border border-primary-200 rounded-lg p-3">
                <p className="text-primary-800 text-sm">
                  <strong>Join our community</strong> to participate in discussions, vote on helpful content, and share your automotive expertise!
                </p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowLoginModal(false)}
                className="flex-1 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <a
                href="/login"
                className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors text-center"
              >
                Sign In
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Community;