import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-lavanderia',
  templateUrl: './lavanderia.page.html',
  styleUrls: ['./lavanderia.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class LavanderiaPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
