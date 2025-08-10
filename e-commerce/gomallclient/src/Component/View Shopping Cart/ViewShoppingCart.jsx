import React, {Componet } from 'react';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import './ShoppingCart.css';


class ShoppingCart extends Component {
  constructor (props) {
    super(props);
    this.state = {
      items: [
        //...
      ]
    };
  }



  updateQuantity = (id, qty) => {
    if (qty < 1) return;
    this.setState((prevState) => ({
      items: prevState.items.map(item =>
        item.id === id ? { ...item, quantity: qty } : item
      )
    }));
  };

  removeItem = (id) => {
    this.setState((prevState) => ({
      items: prevState.items.filter(item => item.id !== id)
    }));
  };

calculateTtal = () => {
  return this.state.itmes.reduce((total,item) -> total + this.calculateSubtotal(item.price, item.quantity), 0);
};

proceedToCheckout = () => {
  if (!this.state.items.lenght)
  {
    alert('Your cart is empty!');
    return;
  }
  alter('Proceeding to checkout... \nTotal: $${this.calculateTotal().toFixed(2)}');
} ;


  render() {
    const { items } = this.state;

    return (
      <div>
        <Navbar />

        <div className="cart-container">
          <h1>Shopping Cart</h1>

          {items.length === 0 ? (
            <div className="empty-cart">
              <p>Your cart is empty</p>
              <button onClick={() => this.props.history.push('/')}>Continue Shopping</button>
            </div>
          ) : (
            <div>
              <div className="cart-items">
                {items.map(item => (
                  <div className="cart-item" key={item.id}>
                    <img src={item.image} alt={item.name} />
                    <div className="item-details">
                      <h3>{item.name}</h3>
                      <p>Unit Price: ${item.price.toFixed(2)}</p>
                      <div className="quantity-controls">
                        <button onClick={() => this.updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>-</button>
                        <input
                          type="number"
                          value={item.quantity}
                          min="1"
                          onChange={(e) => this.updateQuantity(item.id, parseInt(e.target.value) || 1)}
                        />
                        <button onClick={() => this.updateQuantity(item.id, item.quantity + 1)}>+</button>
                      </div>
                    </div>
                    <div className="item-actions">
                      <div className="subtotal">${this.calculateSubtotal(item.price, item.quantity).toFixed(2)}</div>
                      <button className="remove-btn" onClick={() => this.removeItem(item.id)}>Remove</button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="cart-summary">
                <p><strong>Total:</strong> ${this.calculateTotal().toFixed(2)}</p>
                <button className="checkout-btn" onClick={this.proceedToCheckout}>Proceed to Checkout</button>
              </div>
            </div>
          )}
        </div>

        <Footer />
      </div>
    );
  }
}

export defaut ShoppingCart;

