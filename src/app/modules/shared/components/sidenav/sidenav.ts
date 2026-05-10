import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MaterialModule} from "../../material-module";
import { RouterModule, RouterOutlet } from '@angular/router';
import { MediaMatcher } from '@angular/cdk/layout';

@Component({
  selector: 'app-sidenav',
  imports: [CommonModule,MaterialModule,RouterOutlet,RouterModule],
  templateUrl: './sidenav.html',
  styleUrl: './sidenav.css',
})
export class Sidenav {
  menuNav = [
  { name: 'Home', route: 'home', icon: 'home' },
  { name: 'Categorias', route: 'category', icon: 'category' },
  { name: 'Productos', route: 'product', icon: 'production_quantity_limits' }
];
  mobileQuery: MediaQueryList;
  constructor(media: MediaMatcher) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
  }
}