import React, { useState } from "react";
import { AdminModal } from './index';

function ProductDetailModal({ product, onClose }) {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    console.log('[Modal Image] Error loading image, using fallback');
    setImageError(true);
  };

  const getImageSrc = () => {
    if (imageError) {
      console.log('[Modal Image] Using fallback image');
      return "/images/default-product.jpg";
    }
    const imageUrl = product.images?.[0]?.url || "/images/default-product.jpg";
    // If the image URL is a relative path, prepend the server URL
    const fullImageUrl = imageUrl.startsWith('/') 
      ? `http://localhost:8080${imageUrl}` 
      : imageUrl;
    console.log('[Modal Image] Image URL:', fullImageUrl);
    return fullImageUrl;
  };

  return (
    <AdminModal
      isOpen={true}
      onClose={onClose}
      title="Product Information"
      size="lg"
    >
            <div className="row align-items-center mb-3">
              {/* Product image */}
              <div className="col-md-3 text-center">
                                 <img
                   src={getImageSrc()}
                   alt="Product"
                   className="img-fluid rounded"
                   style={{ width: "150px", height: "150px", objectFit: "cover" }}
                   onError={handleImageError}
                 />
              </div>
              {/* Basic information */}
              <div className="col-md-9">
                <h4>{product.name}</h4>
                <p className="text-muted mb-2">SKU: {product.sku || 'N/A'}</p>
                <div className="d-flex gap-3">
                  <span className="badge bg-primary">{product.categoryID?.categoryName || 'N/A'}</span>
                  <span className={`badge ${product.isActive ? 'bg-success' : 'bg-danger'}`}>
                    {product.isActive ? 'Active' : 'Inactive'}
                  </span>
                  {product.isFeatured && <span className="badge bg-warning">Featured</span>}
                  {product.isFlashSale && <span className="badge bg-danger">Flash Sale</span>}
                </div>
              </div>
            </div>
            
                         {/* Detailed information */}
             <div className="row">
               <div className="col-md-6">
                 <h6>Pricing</h6>
                 <div className="table-responsive">
                   <table className="table table-sm table-bordered">
                     <tbody>
                       <tr>
                         <td><strong>Original Price</strong></td>
                         <td>{product.price?.original?.toLocaleString() || 'N/A'}₫</td>
                       </tr>
                       <tr>
                         <td><strong>Sale Price</strong></td>
                         <td>{product.price?.sale?.toLocaleString() || 'N/A'}₫</td>
                       </tr>
                       {product.isFlashSale && (
                         <tr>
                           <td><strong>Flash Sale Price</strong></td>
                           <td>{product.flashSalePrice?.toLocaleString() || 'N/A'}₫</td>
                         </tr>
                       )}
                     </tbody>
                   </table>
                 </div>
               </div>
               <div className="col-md-6">
                 <h6>Statistics</h6>
                 <div className="table-responsive">
                   <table className="table table-sm table-bordered">
                     <tbody>
                       <tr>
                         <td><strong>Sold</strong></td>
                         <td>{product.sold || 0} units</td>
                       </tr>
                       <tr>
                         <td><strong>Views</strong></td>
                         <td>{product.views || 0}</td>
                       </tr>
                       <tr>
                         <td><strong>Rating</strong></td>
                         <td>{product.rating?.average?.toFixed(1) || 'N/A'} ({product.rating?.count || 0} reviews)</td>
                       </tr>
                     </tbody>
                   </table>
                 </div>
               </div>
             </div>

             <div className="row mt-3">
               <div className="col-12">
                 <h6>Inventory</h6>
                 <div className="table-responsive">
                   <table className="table table-sm table-bordered">
                     <tbody>
                       <tr>
                         <td><strong>Quantity</strong></td>
                         <td>{product.inventory?.quantity || 0}</td>
                       </tr>
                       <tr>
                         <td><strong>Low Stock Threshold</strong></td>
                         <td>{product.inventory?.lowStockThreshold || 'N/A'}</td>
                       </tr>
                     </tbody>
                   </table>
                 </div>
               </div>
             </div>

            {product.description && (
              <div className="row mt-3">
                <div className="col-12">
                  <h6>Description</h6>
                  <p>{product.description}</p>
                </div>
              </div>
            )}

            {product.shortDescription && (
              <div className="row mt-3">
                <div className="col-12">
                  <h6>Short Description</h6>
                  <p>{product.shortDescription}</p>
                </div>
              </div>
            )}

                         <div className="row mt-3">
               <div className="col-md-6">
                 <h6>Seller Information</h6>
                 <div className="table-responsive">
                   <table className="table table-sm table-bordered">
                     <tbody>
                       <tr>
                         <td><strong>Seller</strong></td>
                         <td>{product.sellerID?.businessName || 'N/A'}</td>
                       </tr>
                       <tr>
                         <td><strong>Brand</strong></td>
                         <td>{product.brand || 'N/A'}</td>
                       </tr>
                     </tbody>
                   </table>
                 </div>
               </div>
               <div className="col-md-6">
                 <h6>Timestamps</h6>
                 <div className="table-responsive">
                   <table className="table table-sm table-bordered">
                     <tbody>
                       <tr>
                         <td><strong>Created</strong></td>
                         <td>{product.createdAt ? new Date(product.createdAt).toLocaleString() : 'N/A'}</td>
                       </tr>
                       <tr>
                         <td><strong>Updated</strong></td>
                         <td>{product.updatedAt ? new Date(product.updatedAt).toLocaleString() : 'N/A'}</td>
                       </tr>
                     </tbody>
                   </table>
                 </div>
               </div>
             </div>

            {product.tags && product.tags.length > 0 && (
              <div className="row mt-3">
                <div className="col-12">
                  <h6>Tags</h6>
                  <div className="d-flex flex-wrap gap-1">
                    {product.tags.map((tag, index) => (
                      <span key={index} className="badge bg-secondary">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </AdminModal>
  );
}

export default ProductDetailModal;
