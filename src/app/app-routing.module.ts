import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { AuthGuard } from "./auth/auth.guard";

const routes: Routes = [
  {
    path: "auth",
    loadChildren: "./auth/auth.module#AuthModule",
  },
  { path: "", redirectTo: "/calendar", pathMatch: "full" },
  {
    path: "calendar",
    loadChildren: "./calendar/calendar.module#CalendarModule",
  },
  {
    path: "editor",
    loadChildren: "./editor/editor.module#EditorModule",
  },
  {
    path: "stats",
    loadChildren: "./stats/stats.module#StatsModule",
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class AppRoutingModule {}
