import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'count-selector',
  templateUrl: './count-selector.component.html',
  styleUrls: ['./count-selector.component.scss']
})
export class CountSelectorComponent implements OnInit {

  @Input()
  count: number = 1;

  @Output() onCountChange: EventEmitter<number> = new EventEmitter<number>();

  constructor() {
  }

  ngOnInit(): void {
  }

  decreaseCount(): void {
    if (this.count > 1) {
      this.count--;
      this.countChange();
    }
  }

  increaseCount(): void {
    this.count++;
    this.countChange();
  }

  countChange(): void {
    this.onCountChange.emit(this.count);
  }
}
