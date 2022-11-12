import { ComponentRef, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { PagenotfoundComponent } from './components/pagenotfound/pagenotfound.component';
import { RegistroComponent } from './components/registro/registro.component';
import { DepartamentosComponent } from './components/pags/departamentos/departamentos.component';
import { ArriendoComponent } from './components/pags/departamentos/arriendo/arriendo.component';
import { TestComponent } from './components/test/test.component';
import { AdminComponent } from './components/pags/admin/admin.component';
import { UsersComponent } from './components/pags/admin/users/users.component';
import { DeptosComponent } from './components/pags/admin/deptos/deptos.component';
import { ReservasComponent } from './components/pags/reservas/reservas.component';
import { EstadisticasComponent } from './components/pags/admin/estadisticas/estadisticas.component';

/* == Rutas de navegacion == */
const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent },
  {path: 'login', component: LoginComponent},  
  {path: 'registro', component: RegistroComponent}, /* ,canActivate: metodo/funcion que gestiona el permiso de ingresar a la pagina por tipo de usuario */
  {path: 'departamentos', component: DepartamentosComponent},
  {path: 'arriendo', component: ArriendoComponent},
  {path: 'test', component: TestComponent},
  {path: 'admin', component: AdminComponent},
  {path: 'users', component: UsersComponent},
  {path: 'deptos', component: DeptosComponent},
  {path: 'reservas', component: ReservasComponent},
  {path: 'estadisticas', component: EstadisticasComponent},


  /* Siempre al final */
  {path: '**', component: PagenotfoundComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation:'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
