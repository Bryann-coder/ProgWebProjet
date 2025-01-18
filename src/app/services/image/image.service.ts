import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from '../../@core/environnment';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private apiUrl = `${environment.imageUrl}`;

  constructor(private sanitizer: DomSanitizer) { }

  
  sanitizeUrl(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }
  // construction de l'url de l'image
  getImageUrl(imageUrl:string): string {
    return `${this.apiUrl}/${imageUrl} `;
  }

  updateImageUrl(imageUrl: string): string{
    return this.getImageUrl(imageUrl) as string;
  }
}
