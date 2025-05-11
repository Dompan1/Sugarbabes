'use client';

import { useState } from 'react';
import { FaHeart, FaComment, FaImage, FaSmile, FaPaperPlane, FaReply, FaTrash } from 'react-icons/fa';

interface Comment {
  id: number;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  timestamp: string;
}

interface Post {
  id: number;
  author: {
    name: string;
    avatar: string;
    isVIP?: boolean;
  };
  content: string;
  image?: string;
  likes: number;
  comments: number;
  commentList: Comment[];
  timestamp: string;
  liked: boolean;
}

export default function Feed() {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      author: {
        name: 'Sophia Lindgren',
        avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
        isVIP: true
      },
      content: 'Härlig dag idag! Vem vill följa med på en promenad längs stranden ikväll? 🌊',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      likes: 56,
      comments: 2,
      commentList: [
        {
          id: 101,
          author: {
            name: 'Marcus Ek',
            avatar: 'https://randomuser.me/api/portraits/men/44.jpg'
          },
          content: 'Låter härligt! Jag kan följa med 😊',
          timestamp: '30 minuter sedan'
        },
        {
          id: 102,
          author: {
            name: 'Elin Sandberg',
            avatar: 'https://randomuser.me/api/portraits/women/33.jpg'
          },
          content: 'Vilken strand tänkte du? Jag är på om det är i närheten!',
          timestamp: '15 minuter sedan'
        }
      ],
      timestamp: '45 minuter sedan',
      liked: false
    },
    {
      id: 2,
      author: {
        name: 'Emma Johansson',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
      },
      content: 'Äntligen helg! Har någon tips på bra restauranger i Stockholm? 🍽️',
      likes: 28,
      comments: 1,
      commentList: [
        {
          id: 201,
          author: {
            name: 'Johan Eriksson',
            avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
          },
          content: 'Prova Chez Pierre på Södermalm, fantastisk mat och service!',
          timestamp: '1 timme sedan'
        }
      ],
      timestamp: '2 timmar sedan',
      liked: true
    },
    {
      id: 3,
      author: {
        name: 'Alicia Berg',
        avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
        isVIP: true
      },
      content: 'Mysig hemmakväll med film och vin. Vad gör ni ikväll? 🍷',
      image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      likes: 94,
      comments: 1,
      commentList: [
        {
          id: 301,
          author: {
            name: 'Lisa Magnusson',
            avatar: 'https://randomuser.me/api/portraits/women/22.jpg'
          },
          content: 'Samma här! Vilken film tänkte du se?',
          timestamp: '2 timmar sedan'
        }
      ],
      timestamp: '3 timmar sedan',
      liked: false
    }
  ]);

  const [newPost, setNewPost] = useState('');
  const [commentTexts, setCommentTexts] = useState<{[key: number]: string}>({});
  const [openComments, setOpenComments] = useState<{[key: number]: boolean}>({});

  const handleLike = (id: number) => {
    setPosts(prevPosts => 
      prevPosts.map(post => {
        if (post.id === id) {
          return {
            ...post,
            liked: !post.liked,
            likes: post.liked ? post.likes - 1 : post.likes + 1
          };
        }
        return post;
      })
    );
  };

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    const newPostObj: Post = {
      id: Date.now(),
      author: {
        name: 'Erik Andersson',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
      },
      content: newPost,
      likes: 0,
      comments: 0,
      commentList: [],
      timestamp: 'Just nu',
      liked: false
    };

    setPosts([newPostObj, ...posts]);
    setNewPost('');
  };

  const toggleComments = (postId: number) => {
    setOpenComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const handleCommentChange = (postId: number, text: string) => {
    setCommentTexts(prev => ({
      ...prev,
      [postId]: text
    }));
  };

  const handleCommentSubmit = (postId: number) => {
    const commentText = commentTexts[postId];
    if (!commentText?.trim()) return;

    const newComment: Comment = {
      id: Date.now(),
      author: {
        name: 'Erik Andersson',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
      },
      content: commentText,
      timestamp: 'Just nu'
    };

    setPosts(prevPosts => 
      prevPosts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments: post.comments + 1,
            commentList: [...post.commentList, newComment]
          };
        }
        return post;
      })
    );

    // Rensa kommentarsfältet efter att kommentaren har skickats
    setCommentTexts(prev => ({
      ...prev,
      [postId]: ''
    }));
  };

  return (
    <div className="space-y-6">
      {/* Create new post */}
      <div className="bg-white rounded-xl shadow-custom p-4">
        <form onSubmit={handlePostSubmit}>
          <div className="flex space-x-3">
            <img 
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" 
              alt="Profile"
              className="h-10 w-10 rounded-full object-cover"
            />
            <div className="flex-1">
              <textarea
                placeholder="Vad tänker du på?"
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                rows={2}
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
              ></textarea>
              <div className="flex justify-between items-center mt-3">
                <div className="flex space-x-2">
                  <button type="button" className="p-2 text-gray-500 hover:text-primary">
                    <FaImage />
                  </button>
                  <button type="button" className="p-2 text-gray-500 hover:text-primary">
                    <FaSmile />
                  </button>
                </div>
                <button 
                  type="submit" 
                  className="btn-primary"
                  disabled={!newPost.trim()}
                >
                  Publicera
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Posts */}
      {posts.map((post) => (
        <div key={post.id} className="bg-white rounded-xl shadow-custom p-4">
          <div className="flex items-start space-x-3">
            <img 
              src={post.author.avatar} 
              alt={post.author.name}
              className={`h-10 w-10 rounded-full object-cover ${post.author.isVIP ? 'ring-2 ring-secondary' : ''}`}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center">
                <h3 className="font-semibold text-gray-900">
                  {post.author.name}
                  {post.author.isVIP && (
                    <span className="ml-1 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-secondary text-white">
                      VIP
                    </span>
                  )}
                </h3>
                <span className="ml-2 text-xs text-gray-500">{post.timestamp}</span>
              </div>
              <p className="mt-1 text-gray-800">{post.content}</p>
              
              {post.image && (
                <div className="mt-3">
                  <img 
                    src={post.image} 
                    alt="Post image"
                    className="rounded-lg max-h-96 w-full object-cover"
                  />
                </div>
              )}
              
              <div className="mt-3 flex items-center space-x-4 pt-3 border-t border-gray-100">
                <button 
                  onClick={() => handleLike(post.id)}
                  className={`flex items-center space-x-1 ${post.liked ? 'text-primary' : 'text-gray-500'}`}
                >
                  <FaHeart />
                  <span>{post.likes}</span>
                </button>
                <button 
                  onClick={() => toggleComments(post.id)} 
                  className="flex items-center space-x-1 text-gray-500 hover:text-primary"
                >
                  <FaComment />
                  <span>{post.comments}</span>
                </button>
              </div>
              
              {/* Comments Section */}
              {openComments[post.id] && (
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Kommentarer ({post.comments})</h4>
                  
                  {/* Comment List */}
                  {post.commentList.length > 0 ? (
                    <div className="space-y-3 mb-4">
                      {post.commentList.map(comment => (
                        <div key={comment.id} className="flex space-x-2">
                          <img 
                            src={comment.author.avatar} 
                            alt={comment.author.name}
                            className="h-8 w-8 rounded-full object-cover flex-shrink-0"
                          />
                          <div className="bg-gray-50 rounded-lg p-2 flex-1">
                            <div className="flex justify-between items-start">
                              <span className="font-medium text-sm">{comment.author.name}</span>
                              <span className="text-xs text-gray-500">{comment.timestamp}</span>
                            </div>
                            <p className="text-sm text-gray-800 mt-1">{comment.content}</p>
                            <div className="flex space-x-2 mt-1">
                              <button className="text-xs text-gray-500 hover:text-primary">
                                <FaReply className="inline mr-1" size={10} />
                                Svara
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 mb-4">Var först med att kommentera!</p>
                  )}
                  
                  {/* Add Comment Form */}
                  <div className="flex space-x-2">
                    <img 
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" 
                      alt="Profile"
                      className="h-8 w-8 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="flex-1 relative">
                      <textarea
                        placeholder="Skriv en kommentar..."
                        className="w-full p-2 pr-10 border border-gray-200 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary resize-none text-sm"
                        rows={1}
                        value={commentTexts[post.id] || ''}
                        onChange={(e) => handleCommentChange(post.id, e.target.value)}
                      ></textarea>
                      <button 
                        onClick={() => handleCommentSubmit(post.id)}
                        disabled={!commentTexts[post.id]?.trim()}
                        className="absolute right-2 bottom-2 text-primary disabled:text-gray-300"
                      >
                        <FaPaperPlane />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 