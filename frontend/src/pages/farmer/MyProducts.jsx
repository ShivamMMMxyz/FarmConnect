import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import productService from '../../services/product.service';
import './MyProducts.css';

const MyProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyProducts();
  }, []);

  const fetchMyProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getMyProducts();
      // Backend returns { success, count, data }
      setProducts(response.data || response);
    } catch (err) {
      setError('Failed to load products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      await productService.deleteProduct(productId);
      setProducts(products.filter(p => p._id !== productId));
    } catch (err) {
      alert('Failed to delete product');
      console.error(err);
    }
  };

  const handleEdit = (productId) => {
    navigate(`/farmer/products/edit/${productId}`);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading your products...</p>
      </div>
    );
  }

  return (
    <div className="my-products-page">
      <div className="container">
        <div className="page-header">
          <div>
            <h1>My Products</h1>
            <p>Manage your product listings</p>
          </div>
          <Link to="/farmer/add-product" className="btn btn-primary">
            + Add New Product
          </Link>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {products.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <h3>No products yet</h3>
            <p>Start selling by adding your first product</p>
            <Link to="/farmer/add-product" className="btn btn-primary">
              Add Your First Product
            </Link>
          </div>
        ) : (
          <div className="products-grid">
            {products.map(product => (
              <div key={product._id} className="product-card">
                <div className="product-image">
                  {product.image ? (
                    <img src={product.image} alt={product.name} />
                  ) : (
                    <div className="placeholder-image">🌾</div>
                  )}
                  <span className={`status-badge ${product.quantity > 0 ? 'in-stock' : 'out-of-stock'}`}>
                    {product.quantity > 0 ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>

                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p className="product-category">{product.category}</p>
                  
                  <div className="product-details">
                    <div className="detail-item">
                      <span className="label">Price:</span>
                      <span className="value">₹{product.price}/{product.unit}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Available:</span>
                      <span className="value">{product.quantity} {product.unit}</span>
                    </div>
                  </div>

                  {product.description && (
                    <p className="product-description">{product.description}</p>
                  )}

                  <div className="product-actions">
                    <button
                      onClick={() => handleEdit(product._id)}
                      className="btn btn-secondary btn-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="btn btn-danger btn-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProducts;
