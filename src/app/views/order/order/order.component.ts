import {Component, ElementRef, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {CartService} from "../../../shared/services/cart.service";
import {CartType} from "../../../../types/cart.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {DeliveryType} from "../../../../types/delivery.type";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {PaymentType} from "../../../../types/payment.type";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

  cart: CartType | null = null;
  totalAmount: number = 0;
  totalCount: number = 0;
  delivery: number = 10;
  deliveryType: DeliveryType = DeliveryType.delivery;
  deliveryTypes = DeliveryType;
  paymentTypes = PaymentType;
  @ViewChild('popup') popup!: TemplateRef<ElementRef>;
  dialogRef: MatDialogRef<any> | null = null;

  orderForm: FormGroup = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    fatherName: [''],
    phone: ['', Validators.required],
    paymentType: [PaymentType.cashToCourier, Validators.required],
    email: ['', [Validators.required, Validators.email]],
    street: [''],
    house: [''],
    entrance: [''],
    apartment: [''],
    comment: [''],
  })


  constructor(private cartService: CartService,
              private router: Router,
              private _snackBar: MatSnackBar,
              private fb: FormBuilder,
              private dialog: MatDialog,) {

    this.updateDeliveryTypeValidation()
  }

  ngOnInit(): void {
    this.cartService.getCart()
      .subscribe((data: CartType | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message);
        }
        this.cart = data as CartType;
        if (!this.cart || (this.cart && this.cart.items.length === 0)) {
          this._snackBar.open('Корзина пуста')
          this.router.navigate(['/']).then();
          return;
        }
        this.calculateTotal()
      })
  }

  calculateTotal() {
    this.totalAmount = 0;
    this.totalCount = 0;
    this.cart?.items.forEach(item => {
      this.totalCount += item.quantity;
      this.totalAmount += item.quantity * item.product.price;
    })
  }

  changeDeliveryType(type: DeliveryType) {
    this.deliveryType = type;
    this.updateDeliveryTypeValidation();
  }

  updateDeliveryTypeValidation() {
    if (this.deliveryType === DeliveryType.delivery) {
      this.orderForm.get('street')?.setValidators(Validators.required);
      this.orderForm.get('house')?.setValidators(Validators.required);
    } else {
      this.orderForm.get('street')?.removeValidators(Validators.required);
      this.orderForm.get('house')?.removeValidators(Validators.required);
      this.orderForm.get('street')?.setValue('');
      this.orderForm.get('house')?.setValue('');
      this.orderForm.get('entrance')?.setValue('');
      this.orderForm.get('apartment')?.setValue('');
    }
    this.orderForm.get('street')?.updateValueAndValidity()
    this.orderForm.get('house')?.updateValueAndValidity()
  }

  createOrder(): void {
    this.dialogRef = this.dialog.open(this.popup);
    this.dialogRef.backdropClick().subscribe(() => {
      this.router.navigate(['/']).then();
    })
    if (this.orderForm.valid) {

    } else {
      console.log('Форма не валидна')
    }
  }

  closePopup() {
    this.dialogRef?.close();
    this.router.navigate(['/']).then();
  }

}
