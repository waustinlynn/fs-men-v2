import { NgModule } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';



@NgModule({
    declarations: [],
    imports: [
        MatListModule,
        MatMenuModule,
        MatButtonModule
    ],
    exports: [
        MatListModule,
        MatMenuModule,
        MatButtonModule
    ],
    providers: [],
    bootstrap: []
})
export class MaterialModule { }
