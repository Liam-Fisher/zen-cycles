import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MidiScheduleDataSource, MidiScheduleItem } from './midi-schedule-datasource';

@Component({
  selector: 'app-midi-schedule',
  templateUrl: './midi-schedule.component.html',
  styleUrls: ['./midi-schedule.component.scss']
})
export class MidiScheduleComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<MidiScheduleItem>;
  dataSource: MidiScheduleDataSource;
  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['time', 'pitch', 'velocity','duration','interonset'];

  constructor() {
    this.dataSource = new MidiScheduleDataSource();
  }
  fillTable(items: MidiScheduleItem[]) {
    this.dataSource.data = items;
    this.table.renderRows();
  }
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }
}
