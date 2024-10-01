import { DOCUMENT } from '@angular/common';
import { Component, inject } from '@angular/core';
import { InputSwitchModule } from 'primeng/inputswitch';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-toggle-theme',
  standalone: true,
  imports: [FormsModule, InputSwitchModule],
  templateUrl: './toggle-theme.component.html',
  styleUrl: './toggle-theme.component.css'
})
export class ToggleThemeComponent {
  checked: boolean = true;
  #document = inject(DOCUMENT);
  isDarkMode = false;

  constructor() {
    if (this.isSystemDark()) {
      this.toggleLightDark();
    }
  }
  /**
   * Toggles the theme of the application between light and dark.
   * If the current theme is light, it switches to dark and vice versa.
   * The theme is switched by changing the href attribute of the <link> element with id 'app-theme'.
   * The href attribute is set to either 'theme-light.css' or 'theme-dark.css' depending on the current theme.
   */
  toggleLightDark() {
    const linkElement = this.#document.getElementById(
      'app-theme',
    ) as HTMLLinkElement;
    if (linkElement.href.includes('light')) {
      linkElement.href = 'theme-dark.css';
      this.isDarkMode = true;
    } else {
      linkElement.href = 'theme-light.css';
      this.isDarkMode = false;
    }
  }

  /**
   * Checks if the system prefers a dark color scheme.
   *
   * @returns `true` if the system prefers a dark color scheme, `false` otherwise.
   */
  isSystemDark(): boolean {

    return window?.matchMedia?.('(prefers-color-scheme:dark)')?.matches;
  }

}
