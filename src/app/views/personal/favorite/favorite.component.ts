import {Component, OnInit} from '@angular/core';
import {FavoriteService} from "../../../shared/services/favorite.service";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {FavoriteType} from "../../../../types/favorite.type";
import {environment} from "../../../../environments/environment";
import {CartService} from "../../../shared/services/cart.service";
import {CartType} from "../../../../types/cart.type";

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.scss']
})
export class FavoriteComponent implements OnInit {

  products: FavoriteType[] = [];
  serverStaticPath = environment.serverStaticPath;

  constructor(private favoriteService: FavoriteService,
              private cartService: CartService,) {
  }

  ngOnInit(): void {
    this.favoriteService.getFavorites()
      .subscribe((data: DefaultResponseType | FavoriteType[]) => {
        if ((data as DefaultResponseType).error !== undefined) {
          const error = (data as DefaultResponseType).message;
          throw new Error(error);
        }

        this.products = data as FavoriteType[];


        this.cartService.getCart().subscribe((cartData: CartType | DefaultResponseType) => {
          if ((cartData as DefaultResponseType).error !== undefined) {
            throw new Error((cartData as DefaultResponseType).message);
          }

          const cartDataResponse = cartData as CartType

          if (cartDataResponse) {
            this.products.map(product => {
              const productInCart = cartDataResponse.items.find(item => item.product.id === product.id);
              if (productInCart) {
                product.countInCart = productInCart.quantity;
              }
              return product
            })
          }
        });


      })
  }

  removeFromFavorites(id: string): void {
    this.favoriteService.removeFavorite(id).subscribe((data: DefaultResponseType) => {
      if (data.error) {
        //...
        throw new Error(data.message)
      }
      this.products = this.products.filter(item => item.id !== id);
    });
  }

  addToCart(id: string): void {
    this.cartService.updateCart(id, 1)
      .subscribe((data: CartType | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message);
        }
        this.products.filter(item => item.id === id)[0].countInCart = 1;
      })
  }

  removeFromCart(id: string): void {
    this.cartService.updateCart(id, 0).subscribe((data: CartType | DefaultResponseType) => {
      if ((data as DefaultResponseType).error !== undefined) {
        throw new Error((data as DefaultResponseType).message);
      }
      this.products.filter(item => item.id === id)[0].countInCart = 0;
    })
  }

  updateCount(id: string, value: number) {
    this.products.map(product => {
      if (product.countInCart) {
        this.cartService.updateCart(id, value)
          .subscribe((data: CartType | DefaultResponseType) => {
            if ((data as DefaultResponseType).error !== undefined) {
              throw new Error((data as DefaultResponseType).message);
            }
          });
      }
      return product;
    })
  }
}
