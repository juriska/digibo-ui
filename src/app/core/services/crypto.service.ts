import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {
  private readonly API_URL = 'http://localhost:3000/api/auth';
  private cachedKey: CryptoKey | null = null;

  constructor(private http: HttpClient) {}

  async encryptPassword(password: string): Promise<string> {
    const key = await this.getPublicKey();
    const encoded = new TextEncoder().encode(password);
    const encrypted = await crypto.subtle.encrypt(
      { name: 'RSA-OAEP' },
      key,
      encoded
    );
    return btoa(String.fromCharCode(...new Uint8Array(encrypted)));
  }

  private async getPublicKey(): Promise<CryptoKey> {
    if (this.cachedKey) {
      return this.cachedKey;
    }

    const response = await firstValueFrom(
      this.http.get<{ publicKey: string }>(`${this.API_URL}/public-key`, { withCredentials: true })
    );

    const binaryString = atob(response.publicKey);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    this.cachedKey = await crypto.subtle.importKey(
      'spki',
      bytes.buffer,
      { name: 'RSA-OAEP', hash: 'SHA-256' },
      false,
      ['encrypt']
    );

    return this.cachedKey;
  }
}
