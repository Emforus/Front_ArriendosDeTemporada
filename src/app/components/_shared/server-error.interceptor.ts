import { Router } from "@angular/router";
import { environment } from "src/environments/environment";
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from "@angular/material/snack-bar";
import { Injectable } from "@angular/core";
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse } from "@angular/common/http";
import { Observable, EMPTY } from "rxjs";
import { tap, catchError, retry } from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class ServerErrorInterceptor implements HttpInterceptor {

    horizontalPosition: MatSnackBarHorizontalPosition = 'right';
    verticalPosition: MatSnackBarVerticalPosition = 'top';

    constructor(
        private snackBar: MatSnackBar,
        private router: Router
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            retry(2),
            tap(event => {
                if (event instanceof HttpResponse) {
                    if (event.body && event.body.error === true && event.body.errorMessage) {
                        throw new Error(event.body.errorMessage)
                    } // else {
                    //     this.snackBar.open("EXITO", 'AVISO', {duration: 5000, 
                    //         horizontalPosition: this.horizontalPosition, verticalPosition: this.verticalPosition})
                    // }
                }
            }),
            catchError((err) => {
                console.warn(err);

                if (err.status === 400 && err.error['error'] === "invalid grant" && err.error['error_description'] === "Bad credentials") {
                    this.snackBar.open("Solicitud Invalida", 'ERROR 401', {duration: 6000, 
                        horizontalPosition: this.horizontalPosition, verticalPosition: this.verticalPosition})
                    localStorage.clear();
                    this.router.navigate(['/home']);
                } else if (err.status === 400) {
                    this.snackBar.open(err.message, 'ERROR 400', {duration: 6000, 
                        horizontalPosition: this.horizontalPosition, verticalPosition: this.verticalPosition})

                } else if (err.status === 401) {
                    this.snackBar.open("Acceso denegado (credenciales incorrectas o cuenta deshabilitada)", 'ERROR 401', {duration: 6000, 
                        horizontalPosition: this.horizontalPosition, verticalPosition: this.verticalPosition})
                    // localStorage.clear();
                    // this.router.navigate(['/home']);
                } else if (err.status === 404) {
                    this.snackBar.open("No existe el recurso", 'ERROR 404', {duration: 6000, 
                        horizontalPosition: this.horizontalPosition, verticalPosition: this.verticalPosition})
                    // localStorage.clear();
                    // this.router.navigate(['/home']);
                } else if (err.status === 403) {
                    this.snackBar.open(err.error.error_description, 'ERROR 403', {duration: 6000, 
                        horizontalPosition: this.horizontalPosition, verticalPosition: this.verticalPosition})
                    // localStorage.clear();
                    // this.router.navigate(['/home']);
                } else if (err.status === 500) {
                    this.snackBar.open(err.error.message, 'ERROR 500', {duration: 6000, 
                        horizontalPosition: this.horizontalPosition, verticalPosition: this.verticalPosition})
                    // localStorage.clear();
                    // this.router.navigate(['/home']);
                } else {
                    this.snackBar.open(err.error.message, 'ERROR', {duration: 6000, 
                        horizontalPosition: this.horizontalPosition, verticalPosition: this.verticalPosition})
                }
                return EMPTY;
            })
        )
    }
}