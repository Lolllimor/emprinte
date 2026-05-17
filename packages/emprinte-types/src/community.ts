import type { PostType, ReactionEmoji } from './enums';

export interface CommunityPost {
  id: string;
  user_id: string;
  content: string;
  post_type: PostType;
  linked_book?: string;
  linked_review_id?: string;
  is_pinned: boolean;
  is_public: boolean;
  is_hidden: boolean;
  media_url?: string;
  created_at: string;
  updated_at: string;
  user?: {
    full_name: string;
    avatar_url?: string;
    username?: string;
  };
  reactions?: PostReaction[];
  reaction_counts?: Record<ReactionEmoji, number>;
  user_reactions?: ReactionEmoji[];
  comment_count?: number;
  save_count?: number;
  is_saved?: boolean;
  mention_labels?: Record<string, string>;
}

export interface PostReaction {
  id: string;
  post_id: string;
  user_id: string;
  emoji: ReactionEmoji;
  created_at: string;
}

export interface PostComment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  is_hidden: boolean;
  created_at: string;
  user?: {
    full_name: string;
    avatar_url?: string;
  };
}

export type ForumFeedTab = 'Posts' | 'Pinned' | 'Media' | 'Saves';
