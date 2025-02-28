import { Component, OnInit } from '@angular/core';
import {ProductService} from "../../../shared/services/product.service";
import {Router} from "@angular/router";
import {ProductType} from "../../../../types/product.type";

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss']
})
export class CatalogComponent implements OnInit {

  products: ProductType[] = []

  constructor(private productService: ProductService,
              private router: Router) { }

  ngOnInit(): void {
    this.productService.getProducts()
      .subscribe(data => {
        this.products = data.items
      })
  }

}
