import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { ApiService } from 'src/_services/api.service';
import { ChartType, Row, GOOGLE_CHARTS_CONFIG, GoogleChartComponent } from 'angular-google-charts';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  /** Based on the screen size, switch from standard to one column per row */
  type: ChartType = ChartType.PieChart
  lineType: ChartType = ChartType.LineChart
  columnType: ChartType = ChartType.ColumnChart
  pieOptions = {
    pieHole: 0.4,
    chartArea: {
      height: "94%",
      width: "94%"
    }
  };

  lineOptions = {
    chartArea: {
      height: "84%",
      width: "60%"
    }
  }

  stackedColumnOptions = {
    legend: { position: 'top', maxLines: 3 },
    bar: { groupWidth: '75%' },
    isStacked: true,
    hAxis: {
      title: 'Keywords'
    }
  }
  donutChartData: any[] = [];
  lineChartData: any[] = [];
  cards = this.breakpointObserver.observe(Breakpoints.Medium || Breakpoints.Small || Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        this.lineWidth = 370;
        this.width = 400;
      }

      else {
        this.width = 650;
        this.lineWidth = 850;
      }
    })
  );
  cols = ['keyword', 'facebook', 'twitter', 'youtube', 'instagram', 'reddit', 'others']
  data: Row[] = []
  apiData: { keyword: string, source: string, value: string }[] = [];
  mydata = {}
  width: number = 400;
  lineWidth = 850;

  chartHeight = window.innerHeight * 0.35
  chartWidth = window.innerWidth * 0.18
  showChart: boolean = true;
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {

    this.showChart = false;
    setTimeout(() => {
      this.showChart = true;
    });
    this.chartWidth = window.innerWidth * 0.18 //set an appropriate  factor
    this.chartHeight = window.innerHeight * 0.35
  }

  constructor(private breakpointObserver: BreakpointObserver, private api: ApiService) { }
  ngOnInit(): void {
    this.api.get('', {}).subscribe(data => {
      this.apiData = data.data;
      this.parseData();
    })

  }
  parseData() {
    let kws = {} as any
    const knownSources = ['facebook', 'twitter', 'youtube', 'instagram', 'reddit']
    let donut = {} as any;
    let line = {} as any;
    this.apiData.forEach(row => {
      if (!kws[row.keyword])
        kws[row.keyword] = {}

      if (knownSources.includes(row.source)) {
        kws[row.keyword][row.source] = row.value;
      }
      else if (kws[row.keyword].others) {
        kws[row.keyword].others += row.value;
      }
      else {
        kws[row.keyword].others = row.value;
      }
      if (donut[row.source])
        donut[row.source] += parseInt(row.value);
      else if (knownSources.includes(row.source))
        donut[row.source] = parseInt(row.value);
      else if (donut.others)
        donut.others += parseInt(row.value)
      else
        donut.others = parseInt(row.value)
      if (!line[row.keyword])
        line[row.keyword] = [];
      if (row.source == 'facebook')
        line[row.keyword][1] = parseInt(row.value)
      else if (row.source == 'twitter')
        line[row.keyword][2] = parseInt(row.value)
      else if (row.source == 'youtube')
        line[row.keyword][3] = parseInt(row.value)
      else if (row.source == 'instagram')
        line[row.keyword][4] = parseInt(row.value)
      else if (row.source == 'reddit')
        line[row.keyword][5] = parseInt(row.value)
      else if (line[row.keyword].others)
        line[row.keyword][6] += parseInt(row.value)
      else
        line[row.keyword][6] = parseInt(row.value)
    })
    for (let row in kws) {
      kws[row].keyword = row;
      this.data.push(kws[row])
    }
    for (let key in donut) {
      this.donutChartData.push([key, donut[key]])
    }

    for (let key in line) {
      line[key][0] = key;
      this.lineChartData.push(line[key])
    }

  }

  getDimValue(val: any): string {
    val = parseInt(val);
    if (val < 5000)
      return '40px';
    else if (val < 30000)
      return '60px';
    else if (val < 60000)
      return '80px';
    else
      return '100px';
  }
}
