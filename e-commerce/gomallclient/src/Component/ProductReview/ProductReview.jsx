import React, { useState, useEffect } from 'react';
import './ProductReview.css';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../hooks/use-toast';

const ProductReview = ({ productId, productName }) => {
    const { user, isAuthenticated } = useAuth();
    const { toast } = useToast();
    const [reviews, setReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const [totalReviews, setTotalReviews] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
    const [submitting, setSubmitting] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sortBy, setSortBy] = useState('newest');
    const [userHasReviewed, setUserHasReviewed] = useState(false);
    const [userReview, setUserReview] = useState(null);

    useEffect(() => {
        if (productId) {
            fetchReviews();
            checkUserReview();
        }
    }, [productId, currentPage, sortBy]);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            
            const response = await fetch(
                `http://localhost:8080/api/reviews/product/${productId}?page=${currentPage}&sort=${sortBy}&limit=10`
            );
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.success) {
                setReviews(data.data.reviews || []);
                setAverageRating(data.data.averageRating || 0);
                setTotalReviews(data.data.pagination?.totalReviews || 0);
                setTotalPages(data.data.pagination?.totalPages || 1);
            } else {
                toast({
                    title: "Error",
                    description: data.message || "Cannot load product reviews",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error('Error fetching reviews:', error);
            toast({
                title: "Error",
                description: "Cannot load product reviews",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const checkUserReview = async () => {
        if (!isAuthenticated()) return;
        
        try {
            const response = await fetch('http://localhost:8080/api/reviews/user', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.success) {
                const userProductReviews = data.data.reviews.filter(review => 
                    review.productID === productId
                );
                
                if (userProductReviews.length > 0) {
                    // Get the latest review from user for this product
                    const latestReview = userProductReviews.sort((a, b) => 
                        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                    )[0];
                    
                    setUserHasReviewed(true);
                    setUserReview(latestReview);
                } else {
                    setUserHasReviewed(false);
                    setUserReview(null);
                }
            }
        } catch (error) {
            console.error('Error checking user review:', error);
        }
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!isAuthenticated()) {
            toast({
                title: "Login Required",
                description: "Please login to review this product",
                variant: "destructive",
            });
            return;
        }

        if (!newReview.comment.trim()) {
            toast({
                title: "Error",
                description: "Please enter review content",
                variant: "destructive",
            });
            return;
        }

        try {
            setSubmitting(true);
            const response = await fetch('http://localhost:8080/api/reviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    productID: productId,
                    rating: newReview.rating,
                    comment: newReview.comment.trim()
                })
            });

            const data = await response.json();
            
            if (data.success) {
                // Add the new review to the current reviews list immediately
                const newReviewData = {
                    _id: data.data._id || Date.now().toString(),
                    productID: productId,
                    rating: newReview.rating,
                    comment: newReview.comment.trim(),
                    createdAt: new Date().toISOString(),
                    userID: {
                        username: user?.username || 'You',
                        avatar: user?.avatar
                    }
                };
                
                // Add to reviews list
                setReviews(prevReviews => [newReviewData, ...prevReviews]);
                
                // Update total count
                setTotalReviews(prev => prev + 1);
                
                // Keep track of user's latest review but allow multiple reviews
                setUserReview(newReviewData);
                setUserHasReviewed(true);
                
                // Reset form
                setNewReview({ rating: 5, comment: '' });
                setShowReviewForm(false);
                
                // Show success message
                toast({
                    title: "🎉 Review submitted successfully!",
                    description: "Thank you for sharing your experience about this product",
                });
                
                // Refresh data from server to ensure consistency
                setTimeout(() => {
                    fetchReviews();
                    checkUserReview();
                }, 1000);
            } else {
                toast({
                    title: "Error",
                    description: data.message || "Cannot submit review",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            toast({
                title: "Error",
                description: "Cannot submit review",
                variant: "destructive",
            });
        } finally {
            setSubmitting(false);
        }
    };

    const handleUpdateReview = async (e) => {
        e.preventDefault();
        if (!userReview) return;

        try {
            setSubmitting(true);
            const response = await fetch(`http://localhost:8080/api/reviews/${userReview._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    rating: newReview.rating,
                    comment: newReview.comment.trim()
                })
            });

            const data = await response.json();
            
            if (data.success) {
                // Update the review in the current reviews list immediately
                setReviews(prevReviews => 
                    prevReviews.map(review => 
                        review._id === userReview._id 
                            ? { ...review, rating: newReview.rating, comment: newReview.comment.trim() }
                            : review
                    )
                );
                
                // Update user review state
                setUserReview(prev => ({ ...prev, rating: newReview.rating, comment: newReview.comment.trim() }));
                
                // Reset form
                setShowReviewForm(false);
                
                // Show success message
                toast({
                    title: "✅ Update successful!",
                    description: "Your review has been updated",
                });
                
                // Refresh data from server to ensure consistency
                setTimeout(() => {
                    fetchReviews();
                    checkUserReview();
                }, 1000);
            } else {
                toast({
                    title: "Error",
                    description: data.message || "Cannot update review",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error('Error updating review:', error);
            toast({
                title: "Error",
                description: "Cannot update review",
                variant: "destructive",
            });
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteReview = async () => {
        if (!userReview) return;

        if (!window.confirm('Are you sure you want to delete this review?')) {
            return;
        }

        try {
            setSubmitting(true);
            const response = await fetch(`http://localhost:8080/api/reviews/${userReview._id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            const data = await response.json();
            
            if (data.success) {
                // Remove the review from the current reviews list immediately
                setReviews(prevReviews => 
                    prevReviews.filter(review => review._id !== userReview._id)
                );
                
                // Update total count
                setTotalReviews(prev => Math.max(0, prev - 1));
                
                // Reset user review state
                setUserReview(null);
                setUserHasReviewed(false);
                
                // Show success message
                toast({
                    title: "🗑️ Delete successful!",
                    description: "Your review has been deleted",
                });
                
                // Refresh data from server to ensure consistency
                setTimeout(() => {
                    fetchReviews();
                    checkUserReview();
                }, 1000);
            } else {
                toast({
                    title: "Error",
                    description: data.message || "Cannot delete review",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error('Error deleting review:', error);
            toast({
                title: "Error",
                description: "Cannot delete review",
                variant: "destructive",
            });
        } finally {
            setSubmitting(false);
        }
    };

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, index) => (
            <span
                key={index}
                className={`star ${index < rating ? 'filled' : ''}`}
            >
                ★
            </span>
        ));
    };

    const renderInteractiveStars = (rating, onRatingChange, size = 'large') => {
        return (
            <div className={`interactive-stars ${size}`}>
                {[1, 2, 3, 4, 5].map(star => (
                    <button
                        key={star}
                        type="button"
                        className={`interactive-star ${rating >= star ? 'active' : ''}`}
                        onClick={() => onRatingChange(star)}
                        onMouseEnter={() => onRatingChange(star)}
                        onMouseLeave={() => onRatingChange(rating)}
                    >
                        ★
                    </button>
                ))}
                <span className="rating-text">{rating} stars</span>
            </div>
        );
    };

    const getRatingText = (rating) => {
        if (rating >= 4.5) return "Excellent";
        if (rating >= 4.0) return "Very Good";
        if (rating >= 3.5) return "Good";
        if (rating >= 3.0) return "Very Good";
        if (rating >= 2.0) return "Average";
        return "Needs Improvement";
    };

    // Function to render comment with proper styling
    const renderComment = (comment) => {
        if (!comment || !comment.trim()) {
            return (
                <div className="review-comment no-comment">
                    <p>No comment</p>
                </div>
            );
        }
        
        return (
            <div className="review-comment has-comment">
                <p>{comment.trim()}</p>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="product-review-container">
                <div className="loading">Loading reviews...</div>
            </div>
        );
    }

    return (
        <div className="product-reviews">
            <div className="reviews-header">
                <h2 className="reviews-title">
                    <span className="title-icon">⭐</span>
                    Product Reviews
                </h2>
                
                <div className="reviews-summary">
                    <div className="average-rating">
                        <div className="rating-number">{averageRating.toFixed(1)}</div>
                        <div className="rating-stars">
                            {renderStars(averageRating)}
                        </div>
                        <div className="rating-text">
                            {getRatingText(averageRating)}
                        </div>
                        <div className="total-reviews">{totalReviews} reviews</div>
                    </div>
                </div>
            </div>

            {/* User Review Section */}
            {isAuthenticated() && userHasReviewed && userReview && (
                <div className="review-form-container">
                    <h4>Your Recent Review</h4>
                    <div className="user-review-display">
                        <div className="user-review-header">
                            <div className="user-review-rating">
                                {renderStars(userReview.rating)}
                                <span className="user-review-date">
                                    {new Date(userReview.createdAt).toLocaleDateString('en-US')}
                                </span>
                            </div>
                            <div className="user-review-actions">
                                <button 
                                    className="edit-review-btn"
                                    onClick={() => {
                                        setNewReview({ 
                                            rating: userReview.rating, 
                                            comment: userReview.comment 
                                        });
                                        setShowReviewForm(true);
                                    }}
                                >
                                    ✏️ Edit
                                </button>
                                <button 
                                    className="delete-review-btn"
                                    onClick={handleDeleteReview}
                                    disabled={submitting}
                                >
                                    🗑️ Delete
                                </button>
                            </div>
                        </div>
                        <div className="user-review-comment">
                            {userReview.comment && userReview.comment.trim() ? (
                                <div className="review-comment has-comment">
                                    <p>{userReview.comment.trim()}</p>
                                </div>
                            ) : (
                                <div className="review-comment no-comment">
                                    <p>No comment</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Write Review Button */}
            {isAuthenticated() && (
                <button 
                    className="write-review-btn"
                    onClick={() => setShowReviewForm(true)}
                >
                    {userHasReviewed ? 'Write New Review' : 'Write Review'}
                </button>
            )}

            {/* Review Form */}
            {showReviewForm && (
                <div className="review-form-container">
                    <h4>
                        {userHasReviewed ? 'Write New Review for' : 'Write Review for'} {productName}
                    </h4>
                    <form onSubmit={handleSubmitReview} className="review-form">
                        <div className="rating-input">
                            <label>Your Rating:</label>
                            {renderInteractiveStars(
                                newReview.rating,
                                (rating) => setNewReview(prev => ({ ...prev, rating })),
                                'large'
                            )}
                        </div>
                        
                        <div className="comment-input">
                            <label htmlFor="comment">Comment:</label>
                            <textarea
                                id="comment"
                                value={newReview.comment}
                                onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                                placeholder="Share your experience about this product..."
                                rows="4"
                                required
                            />
                        </div>
                        
                        <div className="form-actions">
                            <button 
                                type="button" 
                                className="cancel-btn"
                                onClick={() => setShowReviewForm(false)}
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                className="submit-btn"
                                disabled={submitting}
                            >
                                {submitting ? 'Processing...' : 'Submit Review'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="reviews-section">
                <div className="reviews-header">
                    <h4>All Reviews ({totalReviews})</h4>
                    <div className="sort-controls">
                        <label>Sort by:</label>
                        <select 
                            value={sortBy} 
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="newest">Newest</option>
                            <option value="oldest">Oldest</option>
                            <option value="rating_high">Highest Rating</option>
                            <option value="rating_low">Lowest Rating</option>
                        </select>
                    </div>
                </div>

                {reviews.length === 0 ? (
                    <div className="no-reviews">
                        <div className="no-reviews-icon">📝</div>
                        <div className="no-reviews-text">
                            No reviews yet for this product.
                        </div>
                        {isAuthenticated() && (
                            <button 
                                className="be-first-btn"
                                onClick={() => setShowReviewForm(true)}
                            >
                                {userHasReviewed ? 'Write New Review!' : 'Be the first to review!'}
                            </button>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="reviews-list">
                            {reviews.map((review) => {
                                return (
                                <div key={review._id} className="review-item">
                                    <div className="review-header">
                                        <div className="reviewer-info">
                                            <div className="reviewer-avatar">
                                                {review.userID?.avatar ? (
                                                    <img src={review.userID.avatar} alt="Avatar" />
                                                ) : (
                                                    <div className="avatar-placeholder">
                                                        {review.userID?.username?.charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="reviewer-details">
                                                <div className="reviewer-name">
                                                    {review.userID?.username || 'User'}
                                                </div>
                                                <div className="review-date">
                                                    {new Date(review.createdAt).toLocaleDateString('en-US')}
                                                </div>
                                                <div className="review-rating-display">
                                                    {renderStars(review.rating)}
                                                </div>
                                                {review.comment && review.comment.trim() ? (
                                                    <div className="review-comment has-comment">
                                                        <p>{review.comment.trim()}</p>
                                                    </div>
                                                ) : (
                                                    <div className="review-comment no-comment">
                                                        <p>No comment</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                );
                            })}
                        </div>

                        {totalPages > 1 && (
                            <div className="pagination">
                                <button
                                    className="page-btn"
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage(prev => prev - 1)}
                                >
                                    Previous
                                </button>
                                
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                    <button
                                        key={page}
                                        className={`page-btn ${currentPage === page ? 'active' : ''}`}
                                        onClick={() => setCurrentPage(page)}
                                    >
                                        {page}
                                    </button>
                                ))}
                                
                                <button
                                    className="page-btn"
                                    disabled={currentPage === totalPages}
                                    onClick={() => setCurrentPage(prev => prev + 1)}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default ProductReview;
