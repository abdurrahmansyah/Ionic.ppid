import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, } from '@ionic/angular';
import { Observable } from 'rxjs';
import { ApiImage, GlobalService, TicketData } from 'src/app/services/global.service';
import { PhotoService } from 'src/app/services/photo.service';

@Component({
  selector: 'app-pengajuan-keberatan',
  templateUrl: './pengajuan-keberatan.page.html',
  styleUrls: ['./pengajuan-keberatan.page.scss'],
})
export class PengajuanKeberatanPage implements OnInit {
  credentials: FormGroup;
  images: ApiImage[] = [];
  isUserDataComplete: boolean = false;
  acuanInformasiList = [];
  public photo: any;
  public ticketDataList: TicketData[];
  isReferenceTicket: boolean = false;

  constructor(
    private fb: FormBuilder,
    private globalService: GlobalService,
    private router: Router,
    private alertController: AlertController,
    private photoService: PhotoService,
  ) {
    this.GetTicketDataListByUser();

    if (!this.isReferenceTicket) {
      if (!this.CheckUserData()) {
        this.PresentAlertAccount('Data diri belum lengkap! Silahkan update data diri terlebih dahulu');
      }
    } else this.PresentAlertAccount('Anda tidak memiliki daftar permohonan informasi yang bisa diajukan keberatan!');
  }

  private CheckAndGetReferenceTicket() {
    this.GetTicketDataListByUser();
  }

  public GetTicketDataListByUser() {
    this.ticketDataList = [];
    var data = this.globalService.GetTicketDataListByUser();
    this.SubscribeGetTicketDataListByUser(data);
  }

  private SubscribeGetTicketDataListByUser(data: Observable<any>) {
    data.subscribe((data: any) => {
      if (data.isSuccess) {
        this.MappingTicketData(data.data);

      } else {
        // this.globalService.PresentToast(data.message);
      }
    }
    );
  }

  private MappingTicketData(result: any) {
    var length: number = result.length;

    for (let i = length - 1; i >= -0; i--) {
      // var ticketData = new TicketData;
      // ticketData.trx_ticket_id = result[i].trx_ticket_id.toString();
      // ticketData.trx_ticket_user_id = result[i].trx_ticket_user_id;
      // ticketData.trx_ticket_date_created = result[i].trx_ticket_date_created ? result[i].trx_ticket_date_created.split(' ')[0] : "-";
      // ticketData.trx_ticket_date_respond = result[i].trx_ticket_date_respond ? result[i].trx_ticket_date_respond.split(' ')[0] : "-";
      // ticketData.trx_ticket_date_closed = result[i].trx_ticket_date_closed ? result[i].trx_ticket_date_closed.split(' ')[0] : "-";
      // ticketData.trx_ticket_tipe = result[i].trx_ticket_tipe;
      // ticketData.trx_ticket_reference_id = result[i].trx_ticket_reference_id;
      // ticketData.trx_ticket_tujuan_alasan = result[i].trx_ticket_tujuan_alasan;
      // ticketData.trx_ticket_rincian = result[i].trx_ticket_rincian;
      // ticketData.trx_ticket_cara = result[i].trx_ticket_cara;
      // ticketData.trx_ticket_lampiran = result[i].trx_ticket_lampiran;
      // ticketData.trx_ticket_replyadmin = result[i].trx_ticket_replyadmin ? result[i].trx_ticket_replyadmin : "-";
      // ticketData.trx_ticket_rating = result[i].trx_ticket_rating;
      // ticketData.trx_ticket_status = result[i].trx_ticket_status;

      // this.ticketDataList.push(ticketData);
      if (result[i].trx_ticket_status == this.globalService.statusTransaksiData.DITOLAK || result[i].trx_ticket_status == this.globalService.statusTransaksiData.CLOSE) {
        var trx_ticket_date_created = result[i].trx_ticket_date_created ? result[i].trx_ticket_date_created.split(' ')[0] : "-";
        this.acuanInformasiList.push({ id: trx_ticket_date_created + ' ' + result[i].trx_ticket_tujuan_alasan, value: result[i].trx_ticket_id.toString() });
      }
    }

    if (this.acuanInformasiList.length > 0) this.isReferenceTicket = true;
  }

  private CheckUserData(): boolean {
    if (this.globalService.userData.md_user_status != this.globalService.statusUserData.KYCVERIFIED) {
      return false;
    }
    else return true;
  }

  private PresentAlertAccount(message: string) {
    this.alertController.create({
      mode: 'ios',
      message: message,
      cssClass: 'alert-akun',
      buttons: [{
        text: 'OK',
        handler: () => {
          this.router.navigate(['/tabs/account']);
        }
      }]
    }).then(alert => {
      return alert.present();
    });
  }

  ngOnInit() {
    this.credentials = this.fb.group({
      name: [{ value: this.globalService.userData.md_user_name, disabled: true }, [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
      acuan: ['', [Validators.required]],
      alasan: ['', [Validators.required]],
      rincian: ['', [Validators.required]],
      lampiran: [{ value: '', disabled: true }, [Validators.required]],
    });
  }

  get name() {
    return this.credentials.get('name');
  }

  get acuan() {
    return this.credentials.get('acuan');
  }

  get alasan() {
    return this.credentials.get('alasan');
  }

  get rincian() {
    return this.credentials.get('rincian');
  }

  get lampiran() {
    return this.credentials.get('lampiran');
  }

  async AjukanKeberatan() {
    this.credentials.controls['lampiran'].enable();
    this.globalService.CreateAjuanKeberatan(this.credentials.value);
    this.credentials.controls['lampiran'].disable();
  }

  public async TakeAPhoto() {
    this.alertController.create({
      mode: 'ios',
      message: 'Usahakan Foto dengan Posisi Kamera Landscape!',
      cssClass: 'alert-akun',
      buttons: [{
        text: 'Batal',
        role: 'Cancel'
      }, {
        text: 'Lanjut',
        handler: async () => {
          const image = await this.photoService.ChooseFromGallery();
          this.photo = this.photoService.ConvertPhotoBase64ToImage(image.base64String);

          this.credentials.controls['lampiran'].setValue(image.base64String);
        }
      }]
    }).then(alert => {
      return alert.present();
    });
  }
}
