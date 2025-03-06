import {Component, OnInit} from '@angular/core';
import {ProductService} from "../../../shared/services/product.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ProductType} from "../../../../types/product.type";
import {CategoryService} from "../../../shared/services/category.service";
import {CategoryWithTypeType} from "../../../../types/category-with-type.type";
import {ActiveParamsUtils} from "../../../shared/utils/active-params.utils";
import {ActiveParamsType} from "../../../../types/active-params.type";
import {AppliedFilterType} from "../../../../types/applied-filter.type";
import {debounce, debounceTime, of, timer} from "rxjs";
import {CartService} from "../../../shared/services/cart.service";
import {CartType} from "../../../../types/cart.type";
import {FavoriteService} from "../../../shared/services/favorite.service";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {FavoriteType} from "../../../../types/favorite.type";
import {AuthService} from "../../../core/auth/auth.service";

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss']
})
export class CatalogComponent implements OnInit {

  products: ProductType[] = [];
  categoriesWithTypes: CategoryWithTypeType[] = [];
  activeParams: ActiveParamsType = {types: []};
  appliedFilters: AppliedFilterType[] = [];
  sortingOpen = false;
  sortingOptions: { name: string, value: string }[] = [
    {name: 'От А до Я', value: 'az-asc'},
    {name: 'От Я до А', value: 'az-desc'},
    {name: 'По возрастанию цены', value: 'price-asc'},
    {name: 'По убыванию цены', value: 'price-desc'},
  ];
  pages: number[] = [];
  currentPage: number | null = null
  cart: CartType | null = null;
  favoriteProducts: FavoriteType[] | null = null;


  constructor(private productService: ProductService,
              private router: Router,
              private categoryService: CategoryService,
              private activatedRoute: ActivatedRoute,
              private cartService: CartService,
              private favoriteService: FavoriteService,
              private authService: AuthService,) {
    this.currentPage = this.activatedRoute.snapshot.queryParams['page']
  }

  ngOnInit(): void {
    this.cartService.getCart().subscribe((data: CartType | DefaultResponseType) => {
      if ((data as DefaultResponseType).error !== undefined) {
        throw new Error((data as DefaultResponseType).message);
      }
      this.cart = data as CartType;

      if (this.authService.getIsLoggedIn()) {
        this.favoriteService.getFavorites()
          .subscribe(
            {
              next: (data: DefaultResponseType | FavoriteType[]) => {
                if ((data as DefaultResponseType).error !== undefined) {
                  const error = (data as DefaultResponseType).message;
                  this.processCatalog();
                  throw new Error(error);
                }
                this.favoriteProducts = data as FavoriteType[];
                this.processCatalog();
              },
              error: err => {
                this.processCatalog()
              }
            }
          )
      } else {
        this.processCatalog()
      }
    });
  }

  processCatalog() {
    this.categoryService.getCategoriesWithTypes()
      .subscribe(data => {
        this.categoriesWithTypes = data

        this.activatedRoute.queryParams
          // .pipe(
          //   debounceTime(500),
          // )
          .pipe(
            debounce(ev => {
              // ToDo add sorting
              if (+ev['page'] !== this.currentPage) {
                // console.log(ev['page']);
                // console.log('curr ' +  this.currentPage)
                return of({})
              } else {
                // console.log('else')
                return timer(500)
              }

            }),
          )
          .subscribe(params => {
            this.activeParams = ActiveParamsUtils.processParams(params);
            if (this.activeParams.page) {
              this.currentPage = this.activeParams.page;
            }

            this.appliedFilters = [];

            this.activeParams.types.forEach(url => {

              for (let i = 0; i < this.categoriesWithTypes.length; i++) {
                const foundType = this.categoriesWithTypes[i].types.find(type => type.url === url);
                if (foundType) {
                  this.appliedFilters.push({
                    name: foundType.name,
                    urlParam: foundType.url,
                  });
                }
              }
            });
            if (this.activeParams.heightFrom) {
              this.appliedFilters.push({
                name: 'Высота: от ' + this.activeParams.heightFrom + ' см',
                urlParam: 'heightFrom',
              })
            }
            if (this.activeParams.heightTo) {
              this.appliedFilters.push({
                name: 'Высота: до ' + this.activeParams.heightTo + ' см',
                urlParam: 'heightTo',
              })
            }
            if (this.activeParams.diameterFrom) {
              this.appliedFilters.push({
                name: 'Диаметр: от ' + this.activeParams.diameterFrom + ' см',
                urlParam: 'diameterFrom',
              })
            }
            if (this.activeParams.diameterTo) {
              this.appliedFilters.push({
                name: 'Диаметр: до ' + this.activeParams.diameterTo + ' см',
                urlParam: 'diameterTo',
              })
            }

            this.productService.getProducts(this.activeParams)
              .subscribe(data => {
                this.pages = [];
                for (let i = 1; i <= data.pages; i++) {
                  this.pages.push(i)
                }

                if (this.cart && this.cart.items.length > 0) {
                  this.products = data.items.map(product => {
                    const productInCart = this.cart?.items.find(item => item.product.id === product.id)
                    if (productInCart) {
                      product.countInCart = productInCart.quantity
                    }
                    return product
                  })
                } else {
                  this.products = data.items;
                }
                if (this.favoriteProducts) {
                  this.products = this.products.map(product => {
                    if (this.favoriteProducts?.find(item => item.id === product.id)) {
                      product.isInFavorite = true;
                    }
                    return product
                  })
                }
              });
          });
      });
  }

  removeAppliedFilter(appliedFilter: AppliedFilterType) {
    if (appliedFilter.urlParam === 'heightFrom' || appliedFilter.urlParam === 'heightTo' ||
      appliedFilter.urlParam === 'diameterFrom' || appliedFilter.urlParam === 'diameterTo') {
      delete this.activeParams[appliedFilter.urlParam];
    } else {
      this.activeParams.types = this.activeParams.types.filter(item => item !== appliedFilter.urlParam);
    }
    this.activeParams.page = 1
    this.router.navigate(['/catalog'], {queryParams: this.activeParams}).then();
  }

  toggleSorting(): void {
    this.sortingOpen = !this.sortingOpen;
  }

  sort(value: string): void {
    this.activeParams.sort = value;
    this.router.navigate(['/catalog'], {queryParams: this.activeParams}).then();
  }

  openPage(page: number): void {
    this.activeParams.page = page;
    this.router.navigate(['/catalog'], {queryParams: this.activeParams}).then();
  }

  openPrevPage(): void {
    if (this.activeParams.page && this.activeParams.page > 1) {
      this.activeParams.page--;
      this.router.navigate(['/catalog'], {queryParams: this.activeParams}).then();
    }
  }

  openNextPage(): void {
    if (this.activeParams.page && this.activeParams.page < this.pages.length) {
      this.activeParams.page++;
      this.router.navigate(['/catalog'], {queryParams: this.activeParams}).then();
    }
  }

}
