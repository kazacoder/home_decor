import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CatalogComponent} from "./catalog/catalog.component";
import {DetailComponent} from "./detail/detail.component";

const routes: Routes = [
  {path: 'catalog', component: CatalogComponent, title: 'Каталог'},
  {path: 'product/:url', component: DetailComponent, title: 'О товаре'},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule { }
