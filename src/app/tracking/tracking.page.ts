import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController, Platform, ToastController } from '@ionic/angular';
import { TicketComponent } from '../components/ticket/ticket.component';
import { Observable } from 'rxjs';
import { GlobalService, TicketData } from '../services/global.service';

@Component({
  selector: 'app-tracking',
  templateUrl: './tracking.page.html',
  styleUrls: ['./tracking.page.scss'],
})
export class TrackingPage implements OnInit {

  public ticketDataList: TicketData[];
  isTrackingPageHasSeen: boolean = false;

  loading: any;
  modelData: any;

  constructor(
    private loadingController: LoadingController,
    private globalService: GlobalService,
    private modalController: ModalController) {
    this.InitializeLoadingCtrl();
  }

  DoRefresh(event?: any) {
    this.GetTicketDataListByUser();

    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.InitializeData();
  }

  async InitializeLoadingCtrl() {
    this.loading = await this.loadingController.create({
      mode: 'ios'
    });
  }

  async InitializeData() {
    if (!this.isTrackingPageHasSeen)
      await this.GetTicketDataListByUser();
  }

  public async GetTicketDataListByUser() {
    const loading = await this.loadingController.create();
    await loading.present();

    this.ticketDataList = [];
    var data = this.globalService.GetTicketDataListByUser();
    this.SubscribeGetTicketDataListByUser(data, loading);
  }

  private SubscribeGetTicketDataListByUser(data: Observable<any>, loading: HTMLIonLoadingElement) {
    data.subscribe(
      async (data: any) => {
        // console.log(data);

        if (data.isSuccess) {
          this.MappingTicketData(data.data);
          this.isTrackingPageHasSeen = true;
          await loading.dismiss();
        }
        else {
          this.globalService.PresentToast(data.message);
          await loading.dismiss();
        }
      }
    );
  }

  private MappingTicketData(result: any) {
    var length: number = result.length;

    for (let i = length - 1; i >= -0; i--) {
      var ticketData = new TicketData;
      ticketData.trx_ticket_id = result[i].trx_ticket_id.toString();
      ticketData.trx_ticket_user_id = result[i].trx_ticket_user_id;
      ticketData.trx_ticket_date_created = result[i].trx_ticket_date_created ? result[i].trx_ticket_date_created.split(' ')[0] : "-";
      ticketData.trx_ticket_date_respond = result[i].trx_ticket_date_respond ? result[i].trx_ticket_date_respond.split(' ')[0] : "-";
      ticketData.trx_ticket_date_closed = result[i].trx_ticket_date_closed ? result[i].trx_ticket_date_closed.split(' ')[0] : "-";
      ticketData.trx_ticket_tipe = result[i].trx_ticket_tipe;
      ticketData.trx_ticket_reference_id = result[i].trx_ticket_reference_id;
      ticketData.trx_ticket_tujuan_alasan = result[i].trx_ticket_tujuan_alasan;
      ticketData.trx_ticket_rincian = result[i].trx_ticket_rincian;
      ticketData.trx_ticket_cara = result[i].trx_ticket_cara;
      ticketData.trx_ticket_lampiran = result[i].trx_ticket_lampiran;
      ticketData.trx_ticket_replyadmin = result[i].trx_ticket_replyadmin ? result[i].trx_ticket_replyadmin : "-";
      ticketData.trx_ticket_rating = result[i].trx_ticket_rating;
      ticketData.trx_ticket_status = result[i].trx_ticket_status;

      this.ticketDataList.push(ticketData);
    }
  }

  public async ShowDetailTicket(ticketData) {
    const modal = await this.modalController.create({
      component: TicketComponent,
      initialBreakpoint: 0.6,
      breakpoints: [0, 0.6, 0.95],
      mode: 'md',
      componentProps: {
        'ticketData': ticketData
      }
    });
    // modal.present();
    modal.onDidDismiss().then((modelData) => {
      if (modelData.role == "confirm") {
        if (modelData.data.dataPassing == "CANCELTICKET") {
          console.log("harusnya jalanin GetTicketDataListByUser lagi");

          this.GetTicketDataListByUser();
        }
      }
    })

    return await modal.present();
  }
}
