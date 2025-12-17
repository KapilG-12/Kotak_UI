import { Injectable } from '@angular/core';
@Injectable()
export class Globalconstants {
  readonly baseAPIUrl:
    
    // Change the SSO URL as per the patch deployment in login-new.component.ts

    // string = 'http://localhost:50831/api/';

    string = 'https://dmstest.crownims.com/KotakAPI/api/';  //SSO Testing 

    // string = 'https://demodart.crownims.com/KotakAPI/api/';   //Internal Test

    // string = 'https://kotakprime.crownims.com/KotakDartAPI/api/';   //Kotak Prime Live URL
}