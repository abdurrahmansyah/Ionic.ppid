import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PengajuanKeberatanPage } from './pengajuan-keberatan.page';

describe('PengajuanKeberatanPage', () => {
  let component: PengajuanKeberatanPage;
  let fixture: ComponentFixture<PengajuanKeberatanPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PengajuanKeberatanPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PengajuanKeberatanPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
