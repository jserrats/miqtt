import { Color, type Launchpad, type PadXY } from "../launchpad";
import { client } from "mqtt-assistant/dist/mqtt";

export class PublishMqttAdapter {
    pad: PadXY;
    launchpad: Launchpad;
    constructor(
        launchpad: Launchpad,
        mqtt: { topic: string, payload: string },
        padXY: PadXY,
    ) {
        this.pad = padXY;
        this.launchpad = launchpad;
        launchpad.addCallback(padXY, (pressed) => {
            if (!pressed) {
                client.publish(mqtt.topic, mqtt.payload)
            }
        });
        this.launchpad.setSolidColor(
            this.pad,
            Color.WHITE,
        );
    }
}

