let midi = null;

function onMIDISuccess(midiAccess) {
    console.log('MIDI Ready');
    midi = midiAccess;

    const inputs = midiAccess.inputs.values();
    const outputs = midiAccess.outputs.values();
    midiAccess.onstatechange = (event) => {
        listInputsAndOutputs(event);
        
    }
    Array.from(midiAccess.inputs).forEach((input) => {
        input[1].onmidimessage = (msg) => {console.log(msg)};
    })
}

function onMIDIFail(msg) {
    console.error(`Failed to get MIDI access- ${msg}`);
}

navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFail);

function onMIDIMessage(event) {
    let str = ``;
    for (const character of event.data) {
        str += `0x${character.toString(16)}`;
    }
    console.log(str);
}

function startLoggingMIDIInput(midiAccess, indexOfPort) {
    midiAccess.inputs.forEach((entry) => {entry.onmidimessage = onMIDIMessage});
}

function listInputsAndOutputs(midiAccess) {
    for (const entry of midiAccess.inputs) {
        const input = entry[1];
        console.log(`Input port [type: '${input.type}']` + 
        ` id: '${input.id}'` +
        `name: '${input.name}'`);
    }
    for (const entry of midiAccess.outputs) {
        const output = entry[1];
        console.log(`Output port [type: '${output.type}'] id: '${output.id}' name: '${output.name}'`);
    }
}