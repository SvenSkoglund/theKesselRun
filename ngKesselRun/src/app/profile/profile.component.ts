import { Category } from './../models/category';
import { CategoryService } from './../category.service';
import { CartService } from './../cart.service';
import { CartItem } from './../models/cart-item';
import { HomeComponent } from './../home/home.component';
import { UserService } from './../user.service';
import { Component, OnInit } from '@angular/core';
import { User } from '../models/user';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { Item } from '../models/item';
import { ItemService } from '../item.service';
import { InventoryService } from '../inventory.service';
import { Inventory } from '../models/inventory';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  // FIELDS
  inventory = new Inventory();
  user = new User();
  updatedUser = new User();
  cartItems: CartItem[] = [];
  showUpdateForm = null;
  showAllItems = null;
  showUserItems = null;
  editItem: Item = null;
  items: Item[] = [];
  selected: Item = null;
  newItem = null;
  // DISPLAY METHODS
  hideAdd() {
    this.newItem = null;
  }
  showProfile() {
    this.hideUpdate();
    this.hideAllItemsList();
  }
  showUpdate() {
    this.hideAllItemsList();
    this.showUpdateForm = true;
  }
  showAllItemsList() {
    this.hideUpdate();
    this.showAllItems = true;
  }
  hideAllItemsList() {
    this.showAllItems = null;
  }
  hideUpdate() {
    this.showUpdateForm = null;
  }
  showAllUserItems() {
    this.showUserItems = true;
    console.log(this.inventory);
    this.inventoryService.index();
    this.hideUpdate();
    this.hideAllItemsList();
  }
  // CRUDS
  show(id) {
    this.itemService.show(id).subscribe(
      data => this.selected = data,
      err => {
        console.log('Unable to load item');
        this.router.navigateByUrl('notFound');
      }
    );


  }
  reload() {
    this.itemService.index().subscribe(
      data => {
        this.items = data;
        console.log(this.items);
      },
      err => {
        console.log('Unable to load items');
        this.router.navigateByUrl('notFound');
      }
    );
  }
  addItem(item) {
    this.itemService.create(this.newItem).subscribe(
      data => this.reload(),
      err => {
        console.log('Unable to create item');
        this.router.navigateByUrl('notFound');
      }
    );
    this.newItem = null;
  }
  getCategoryThenAdd(id: number) {
    console.log('in getCategoryById');
    let category: Category;
    this.catService.show(id).subscribe(
      data => {
        console.log(data);
        this.newItem.category = data;
        category = data;
        this.addItem(this.newItem);
      },
      err => console.log(err)
    );
  }

  setUpCreateDiv() {
    this.newItem = new Item();
  }
  updateUser() {
    if (this.updatedUser.imageUrl) {
      this.user.imageUrl = this.updatedUser.imageUrl;
    }
    this.user.species = this.updatedUser.species;
    console.log(this.updatedUser);
    this.userService.update(this.user).subscribe(
      data => {
        console.log(data);
        this.hideAllItemsList();
        this.hideUpdate();
        this.router.navigateByUrl('profile');
      },
      err => console.log(err)
    );
  }
  getCart(userId) {
    this.cartService.getCartItems(userId).subscribe(
      cartItems => cartItems.forEach(cartItem => {
          this.cartItems.push(cartItem);
      }),
      err => console.log('Error loading cart')
    );
  }
  getCategoryById(id: number) {
    let category: Category;
    this.catService.show(id).subscribe(
      data => category = data,
      err => console.log(err)
    );
  }
  deleteUser() {
    this.userService.destroy(this.user.id).subscribe(
      data => this.router.navigateByUrl('home'),
      err => console.log(err)
    );
  }
  logout() {
    this.authServ.logout();
    this.router.navigateByUrl('home');
    console.log('logged out');
  }

  constructor(private itemService: ItemService, private inventoryService: InventoryService,
    private cartService: CartService, private authServ: AuthService, private catService: CategoryService,
     private router: Router, private userService: UserService, private home: HomeComponent) { }

  ngOnInit() {
    this.user.username = localStorage.getItem('username');
    this.userService.show(this.user.username).subscribe(
      data => {
        this.user = data;
          this.getCart(this.user.id);
          console.log(this.cartItems);

      },
      err => console.log('Could not load user')
    );
  }
}
