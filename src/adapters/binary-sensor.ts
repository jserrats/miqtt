import type { EventEmitter } from "node:events";
import type { BinarySensor } from "mqtt-assistant/src/components/interfaces/binary-sensor";
import { Color, type Launchpad, type PadXY } from "../launchpad";
import { Adapter } from "./adapter"

export class BinarySensorAdapter implements Adapter {
    component: BinarySensorComponent;
    pad: PadXY;
    launchpad: Launchpad;

    constructor(
        component: BinarySensorComponent,
        launchpad: Launchpad,
        padXY: PadXY,
    ) {
        this.component = component;
        this.pad = padXY;
        this.launchpad = launchpad;
        this.updatePadColor(component.state);
        this.component.on("state", (state: boolean) => {
            this.updatePadColor(state);
        });
        setTimeout(() => { this.updatePadColor(this.component.state) }, 1000)
    }

    private updatePadColor(state?: boolean) {
        if (state === undefined) {
            this.launchpad.setSolidColor(this.pad, Color.STATE_UNDEFINED);
        } else {
            this.launchpad.setSolidColor(
                this.pad,
                state ? Color.PURPLE : Color.ORANGE,
            );
        }
    }
}

type BinarySensorComponent = BinarySensor & EventEmitter;
