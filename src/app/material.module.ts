import { NgModule } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material';




@NgModule({
    declarations: [],
    imports: [
        MatListModule,
        MatMenuModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule
    ],
    exports: [
        MatListModule,
        MatMenuModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule
    ],
    providers: [],
    bootstrap: []
})
export class MaterialModule { }
