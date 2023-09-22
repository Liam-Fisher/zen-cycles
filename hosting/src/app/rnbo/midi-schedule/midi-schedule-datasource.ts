import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge } from 'rxjs';
/*
export interface MidiScheduleItem {
  time: number;
  pitch: number;
  velocity: number;
  duration: number;
}
*/
// TODO: Replace this with your own data model type
export interface MidiScheduleItem {
  time: number;
  pitch: number;
  velocity: number;
  duration: number;
  interonset: number;  
}

// TODO: replace this with real data from your application
const EXAMPLE_DATA: MidiScheduleItem[] = [
{
  time: 0,
  pitch: 60,
  velocity: 90,
  duration: 1.,
  interonset: 4
},
{
  time: 400,
  pitch: 63,
  velocity: 85,
  duration: 1.,
  interonset: 8
},
{
  time: 1200,
  pitch: 67,
  velocity: 90,
  duration: 1.,
  interonset: 4
},
{
  time: 1600,
  pitch: 71,
  velocity: 95,
  duration: 1.,
  interonset: 12
},
{
  time: 2800,
  pitch: 72,
  velocity: 100,
  duration: 0.1,
  interonset: 12
}
];

/**
 * Data source for the MidiSchedule view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class MidiScheduleDataSource extends DataSource<MidiScheduleItem> {
  data: MidiScheduleItem[] = EXAMPLE_DATA;
  paginator: MatPaginator | undefined;
  sort: MatSort | undefined;
  constructor() {
    super();
  }
  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<MidiScheduleItem[]> {
    if (this.paginator && this.sort) {
      // Combine everything that affects the rendered data into one update
      // stream for the data-table to consume.
      return merge(observableOf(this.data), this.paginator.page, this.sort.sortChange)
        .pipe(map(() => {
          return this.getPagedData(this.getSortedData([...this.data ]));
        }));
    } else {
      throw Error('Please set the paginator and sort on the data source before connecting.');
    }
  }
  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect(): void {}
  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getPagedData(data: MidiScheduleItem[]): MidiScheduleItem[] {
    if (this.paginator) {
      const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
      return data.splice(startIndex, this.paginator.pageSize);
    } else {
      return data;
    }
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: MidiScheduleItem[]): MidiScheduleItem[] {
    if (!this.sort || !this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort?.direction === 'asc';

      if (this.sort?.active) {
        return (a.time < b.time ? -1 : 1) * (isAsc ? 1 : -1);
      }
      return 0;
    });
  }
}

