import {Pipe, PipeTransform, NgZone, ChangeDetectorRef, OnDestroy} from "@angular/core";
@Pipe({
	name:'timeFuture',
	pure:false
})
export class TimeFuturePipe implements PipeTransform, OnDestroy {
  private timer: number | null;
	constructor(private changeDetectorRef: ChangeDetectorRef, private ngZone: NgZone) {}
	transform(value:string) {
		this.removeTimer();
		let d = new Date(value);
		let now = new Date();
    if (Math.round((d.getTime() - now.getTime())/1000) <= 0) {
      return 'Expire';
    }
		let seconds = Math.round(Math.abs((d.getTime() - now.getTime())/1000));
		let timeToUpdate = this.getSecondsUntilUpdate(seconds) *1000;
		this.timer = this.ngZone.runOutsideAngular(() => {
			if (typeof window !== 'undefined') {
				return window.setTimeout(() => {
					this.ngZone.run(() => this.changeDetectorRef.markForCheck());
				}, timeToUpdate);
			}
			return null;
		});
		let minutes = Math.round(Math.abs(seconds / 60));
		let hours = Math.round(Math.abs(minutes / 60));
		let days = Math.round(Math.abs(hours / 24));
		let months = Math.round(Math.abs(days/30.416));
		let years = Math.round(Math.abs(days/365));
		if (seconds <= 45) {
			return 'A few seconds remaining';
		} else if (seconds <= 60) {
			return '1 minute remaining';
		} else if (minutes <= 59) {
			return minutes + ' minutes remaining';
		} else if (minutes <= 60) {
			return '1 hour remaining';
		} else if (hours <= 23) {
			return hours + ' hours remaining';
		} else if (hours <= 36) {
			return '1 day remaining';
		} else if (days <= 31) {
			return days + ' days remaining';
		} else if (days <= 45) {
			return 'a month remaining';
		} else if (days <= 345) {
			return months + ' months remaining';
		} else if (days <= 545) {
			return 'a year remaining';
		} else { // (days > 545)
			return years + ' years remaining';
		}
	}
	ngOnDestroy(): void {
		this.removeTimer();
	}
	private removeTimer() {
		if (this.timer) {
			window.clearTimeout(this.timer);
			this.timer = null;
		}
	}
	private getSecondsUntilUpdate(seconds:number) {
		let min = 60;
		let hr = min * 60;
		let day = hr * 24;
		if (seconds < min) { // less than 1 min, update ever 2 secs
			return 2;
		} else if (seconds < hr) { // less than an hour, update every 30 secs
			return 30;
		} else if (seconds < day) { // less then a day, update every 5 mins
			return 300;
		} else { // update every hour
			return 3600;
		}
	}
}