import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from '../../models/order.interface';
import { environment } from '../../../../environment/environment.dev';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private serverUrl = environment.SERVER_URL;
  
  constructor(private http: HttpClient) { }

  getOrders = (): Observable<Order[]> => {
    return this.http.get<Order[]>(`${this.serverUrl}/orders`);
  }

  updateOrder = (order: Order) => {
    return this.http.put<Order>(`${this.serverUrl}/orders/${order.id}`, order);
  }
}
