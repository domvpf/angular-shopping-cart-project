import { Component, OnInit } from '@angular/core';
import { Product } from '../../../models/product.interface';
import { ShoppingcartService } from '../../services/shoppingcart.service';

@Component({
  selector: 'checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit{
  cartItems: Product[] = [];
  totalAmount: number = 0;

  constructor(private cartService: ShoppingcartService) {}

  ngOnInit() {
    this.cartItems = this.cartService.getCartItems();
    this.totalAmount = this.cartItems.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0);
  }

  completeCheckout() {
    this.cartService.checkout();
    alert('Thank you for your purchase!');
  }
}
