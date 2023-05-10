const scenes = [
    'Arcade',
    'Bay Cedar',
    'Rover',
    'Pandanus',
    'Pandanus Stochastic',
    'Fractal',
    'Bare Tree',
    'Oak Tree',
    'Arcade Envmap',
    'Bay Cedar Envmap',
    'Rover Envmap',
    'Pandanus Envmap',
    'Fractal Envmap',
    'City Houses 1',
    'City Houses 2',
]

const methods = [{
    path: "512",
    name: "LoD 0"
}, {
    path: "256",
    name: "LoD 1"
}, {
    path: "128",
    name: "LoD 2"
}, {
    path: "64",
    name: "LoD 3"
}, {
    path: "32",
    name: "LoD 4"
}, {
    path: "16",
    name: "LoD 5"
}, {
    path: "8",
    name: "LoD 6"
}];

var data = {
    "imageBoxes": scenes.map(scene => ({
        title: scene,
        elements: methods.map(method => ({
            title: method.name,
            image: `./results/${scene}_lod_${method.path}.png`,
            ref_image: `./results/${scene}_ref_${method.path}.png`,
            error_image: `./results/${scene}_error_${method.path}.png`
        }))
    }))
};

var imageBoxSettings = {"zoom": 0.05, "width": 1024, "height": 1024};
