import { Component } from '@angular/core'
import { RouteService } from "~/app/service/route.service";

@Component({
  selector: 'ns-app',
  templateUrl: './app.component.html',
})
export class AppComponent {
  constructor(private routeService: RouteService){}
}
