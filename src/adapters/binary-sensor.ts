import { StatefulComponent } from "mqtt-assistant/dist/components/component";
import { Color, type Launchpad, type PadXY } from "../launchpad";
import { Adapter } from "./adapter"

export class BinarySensorAdapter implements Adapter {
    component: StatefulComponent<boolean>;
    pad: PadXY;
    launchpad: Launchpad;

    constructor(
        component: StatefulComponent<boolean>,
        launchpad: Launchpad,
        padXY: PadXY,
    ) {
        this.component = component;
        this.pad = padXY;
        this.launchpad = launchpad;
        this.updatePadColor(component.state);
        this.component.on(this.component.events.state, (state: boolean) => {
            this.updatePadColor(state);
        });
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