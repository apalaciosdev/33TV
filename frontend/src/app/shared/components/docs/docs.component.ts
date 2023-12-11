import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Teams } from 'src/app/views/home/models/home.models';
import { RequestService } from '../../services/request.service';
import { AppSettings } from 'src/app/app.settings';
import ipServerData from '../../../../../../ipServer.json';


@Component({
  selector: 'app-docs',
  templateUrl: './docs.component.html',
  styleUrls: ['./docs.component.scss']
})
export class DocsComponent implements OnInit {
  url: string = '';

  constructor(
    public requestService: RequestService,
    private router: Router
  ) { }

  ngOnInit() {
    const ipAddress = ipServerData.ipCableada || ipServerData.ipWifi || 'localhost';
    this.url = `http://${ipAddress}:4200`;
  }
}
