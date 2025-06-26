import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  public hasRightListChanged: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public menuList: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private key = CryptoJS.enc.Utf8.parse('cZgTvjHFs9Bt6rynM2VxQ87E3DmdRUCN');
  private iv = CryptoJS.enc.Utf8.parse('pnjMzUTvtDZYbBEe');
  private message: string = '';

  constructor() { }

  setRightList(rightList: any): void {
    this.hasRightListChanged.next(rightList);
  }

  getMenuAccess() {
    return this.menuList;
  }

  setMenuAccess(menu: any) {
    this.menuList.next(menu);
  }

  decrypt(encryptedText: string): any {
    const decrypted = CryptoJS.AES.decrypt(encryptedText, this.key, {
      iv: this.iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });

    const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedString);
  }

  decryptdata(encryptedText: string): any {
    const decrypted = CryptoJS.AES.decrypt(encryptedText, this.key, {
      iv: this.iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });

    const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);
    return decryptedString;
  }

  encryptData(data: string): string {
    const encrypted = CryptoJS.AES.encrypt(data, this.key, {
      iv: this.iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });

    return encrypted.toString();
  }

  setMessage(msg: string) {
    this.message = msg;
  }

  getMessage(): string {
    const temp = this.message;
    this.message = '';
    return temp;
  }
}
