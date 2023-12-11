import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import * as QRCode from 'qrcode-generator';
import ipServerData from '../../../../../../ipServer.json';

@Component({
  selector: 'app-qr-code',
  template: '<canvas #qrCanvas></canvas>',
  styles: ["canvas { background-color: white; }"]
})
export class QrCodeComponent implements AfterViewInit {
  @ViewChild('qrCanvas', { static: false }) qrCanvas: ElementRef | undefined;

  ngAfterViewInit(): void {
    // Obtén la instancia de la etiqueta canvas
    const canvas: HTMLCanvasElement = this.qrCanvas?.nativeElement;

    // Configura la biblioteca para generar el código QR
    const qr = QRCode(0, 'H');

    const ipAddress = ipServerData.ipCableada || ipServerData.ipWifi || 'localhost';
    const baseUrl = `http://${ipAddress}:4200`; // Reemplaza esto con la URL de tu API
    qr.addData(baseUrl); // Puedes cambiar la URL o el contenido del QR
    qr.make();

    // Configura el contexto del canvas y dibuja el código QR
    const ctx = canvas.getContext('2d');
    const cellSize = 2; // Ajusta el tamaño de cada celda del QR
    const modules = qr.getModuleCount();

    canvas.width = canvas.height = modules * cellSize * 2; // Ajusta el tamaño del canvas
    if(ctx) ctx.fillStyle = 'black';


    for (let row = 0; row < modules; row++) {
      for (let col = 0; col < modules; col++) {
        if (qr.isDark(row, col) && ctx) {
          ctx.fillRect(col * cellSize * 2, row * cellSize * 2, cellSize * 2, cellSize * 2);
        }
      }
    }
  }
}
