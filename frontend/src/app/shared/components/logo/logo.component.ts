import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="inline-flex items-center gap-2 font-black tracking-tight" [ngClass]="dark ? 'text-white' : 'text-[#1A1A1A]'">
      <div class="w-9 h-9 rounded-full bg-[#F5C518] flex items-center justify-center text-[#1A1A1A] shadow-sm">
        <i class="fa-solid fa-motorcycle text-base"></i>
      </div>
      <div class="flex items-center text-xl font-extrabold tracking-tight">
        <span>MOTO</span><span class="text-[#F5C518]">TAXI</span>
      </div>
    </div>
  `
})
export class LogoComponent {
  @Input() dark: boolean = false;
}
