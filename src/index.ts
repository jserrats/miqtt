import 'dotenv/config'
import { zigbee, esphome, assistant } from "mqtt-assistant"
import { Launchpad } from './launchpad'
import { SwitchAdapter } from './adapters/switch'
import { BinarySensorAdapter } from './adapters/binary-sensor'
import { ZigbeeLightAdapter, TemperatureLightZigbeeAdapter } from './adapters/light'
import { PublishMqttAdapter } from './adapters/publish'
console.log("[i] Starting miqtt")

const launchpad = new Launchpad()

// studio
new TemperatureLightZigbeeAdapter(new zigbee.TemperatureLightZigbee("studio_light"), launchpad, { x: 0, y: 0 })
new SwitchAdapter(new zigbee.PowerE1603("workshop_power"), launchpad, { x: 1, y: 0 })
new SwitchAdapter(new zigbee.PowerE1603("studio_fan"), launchpad, { x: 2, y: 0 })
new SwitchAdapter(new zigbee.PowerE1603("3dprinter"), launchpad, { x: 3, y: 0 })
new SwitchAdapter(new zigbee.PowerE1603("desk_power"), launchpad, { x: 4, y: 0 })
new ZigbeeLightAdapter(new zigbee.LightZigbee("studio_shelf_light"), launchpad, { x: 5, y: 0 })
new BinarySensorAdapter(new zigbee.ClosureSensorZigbee("studio_window_closure_sensor"), launchpad, { x: 7, y: 0 })
new SwitchAdapter(new zigbee.PowerE1603("desktop_light"), launchpad, { x: 3, y: 1 })
new PublishMqttAdapter(launchpad, { topic: "homeassistant/custom/spotify", payload: "play" }, { x: 4, y: 1 })
new PublishMqttAdapter(launchpad, { topic: "homeassistant/custom/spotify", payload: "next" }, { x: 5, y: 1 })
new SwitchAdapter(new zigbee.PowerZigbee("bluetooth_audio_input"), launchpad, { x: 4, y: 2 })
new SwitchAdapter(new zigbee.PowerZigbee("	bluetooth_audio_input"), launchpad, { x: 5, y: 2 })


// music
new TemperatureLightZigbeeAdapter(new zigbee.TemperatureLightZigbee("mood_music_light"), launchpad, { x: 0, y: 1 })
new BinarySensorAdapter(new zigbee.ClosureSensorZigbee("music_window_closure_sensor"), launchpad, { x: 7, y: 1 })

// laundry
new TemperatureLightZigbeeAdapter(new zigbee.TemperatureLightZigbee("laundry_light"), launchpad, { x: 0, y: 3 })
new BinarySensorAdapter(new zigbee.PresenceSensorZigbee("laundry_presence"), launchpad, { x: 7, y: 3 })

// lobby
new TemperatureLightZigbeeAdapter(new zigbee.TemperatureLightZigbee("lobby_light"), launchpad, { x: 0, y: 4 })
new BinarySensorAdapter(new zigbee.ClosureSensorZigbee("door_closure_sensor", { inverted: true }), launchpad, { x: 6, y: 4 })
new BinarySensorAdapter(new esphome.BinarySensorESPHome("lobby", "main_door"), launchpad, { x: 7, y: 4 })

// kitchen
new SwitchAdapter(new esphome.SwitchESPHome("sandwich", "sandwich"), launchpad, { x: 0, y: 5 })
new BinarySensorAdapter(new assistant.BinaryMQTTSensor("airfryer_binary"), launchpad, { x: 7, y: 5 })
new PublishMqttAdapter(launchpad, { topic: "homeassistant/custom/clean/kitchen", payload: "" }, { x: 1, y: 5 })

// living room
new SwitchAdapter(new zigbee.PowerE1603("livingroom_smooth_lights"), launchpad, { x: 0, y: 6 })
new SwitchAdapter(new esphome.LightESPHome("bedroom", "nightstand_led"), launchpad, { x: 1, y: 6 })

// bedroom 
new TemperatureLightZigbeeAdapter(new zigbee.TemperatureLightZigbee("bedroom_left_light"), launchpad, { x: 0, y: 7 })
new TemperatureLightZigbeeAdapter(new zigbee.TemperatureLightZigbee("bedroom_right_light"), launchpad, { x: 1, y: 7 })
new SwitchAdapter(new zigbee.PowerE1603("bedroom_fan"), launchpad, { x: 2, y: 7 })
new SwitchAdapter(new zigbee.PowerE1603("mosquito_power"), launchpad, { x: 3, y: 7 })
new SwitchAdapter(new esphome.LightESPHome("bedroom", "nightstand_led"), launchpad, { x: 4, y: 7 })
new SwitchAdapter(new zigbee.PowerZigbee("bedroom_mood_light"), launchpad, { x: 5, y: 7 })