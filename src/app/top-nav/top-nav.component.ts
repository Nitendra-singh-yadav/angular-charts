import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.scss']
})
export class TopNavComponent implements OnInit {
  storedTheme = localStorage.getItem('theme') || 'purple';

  themes: { name: string, class: string }[] = [
    { name: 'Dark Mode', class: 'gray' },
    { name: 'Light Mode', class: 'purple' }
  ];
  constructor() { }

  ngOnInit(): void {
    if (this.storedTheme) {
      this.selectedTheme(this.storedTheme)
    }
  }

  selectedTheme(theme: any): void {
    localStorage.setItem('theme', theme);
    if (document.getElementsByTagName('body')[0].classList.contains(theme)) { return; }
    this.storedTheme = localStorage.getItem('theme') as any;
    const classList = document.getElementsByTagName('body')[0].classList;
    for (const thm of this.themes) {
      if (classList.contains(thm.class)) {
        document.getElementsByTagName('body')[0].classList.replace(thm.class, theme);
        return;
      }
    }
    document.getElementsByTagName('body')[0].classList.add(theme);
  }

}
