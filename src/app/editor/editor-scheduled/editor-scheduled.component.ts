import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-editor-scheduled",
  templateUrl: "./editor-scheduled.component.html",
  styleUrls: ["./editor-scheduled.component.scss"],
})
export class EditorScheduledComponent implements OnInit {
  shiftId: string;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.shiftId = this.route.snapshot.paramMap.get("shiftId");
  }
}
