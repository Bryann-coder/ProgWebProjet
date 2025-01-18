import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PageRefreshService {

  constructor() { }

  /**
   * Méthode pour rafraîchir la page entière.
   */
  refreshPage(): void {
    setTimeout(() => {
      window.location.reload();
    }, 2000); 
  }

  /**
   * Méthode pour rafraîchir un élément spécifique du DOM (plus optimisée que `reload`).
   */
  refreshComponent(callback: () => void): void {
    callback();
  }
}
