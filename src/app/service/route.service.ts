import { Injectable } from "@angular/core";
import { filter, pairwise } from "rxjs/operators";
import { Router, RoutesRecognized } from "@angular/router";

@Injectable({ providedIn: "root" })
export class RouteService {
  previousUrl: string = ""

  constructor(private router: Router) {
    this.router.events
      .pipe(
        filter((evt: any) => evt instanceof RoutesRecognized),
        pairwise()
      )
      .subscribe((events: RoutesRecognized[]) => {
        // console.log("current url", events[1].urlAfterRedirects);
        this.previousUrl = events[0].urlAfterRedirects;
      });
  }

  getPreviousPageUrl() {
    return this.previousUrl;
  }
}
