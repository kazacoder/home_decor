import { Component, OnInit } from '@angular/core';
import {DeliveryType} from "../../../../types/delivery.type";
import {PaymentType} from "../../../../types/payment.type";
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit {
  userInfoForm: FormGroup = this.fb.group({
    firstName: [''],
    lastName: [''],
    fatherName: [''],
    phone: [''],
    paymentType: [PaymentType.cashToCourier],
    email: [''],
    street: [''],
    house: [''],
    entrance: [''],
    apartment: [''],
  });
  deliveryType: DeliveryType = DeliveryType.delivery;
  paymentTypes = PaymentType;
  deliveryTypes = DeliveryType;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
  }

  changeDeliveryType(deliveryType: DeliveryType) {
    this.deliveryType = deliveryType;
  }

  updateUserInfo() {

  }

}
