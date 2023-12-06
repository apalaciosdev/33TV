import { NgModule } from '@angular/core';
import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from 'src/app/shared/authguard.guard';

//Components
import { HomeComponent } from '../components/home.component';



const routes: Routes = [
  // {path: '', component: HomeComponent},
  // {path: 'home', component: HomeComponent},
  // {path: 'marketplace', component: MarketplaceComponent},
  // {path: 'product-details/:id', component: ProductInfoComponent},
  // {path: 'register', component: RegisterComponent},
  // {path: 'login', component: LoginComponent},
  // {path: 'cart', component: CartComponent},
  // {path: 'check-out', component: CheckOutComponent},
  // {path: 'product-support', component: ProductSupport},
  // {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
  // {path: 'my-products', component: UserProductsComponent, canActivate: [AuthGuard]},
  // {path: 'edit-product/:id', component: EditProductComponent, canActivate: [AuthGuard]},
  // {path: 'profile', component: EditUserComponent, canActivate: [AuthGuard]},
  // {path: 'create-product', component: CreateProductComponent, canActivate: [AuthGuard]},
  {path: '', component: HomeComponent},
  // {path: '**', component: PageNotFoundComponent}
  // {path: 'products', component: ProductsGridComponent},
  // {path: 'addproduct', component: InputProductsComponent},
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class HomeRoutingModule { }