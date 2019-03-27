import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {
  AuthService,
  FacebookLoginProvider,
  GoogleLoginProvider
} from 'angular-6-social-login';

@Component({
  selector: 'al-login',
  templateUrl: './al-login.component.html',
  styleUrls: ['./al-login.component.scss']
})
export class AlLoginComponent implements OnInit {
  @Output() onSignIn: EventEmitter<any>;


  constructor(private socialAuthService: AuthService) {
    this.onSignIn = new EventEmitter();
  }

  public socialSignIn(socialPlatform: string) {
    let socialPlatformProvider;
    if (socialPlatform == "google") {
      socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
    }

    this.socialAuthService.signIn(socialPlatformProvider).then(r => r);


  }

  ngOnInit() {
    this.socialAuthService.authState.subscribe(r => {
      this.onSignIn.emit(r);
    });
  }

}
