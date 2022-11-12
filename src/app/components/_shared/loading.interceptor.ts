import { Observable, tap } from "rxjs";
import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpResponse } from "@angular/common/http";
import { HttpRequest, HttpHandler, HttpEvent } from "@angular/common/http";
import { LoaderService } from "../_services/loader.service";

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {

    constructor(private loaderService: LoaderService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        
        this.loaderService.show();

        return next
            .handle(req)
            .pipe(
                // tap((event: HttpEvent<any>) => {
                //     if (event instanceof HttpResponse) {
                //         this.loaderService.hide();
                //     }
                // }, (error) => {
                //     this.loaderService.hide();
                // })
                tap({
                    next: (event: HttpEvent<any>) => {
                            if (event instanceof HttpResponse) {
                                this.loaderService.hide();
                            }
                        },
                    error: err => {
                            this.loaderService.hide();
                        }
                })
            )
    }
}