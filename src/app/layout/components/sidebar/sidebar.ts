import { Component, inject, signal } from '@angular/core';
import { Router, NavigationEnd, RouterLink } from '@angular/router';
import { MatNavList, MatListItem, MatListItemTitle } from '@angular/material/list';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [MatNavList, MatListItem, RouterLink, MatListItemTitle],
  templateUrl: './sidebar.html',
})
export class Sidebar {
  private router = inject(Router);

  menuItems = signal([
    { label: 'Manage Floors', route: '/floors' },
    { label: 'Park Vehicle', route: '/parking' },
    { label: 'Tickets', route: '/tickets' },
  ]);

  active = signal<string>('');

  constructor() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.updateActive(event.urlAfterRedirects);
      }
    });

    this.updateActive(this.router.url);
  }

  private updateActive(url: string) {
    const matched = this.menuItems().find((item) => url.startsWith(item.route));

    this.active.set(matched ? matched.route : '');
  }
}
