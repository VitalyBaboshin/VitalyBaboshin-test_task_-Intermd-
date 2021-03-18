import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewEncapsulation,
} from "@angular/core";

@Component({
    selector: "z-spinner",
    templateUrl: "./spinner.component.html",
    styleUrls: ["./spinner.component.scss"]
})
export class SpinnerComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit {
    public hidden: boolean = false;

    private readonly animationTime: number = 1800;
    private readonly fps: number = 40;
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private start: Date;
    private readonly lines: number = 13;
    private cH: number = 0;
    private cW: number = 0;
    private radius: number = 0;
    private centerX: number = 0;
    private centerY: number = 0;
    private interval: number;
    /* tslint:disable:typedef */
    private drawPointer;
    /* tslint:enable:typedef */
    @Input("size") public size: number = 48;
    @Input("valign") public valign: string = "sub";

    constructor(private readonly el: ElementRef, private zone: NgZone, private readonly cdRef: ChangeDetectorRef) {

    }

    public ngOnInit(): void {
        this.canvas = this.el.nativeElement.children[0];
        this.context = this.canvas.getContext("2d");
    }

    public ngAfterViewInit(): void {
        this.init(this.size);
    }

    public ngOnChanges(simpleChanges: SimpleChanges): void {
        if (simpleChanges.size && simpleChanges.size.currentValue !== simpleChanges.size.previousValue) {
            this.init(simpleChanges.size.currentValue);
        }
    }

    public ngOnDestroy(): void {
        clearInterval(this.interval);
    }

    private init(size: number): void {
        this.start = new Date();
        this.cH = size;
        this.cW = size;
        this.radius = size / 40;
        this.centerX = 12.5 * this.radius;
        this.centerY = 12.5 * this.radius;
        if (this.interval) {
            return;
        }
        this.drawPointer = () => this.draw();
        this.interval = window.setInterval(this.drawPointer, 1000 / this.fps);
    }

    private draw(): void {
        const rotation =
            Math.round(((new Date().getTime() - this.start.getTime()) / this.animationTime) * this.lines) / this.lines;
        this.context.save();
        this.context.clearRect(0, 0, this.cW, this.cH);
        this.context.translate(this.cW / 2, this.cH / 2);
        this.context.rotate(Math.PI * 2 * rotation);
        for (let i = 0; i < this.lines; i++) {
            this.context.beginPath();
            this.context.arc(
                this.centerX,
                this.centerY,
                this.radius + (i * this.radius * 1.2) / this.lines,
                2 * Math.PI,
                0,
            );
            this.context.fillStyle = "rgba(153, 153, 153," + (i + 10) / this.lines + ")";
            this.context.fill();
            this.context.rotate((Math.PI * 2) / this.lines);
        }
        this.context.restore();
    }

}
