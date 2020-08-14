import { Observable, Subject } from 'rxjs';
import { ActionType } from './constants';

export class ZoKratesWebWorker {

    private worker: Worker;
    private messageSubject = new Subject<MessageEvent>();
    private errorSubject = new Subject<ErrorEvent>();

    constructor() {
        this.worker = new Worker('./worker.js');
        this.worker.onmessage = (data) => this.messageSubject.next(data);
        this.worker.onerror = (data) => this.errorSubject.next(data);
    }

    postMessage(type: ActionType, payload: any) {
        this.worker.postMessage({ type, payload });
    }

    onMessage(): Observable<MessageEvent> {
        return this.messageSubject.asObservable();
    }

    onError(): Observable<ErrorEvent> {
        return this.errorSubject.asObservable();
    }

    terminate(): void {
        this.worker.terminate();
    }
}