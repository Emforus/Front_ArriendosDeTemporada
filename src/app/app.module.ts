import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatBadgeModule } from '@angular/material/badge';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateModule } from '@angular/material-moment-adapter';
import { MatMomentDateModule } from '@angular/material-moment-adapter';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegistroComponent } from './components/registro/registro.component';
import { NavmenuComponent } from './components/navmenu/navmenu.component';
import { PagenotfoundComponent } from './components/pagenotfound/pagenotfound.component';
import { FooterComponent } from './components/footer/footer.component';
import { InicioComponent } from './components/pags/inicio/inicio.component';
import { ArriendoComponent } from './components/pags/departamentos/arriendo/arriendo.component';
import { DepartamentosComponent } from './components/pags/departamentos/departamentos.component';
import { TestComponent } from './components/test/test.component';
import { AdminComponent } from './components/pags/admin/admin.component';
import { UsersComponent } from './components/pags/admin/users/users.component';
import { NotificacionComponent } from './components/notificacion/notificacion.component';
import { ServerErrorInterceptor } from './components/_shared/server-error.interceptor';
import { LoadingInterceptor } from './components/_shared/loading.interceptor';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { UserEditComponent } from './components/pags/admin/users/user-edit/user-edit.component';
import { UserDetailComponent } from './components/pags/admin/users/user-detail/user-detail.component';
import { PerfilComponent } from './components/pags/perfil/perfil.component';
import { DeptosComponent } from './components/pags/admin/deptos/deptos.component';
import { DeptoDetailComponent } from './components/pags/admin/deptos/depto-detail/depto-detail.component';
import { DeptoEditComponent } from './components/pags/admin/deptos/depto-edit/depto-edit.component';
import { MatPaginatorImpl } from './components/_services/mat-paginator';
import { DetalleDepartamentoComponent } from './components/pags/departamentos/detalle-departamento/detalle-departamento.component';
import { ReservasComponent } from './components/pags/reservas/reservas.component';
import { EstadisticasComponent } from './components/pags/admin/estadisticas/estadisticas.component';
import { EstadisticasDetalleMesComponent } from './components/pags/admin/estadisticas/estadisticas-detalle-mes/estadisticas-detalle-mes.component';
import { RecepcionComponent } from './components/pags/recepcion/recepcion.component';
import { CheckinComponent } from './components/pags/recepcion/checkin/checkin.component';
import { CheckoutComponent } from './components/pags/recepcion/checkout/checkout.component';

import * as CanvasJSAngularChart from 'src/canvasjs.angular.component';
import { ServiciosComponent } from './components/pags/admin/servicios/servicios.component';
import { ServicioDetailComponent } from './components/pags/admin/servicios/servicio-detail/servicio-detail.component';
import { ServicioEditComponent } from './components/pags/admin/servicios/servicio-edit/servicio-edit.component';
import { EstadisticasDetalleDepartamentoComponent } from './components/pags/admin/estadisticas/estadisticas-detalle-departamento/estadisticas-detalle-departamento.component';
var CanvasJSChart = CanvasJSAngularChart.CanvasJSChart;

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CanvasJSChart,
    LoginComponent,
    RegistroComponent,
    DepartamentosComponent,
    NavmenuComponent,
    PagenotfoundComponent,
    FooterComponent,
    InicioComponent,
    ArriendoComponent,
    TestComponent,
    AdminComponent,
    UsersComponent,
    NotificacionComponent,
    ConfirmDialogComponent,
    UserEditComponent,
    UserDetailComponent,
    PerfilComponent,
    DeptosComponent,
    DeptoDetailComponent,
    DeptoEditComponent,
    DetalleDepartamentoComponent,
    ReservasComponent,
    EstadisticasComponent,
    EstadisticasDetalleMesComponent,
    RecepcionComponent,
    CheckinComponent,
    CheckoutComponent,
    ServiciosComponent,
    ServicioDetailComponent,
    ServicioEditComponent,
    EstadisticasDetalleDepartamentoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CommonModule,
    FlexLayoutModule,
    BrowserAnimationsModule,
    MatCheckboxModule,
    MatCheckboxModule,
    MatButtonModule,
    MatInputModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatRadioModule,
    MatSelectModule,
    MatSliderModule,
    MatMenuModule,
    MatBadgeModule,
    MatToolbarModule,
    MatListModule,
    MatGridListModule,
    MatCardModule,
    MatStepperModule,
    MatTabsModule,
    MatExpansionModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatDialogModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MomentDateModule,
    MatMomentDateModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ServerErrorInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true
    },
    {
      provide: MatPaginatorIntl,
      useClass: MatPaginatorImpl
    },
    {
      provide: MAT_DATE_LOCALE,
      useValue: 'es'
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
