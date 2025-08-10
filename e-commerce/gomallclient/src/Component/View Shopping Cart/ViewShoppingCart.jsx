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


  
}
