import { NgModule } from '@angular/core';
import { AlLoginComponent } from '../al-login/al-login.component';
import { MaterialModule } from '../material.module';

import {
    SocialLoginModule,
    AuthServiceConfig,
    GoogleLoginProvider,
    FacebookLoginProvider,
} from "angular-6-social-login";


// Configs 
export function getAuthServiceConfigs() {
    let config = new AuthServiceConfig(
        [
            {
                id: GoogleLoginProvider.PROVIDER_ID,
                provider: new GoogleLoginProvider("693118017511-lnnh3dkqdi5963ptq15oleg3olt1lsn7.apps.googleusercontent.com")
            }
        ]
    );
    return config;
}

@NgModule({
    declarations: [
        AlLoginComponent
    ],
    imports: [
        SocialLoginModule,
        MaterialModule
    ],
    exports: [
        AlLoginComponent
    ],
    providers: [{ provide: AuthServiceConfig, useFactory: getAuthServiceConfigs }],
    bootstrap: []
})
export class LoginModule { }
