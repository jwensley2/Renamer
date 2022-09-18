import mitt, {Emitter} from 'mitt';

type Events = {
    showSettings: void,
}

const events: Emitter<Events> = mitt<Events>();

export default events;