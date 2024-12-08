import { Color, type Launchpad, type PadXY } from "../launchpad";
import { Adapter } from "./adapter";
import { TemperatureLightZigbee, BrightLightZigbee } from "mqtt-assistant/dist/components/zigbee/devices/switches/base";

export class ZigbeeLightAdapter implements Adapter {
    component: BrightLightZigbee;
    pad: PadXY;
    launchpad: Launchpad;
    pressed: boolean = false
    altMode: boolean = false

    constructor(
        component: BrightLightZigbee,
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
                        this.enterHoldMode()
                    }
                }, 200)
            } else {
                this.pressed = false
                if (this.altMode) {
                    this.exitHoldMode()
                    this.altMode = false
                } else {
                    this.component.toggle();
                }
            }
        });
        this.updatePadColor(component.state);
        this.component.on(this.component.events.state, (state: boolean) => {
            this.updatePadColor(state);
        });
    }

    protected enterHoldMode() {
        this.launchpad.faderOn(Math.ceil(this.component.brightness.state / 32))
        this.addFaderCallbacks((heightSelected) => {
            this.component.setOn({ brightness: heightBrigtness[heightSelected] }),
                this.launchpad.faderOn(heightSelected + 1)
        })
    }

    protected exitHoldMode() {
        this.launchpad.faderOff()
        this.clearFaderCallbacks()
        this.launchpad.optionsOff()
    }

    private addFaderCallbacks(callback: (heightSelected: number) => void) {
        for (let i = 0; i < 8; i++) {
            this.launchpad.addCallback({ x: 8, y: i }, (state) => {
                if (state) callback(i)
            })
        }
    }
    private clearFaderCallbacks() {
        for (let i = 0; i < 8; i++) {
            this.launchpad.clearCallbacks({ x: 8, y: i })
        }
    }

    protected addOptionCallbacks(callback: (optionSelected: number) => void) {
        for (let i = 0; i < 8; i++) {
            this.launchpad.addCallback({ x: i, y: 8 }, (state) => {
                if (state) callback(i)
            })
        }
    }

    protected clearOptionCallbacks() {
        for (let i = 0; i < 8; i++) {
            this.launchpad.clearCallbacks({ x: i, y: 8 })
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

export class TemperatureLightZigbeeAdapter extends ZigbeeLightAdapter {
    component: TemperatureLightZigbee;

    constructor(
        component: TemperatureLightZigbee,
        launchpad: Launchpad,
        padXY: PadXY,
    ) {
        super(component, launchpad, padXY)
        this.component = component
    }

    protected enterHoldMode() {
        super.enterHoldMode()
        this.launchpad.optionsOn([Color.WARM_WHITE, Color.WHITE])
        this.addOptionCallbacks((optionSelected: number) => {
            optionSelected == 0 ? this.component.colorTemp.set(450) : this.component.colorTemp.set(251)
        })
    }
    protected exitHoldMode() {
        super.exitHoldMode()
        this.launchpad.optionsOff()
        this.clearOptionCallbacks()
    }

}

const heightBrigtness = [2, 36, 72, 109, 145, 182, 218, 254]