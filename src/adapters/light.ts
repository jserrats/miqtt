import { Color, type Launchpad, type PadXY } from "../launchpad";
import { zigbee } from "mqtt-assistant";
import { Adapter } from "./adapter";

export class ZigbeeLightAdapter implements Adapter {
    component: zigbee.LightZigbee;
    pad: PadXY;
    launchpad: Launchpad;
    pressed: boolean = false
    altMode: boolean = false

    constructor(
        component: zigbee.LightZigbee,
        launchpad: Launchpad,
        padXY: PadXY,
    ) {
        this.component = component;
        this.pad = padXY;
        this.launchpad = launchpad;
        launchpad.addCallback(padXY, (pressed) => {
            if (pressed) {
                this.pressed = true
                setTimeout(() => {
                    if (this.pressed) {
                        this.altMode = true
                        this.launchpad.faderOn(Math.ceil(this.component.brightness / 32))
                        this.addFaderCallbacks((heightSelected) => {
                            this.component.setOn({ brightness: heightBrigtness[heightSelected] }),
                                this.launchpad.faderOn(heightSelected + 1)
                        })
                    }
                }, 200)
            } else {
                this.pressed = false
                if (this.altMode) {
                    this.launchpad.faderOff()
                    this.clearFaderCallbacks()
                    this.altMode = false
                } else {
                    this.component.toggle();
                }
            }
        });
        this.updatePadColor(component.state);
        this.component.on("state", (state: boolean) => {
            this.updatePadColor(state);
        });
    }

    private addFaderCallbacks(callback: (heightSelected: number) => void) {
        for (let i = 0; i < 8; i++) {
            this.launchpad.addCallback({ x: 8, y: i }, () => {
                callback(i)
            })
        }
    }
    private clearFaderCallbacks() {
        for (let i = 0; i < 8; i++) {
            this.launchpad.clearCallbacks({ x: 8, y: i })
        }
    }
    private updatePadColor(state: boolean) {
        if (state === undefined) {
            this.launchpad.setSolidColor(this.pad, Color.STATE_UNDEFINED);
        } else {
            this.launchpad.setSolidColor(
                this.pad,
                state ? Color.STATE_ON : Color.STATE_OFF,
            );
        }
    }
}

const heightBrigtness = [2, 36, 72, 109, 145, 182, 218, 254]