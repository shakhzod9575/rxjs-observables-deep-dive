import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { interval, Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  clickCount = signal(0);
  clickCount$ = toObservable(this.clickCount);
  interval$ = interval(1000);
  intervalSignal = toSignal(this.interval$);

  customInterval$ = new Observable((subscriber) => {
    let timesExecuted = 0;
    const interval = setInterval(() => {
      if (timesExecuted > 3) {
        clearInterval(interval);
        subscriber.complete();
        return;
      }
      console.log('Emitting value...');
      subscriber.next({message: 'New Value'});
      timesExecuted++;
    }, 2000);
  });

  private destroyRef = inject(DestroyRef);

  constructor() {

  }

  ngOnInit(): void {

    this.customInterval$.subscribe({
      next: (val) => console.log(val),
      complete: () => console.log('Custom interval completed.')
    });

    const subscription = this.clickCount$.subscribe({
      next: (val) => console.log(`Clicked button ${val} times.`)
    });

    // Clean up the subscription when the component is destroyed
    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  onClick() {
    this.clickCount.update(count => count + 1);
  }
}
