import { Component, OnInit } from '@angular/core';
import { ServicesService } from '../../Services/services.service';
import { ActivatedRoute } from '@angular/router';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-facility',
  standalone: true,
  imports: [TableModule],
  templateUrl: './facility.component.html',
  styleUrl: './facility.component.css',
})
export class FacilityComponent implements OnInit {
  constructor(
    private _ServicesService: ServicesService,
    private _ActivatedRoute: ActivatedRoute
  ) {}

  facility: Facility[] = [] as Facility[];

  facilityName: string = '';

  ngOnInit(): void {
    this._ActivatedRoute.params.subscribe((params) => {
      this.facilityName = params['facility'];
    });

    this._ServicesService.getAllFacilities().subscribe({
      next: (res) => {
        this.facility = res.facilities.filter((item: Facility) => {
          return item.type.toLowerCase() === this.facilityName.toLowerCase();
        });
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
}

interface Facility {
  description: string;
  id: number;
  name: string;
  type: string;
  status: string;
}
