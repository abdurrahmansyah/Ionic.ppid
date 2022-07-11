import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { Storage } from '@capacitor/storage';

export const BLANKPAGE_KEY = 'blankpage-seen';

@Injectable({
  providedIn: 'root'
})
export class StandardGuard implements CanLoad {
  constructor(private router: Router) { }

  async canLoad(): Promise<boolean> {
    const hasSeenBlankPage = await Storage.get({ key: BLANKPAGE_KEY });
    if (hasSeenBlankPage && (hasSeenBlankPage.value === 'true')) {
      // this.router.navigateByUrl('/welcome', { replaceUrl:true });
      return true;
    } else {
      this.router.navigateByUrl('/blank-loading', { replaceUrl: true });
      return false;
    }
  }
}
