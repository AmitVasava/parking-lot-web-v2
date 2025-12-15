import { Component, ViewChild } from '@angular/core';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';
import { Sidebar } from './components/sidebar/sidebar';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [MatSidenavModule, RouterOutlet, Header, Sidebar],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
})
export class Layout {
  @ViewChild('sidenav') sidenav!: MatSidenav;

  toggleSidebar() {
    this.sidenav.toggle();
  }
}
