import { Component, OnInit } from '@angular/core';
import ipServerData from '../../../../../../ipServer.json';


@Component({
  selector: 'app-docs',
  templateUrl: './docs.component.html',
  styleUrls: ['./docs.component.scss']
})
export class DocsComponent implements OnInit {
  url: string = '';

  constructor(
 
  ) { }

  ngOnInit() {
    const ipAddress = ipServerData.ipCableada || ipServerData.ipWifi || 'localhost';
    this.url = `http://${ipAddress}:4200`;
  }
}
