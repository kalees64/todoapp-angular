import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [NgIf],
  templateUrl: './badge.component.html',
  styles: ``,
})
export class BadgeComponent {
  @Input() value = '';
  @Input() color = 'primary';
}
