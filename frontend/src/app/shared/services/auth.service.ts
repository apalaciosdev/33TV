import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isLogged(){
    return !!localStorage.getItem('userToken');
  }

  logout() {
    localStorage.removeItem('userToken');
  }
}


