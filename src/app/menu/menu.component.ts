import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { IonButton, IonItem, IonLabel, IonInput, IonList, IonContent, IonMenu, IonToolbar
  ,IonHeader, IonTitle
 } from '@ionic/angular/standalone';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  standalone: true,
  imports: [IonButton, IonItem, IonLabel, IonInput, IonList, IonContent, IonMenu, IonToolbar
    ,IonHeader, IonTitle]

})
export class MenuComponent {
  constructor(private menu: MenuController) {}

  closeMenu() {
    this.menu.close();
  }
}

