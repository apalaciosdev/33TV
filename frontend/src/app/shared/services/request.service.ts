import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { timeout } from 'rxjs/operators';
import ipServerData from '../../../../../ipServer.json';

@Injectable({
  providedIn: 'root',
})
export class RequestService {

  private ipAddress = ipServerData.ipCableada || ipServerData.ipWifi || 'localhost';
  private baseUrl = `http://${this.ipAddress}:2022/api`; // Reemplaza esto con la URL de tu API
  // private timeoutDuration = 100000;

  constructor(private http: HttpClient) {this.readAndLogIPs()}

  readAndLogIPs(): void {
    console.log('IPs from ipServer.json:', ipServerData.ipCableada);
    // Aquí puedes acceder a las IPs individualmente, por ejemplo: ipServerData.ipCableada, ipServerData.ipWifi
  }

  // Función para realizar una solicitud GET
  get<T>(endpoint: string): Observable<T> {
    const url = `${this.baseUrl}${endpoint}`;
    return this.http.get<T>(url);
  }

  // Función para realizar una solicitud POST
  post<T>(endpoint: string, data: any): Observable<T> {
    const url = `${this.baseUrl}${endpoint}`;
    return this.http.post<T>(url, data);
  }

  // Función para realizar una solicitud PUT
  put<T>(endpoint: string, data: any): Observable<T> {
    const url = `${this.baseUrl}${endpoint}`;
    return this.http.put<T>(url, data);
  }

  // Función para realizar una solicitud DELETE
  delete<T>(endpoint: string): Observable<T> {
    const url = `${this.baseUrl}${endpoint}`;
    return this.http.delete<T>(url);
  }
}
