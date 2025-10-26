import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Register } from "./app/pages/register/register";
import { HttpClientModule } from '@angular/common/http'; // ✅ ต้องมี
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, Register,HttpClientModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'GameKek';
}
