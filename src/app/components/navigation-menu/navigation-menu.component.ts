import {Component, OnInit} from '@angular/core';
import {NavigationConfig} from "@@app/models/navigation-config";
import {NavigationItem} from "@@app/models/navigation-item";
import {NavigationMenuRestService} from "@@app/rest/navigation-menu-rest.service";

@Component({
  selector: 'app-navigation-menu',
  templateUrl: 'navigation-menu.component.html',
  styleUrls: ['navigation-menu.component.scss']
})
export class NavigationMenuComponent implements OnInit {

  public items: NavigationItem[];

  constructor(private navigationMenuRestService: NavigationMenuRestService) {
    this.items = [];
  }

  ngOnInit(): void {
    this.navigationMenuRestService.getNavItems$().subscribe((navConfig: NavigationConfig) => {
      this.items = navConfig.items;
    })
  }
}
